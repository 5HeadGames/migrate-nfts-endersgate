// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "hardhat/console.sol";

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

import "../../interfaces/IERC1155Custom.sol";

/// @title Clock auction for non-fungible tokens.
contract ClockSaleOwnableFindora is
    Ownable,
    Pausable,
    ERC1155Holder,
    ReentrancyGuard
{
    using Address for address payable;

    enum SaleStatus {
        Created,
        Successful,
        Canceled
    }

    struct Sale {
        address seller;
        address nft;
        uint256 nftId;
        uint256 amount;
        uint256 price;
        uint256 duration;
        uint256 startedAt;
        SaleStatus status;
    }

    // Cut owner takes on each auction, measured in basis points (1/100 of a percent).
    // Values 0-10,000 map to 0%-100%
    uint256 public tokenIdTracker;
    address public feeReceiver;
    uint256 public ownerCut;
    uint256 public genesisBlock;

    //All the sales price have to have 6 decimals
    uint256 public decimalsUSD = 6;

    // Map from token ID to their corresponding auction.
    mapping(uint256 => Sale) public sales;
    // Nfts allowed in marketplace
    mapping(address => bool) public isAllowed;

    event SaleCreated(
        uint256 indexed _auctionId,
        address _nft,
        uint256 _nftId,
        uint256 _amount,
        uint256 price,
        uint256 _duration,
        uint256 _startedAt,
        address _seller
    );
    event SaleSuccessful(uint256 indexed _auctionId);
    event BuySuccessful(
        uint256 indexed _auctionId,
        address _buyer,
        uint256 _cost,
        uint256 _nftAmount
    );
    event SaleCancelled(uint256 indexed _auctionId);
    event ChangedFeeReceiver(address newReceiver);

    constructor(address _feeReceiver, uint256 _ownerCut) {
        require(_ownerCut <= 10000, "ClockSale:OWNER_CUT"); //less than 100%
        ownerCut = _ownerCut;
        feeReceiver = _feeReceiver;
        genesisBlock = block.number;
    }

    function getSales(
        uint256[] memory _tokenIds
    ) external view returns (Sale[] memory) {
        Sale[] memory response = new Sale[](_tokenIds.length);

        for (uint256 i = 0; i < _tokenIds.length; i++)
            response[i] = sales[_tokenIds[i]];

        return response;
    }

    function getPrice(
        uint256 _tokenId,
        uint256 quantity
    ) public view returns (uint256) {
        Sale storage _auction = sales[_tokenId];
        require(_isOnSale(_auction), "ClockSale:INVALID_SALE");
        return quantity * _auction.price;
    }

    function isOnSale(uint256 _tokenId) external view returns (bool) {
        Sale storage _auction = sales[_tokenId];
        return _isOnSale(_auction);
    }

    function setFeeReceiver(address _feeReceiver) external onlyOwner {
        feeReceiver = _feeReceiver;
        emit ChangedFeeReceiver(feeReceiver);
    }

    function setOwnerCut(uint256 _ownerCut) external onlyOwner {
        ownerCut = _ownerCut;
    }

    function createSale(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _price,
        uint256 _amount,
        uint256 _duration
    ) external whenNotPaused onlyOwner {
        address _seller = _msgSender();

        require(isAllowed[_nftAddress], "ClockSale:INVALID_SALE");
        require(_owns(_nftAddress, _seller, _tokenId), "ClockSale:NOT_OWNER");
        _escrow(_nftAddress, _seller, _tokenId, _amount);

        Sale memory _auction = Sale(
            _seller,
            _nftAddress,
            _tokenId,
            _amount,
            _price,
            _duration,
            block.timestamp,
            SaleStatus.Created
        );
        _addSale(_auction);
    }

    function buyBatch(
        uint256[] memory tokensId,
        uint256[] memory amounts
    ) public payable {
        require(
            tokensId.length == amounts.length,
            "Array Length must be the same of amount and Ids"
        );
        for (uint256 i = 0; i < tokensId.length; i++) {
            buy(tokensId[i], amounts[i]);
        }
    }

    function buy(
        uint256 _tokenId,
        uint256 amount
    ) public payable nonReentrant whenNotPaused {
        Sale storage _auction = sales[_tokenId];
        uint256 cost = getPrice(_tokenId, amount);

        require(cost != 0, "ClockSale:TOKEN_NOT_ALLOWED");

        address buyer = _msgSender();
        _auction.amount -= amount; //this will underflow if is x < 0

        if (_auction.amount == 0) _finalizeSale(_tokenId);

        require(_isOnSale(_auction), "ClockSale:NOT_AVAILABLE");
        require(msg.value >= cost, "ClockSale:NOT_ENOUGH_VALUE");
        uint256 ownerAmount = (cost * ownerCut) / 10000;
        uint256 sellAmount = cost - ownerAmount;
        address payable seller = payable(_auction.seller);
        (bool success, ) = seller.call{value: sellAmount}("");
        require(success, "Transfer failed.");
        (bool success2, ) = feeReceiver.call{value: ownerAmount}("");
        require(success2, "Transfer failed.");

        _transfer(_tokenId, amount, buyer);
        emit BuySuccessful(_tokenId, buyer, cost, amount);
    }

    function cancelSale(uint256 _tokenId) external onlyOwner {
        Sale storage _auction = sales[_tokenId];
        require(_saleExists(_auction), "ClockSale:NOT_AVAILABLE");
        require(_auction.seller == _msgSender(), "ClockSale:NOT_OWNER");
        _cancelSale(_tokenId);
    }

    function setNftAllowed(address nftAddress, bool allow) external onlyOwner {
        isAllowed[nftAddress] = allow;
    }

    function stopTrading() external onlyOwner whenNotPaused {
        _pause();
    }

    function restartTrading() external onlyOwner whenPaused {
        _unpause();
    }

    function updateSalePrice(
        uint256 saleId,
        uint256 newPrice
    ) external onlyOwner {
        Sale storage _auction = sales[saleId];
        require(_saleExists(_auction), "ClockSale:NOT_AVAILABLE");
        _auction.price = newPrice;
    }

    function updateSaleReceiver(
        uint256 saleId,
        address receiver
    ) external onlyOwner {
        Sale storage _auction = sales[saleId];
        require(_saleExists(_auction), "ClockSale:NOT_AVAILABLE");
        _auction.seller = receiver;
    }

    function _finalizeSale(uint256 tokenId) internal {
        Sale storage _auction = sales[tokenId];
        _auction.status = SaleStatus.Successful;
        emit SaleSuccessful(tokenId);
    }

    function _isOnSale(Sale storage _auction) internal view returns (bool) {
        return (_saleExists(_auction) &&
            _auction.startedAt + _auction.duration > block.timestamp);
    }

    function _saleExists(Sale storage _auction) internal view returns (bool) {
        return (_auction.startedAt > 0);
    }

    function _getNftContract(
        address _nftAddress
    ) internal pure returns (IERC1155Custom) {
        IERC1155Custom candidateContract = IERC1155Custom(_nftAddress);
        return candidateContract;
    }

    function _owns(
        address _nftAddress,
        address _claimant,
        uint256 _tokenId
    ) internal view returns (bool) {
        IERC1155Custom _nftContract = _getNftContract(_nftAddress);
        return (_nftContract.balanceOf(_claimant, _tokenId) > 0);
    }

    function _addSale(Sale memory _auction) internal {
        require(_auction.duration >= 1 minutes, "ClockSale:INVALID_DURATION");

        uint256 auctionID = tokenIdTracker;
        sales[auctionID] = _auction;
        tokenIdTracker++;

        emit SaleCreated(
            auctionID,
            _auction.nft,
            _auction.nftId,
            _auction.amount,
            _auction.price,
            _auction.duration,
            _auction.startedAt,
            _auction.seller
        );
    }

    function _cancelSale(uint256 _tokenId) internal {
        Sale storage _auction = sales[_tokenId];
        _auction.status = SaleStatus.Canceled;
        _transfer(_tokenId, _auction.amount, _auction.seller);
        emit SaleCancelled(_tokenId);
    }

    function _escrow(
        address _nftAddress,
        address _owner,
        uint256 _tokenId,
        uint256 _amount
    ) internal {
        IERC1155Custom _nftContract = _getNftContract(_nftAddress);

        _nftContract.safeTransferFrom(
            _owner,
            address(this),
            _tokenId,
            _amount,
            ""
        );
    }

    function _transfer(
        uint256 _tokenId,
        uint256 amount,
        address _receiver
    ) internal {
        Sale storage _auction = sales[_tokenId];
        IERC1155Custom _nftContract = _getNftContract(_auction.nft);

        _nftContract.safeTransferFrom(
            address(this),
            _receiver,
            _auction.nftId,
            amount,
            ""
        );
    }

    function _beforeTokenTransfer(address from, address to) internal virtual {
        require(
            address(0) == from || address(0) == to,
            "ClockSale:CANNOT_TRANSFER"
        );
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC1155Receiver) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function emergencyWithdraw(
        uint256 amount,
        address token,
        address recipient
    ) external onlyOwner {
        if (token == address(0)) payable(recipient).sendValue(amount);
        else IERC20(token).transfer(recipient, amount);
    }
}
