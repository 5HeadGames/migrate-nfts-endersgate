// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/// @title Clock auction for non-fungible tokens.
contract EndersRentNative is
    ERC1155,
    Ownable,
    Pausable,
    ERC1155Holder,
    ReentrancyGuard
{
    using Address for address payable;

    enum SaleStatus {
        AvailableToRent,
        InRent,
        RentFinished,
        Canceled
    }

    struct Rent {
        address seller;
        address buyer;
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

    // Map from token ID to their corresponding auction.
    mapping(uint256 => Rent) public rents;
    // Nfts allowed in marketplace
    mapping(address => bool) public isAllowed;

    mapping(uint256 => string) public ipfsURIs;

    event RentAuctionCreated(
        uint256 indexed _rentId,
        address _nft,
        uint256 _nftId,
        uint256 priceUSD,
        uint256 _startedAt,
        address _seller
    );
    event RentedSuccessful(
        uint256 indexed _rentId,
        address _buyer,
        uint256 _cost,
        uint256 _daysToRent,
        uint256 _startedAt
    );
    event RentedEnd(uint256 indexed _rentId, address _seller, address _buyer);
    event RentAuctionCancelled(uint256 indexed _rentId);
    event ChangedFeeReceiver(address newReceiver);

    constructor(address _feeReceiver, uint256 _ownerCut) ERC1155("Rent EG") {
        require(_ownerCut <= 10000, "Rental:BAD INPUT IN OWNER CUT"); //less than 100%
        ownerCut = _ownerCut;
        feeReceiver = _feeReceiver;
        genesisBlock = block.number;
    }

    receive() external payable {
        require(false, "Rental:DONT SEND VALUE");
    }

    /* MAIN FUNCTIONS RELATED TO RENT PROCESS */
    function createRent(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _price //consider this has to be with 6 decimals in price
    ) external whenNotPaused {
        address _seller = _msgSender();

        require(isAllowed[_nftAddress], "Rental: INVALID NFT ADDRESS");
        require(_owns(_nftAddress, _seller, _tokenId), "Rental: NOT OWNER");

        _escrow(_nftAddress, _seller, _tokenId, 1);

        Rent memory _rent = Rent(
            _seller,
            address(0),
            _nftAddress,
            _tokenId,
            1,
            _price,
            0,
            block.timestamp,
            SaleStatus.AvailableToRent
        );
        _addRent(_rent);
    }

    function rentBatch(
        uint256[] memory rentId,
        uint256 daysToRent
    ) public payable {
        uint256 length = rentId.length;
        for (uint256 i = 0; i < length; i++) {
            rent(rentId[i], daysToRent);
        }
    }

    function rent(
        uint256 rentId,
        uint256 daysToRent
    ) public payable nonReentrant whenNotPaused {
        Rent storage _rent = rents[rentId];
        uint256 cost = _rent.price * daysToRent;
        require(daysToRent > 0, "Rental:RENT TIME MUST BE GREATER THAN 0");
        require(
            _rent.status == SaleStatus.AvailableToRent,
            "Rental:NFT NOT AVAILABLE TO RENT"
        );

        address buyer = _msgSender();

        require(_isAvailableToRent(_rent), "Rental:NOT AVAILABLE");
        require(msg.value >= cost, "Rental:NOT ENOUGH VALUE");

        uint256 ownerAmount = (cost * ownerCut) / 10000;
        uint256 sellAmount = cost - ownerAmount;

        address payable seller = payable(_rent.seller);

        (bool success, ) = seller.call{value: sellAmount}("");
        require(success, "Transfer failed.");
        (bool success2, ) = feeReceiver.call{value: ownerAmount}("");
        require(success2, "Transfer failed.");

        /* Mint and update rent status */
        _mint(buyer, _rent.nftId, 1, "0x00");
        _rent.status = SaleStatus.InRent;
        _rent.buyer = buyer;
        _rent.duration = daysToRent * 86400;
        _rent.startedAt = block.timestamp;

        setApprovalForAll(address(this), true);

        emit RentedSuccessful(
            rentId,
            buyer,
            cost,
            _rent.duration,
            _rent.startedAt
        );
    }

    function cancelRent(uint256 rentId) external {
        Rent storage _rent = rents[rentId];
        require(_saleExists(_rent), "Rental:NOT_AVAILABLE");
        require(_rent.seller == _msgSender(), "Rental:NOT_OWNER");
        require(_rent.status != SaleStatus.InRent, "Rental:NFT_IN_RENT");
        _cancelRent(rentId);
    }

    function redeemRent(uint256 rentId) external {
        Rent storage _rent = rents[rentId];
        require(_saleExists(_rent), "Rental:NOT_AVAILABLE");
        require(_rent.seller == _msgSender(), "Rental:NOT_OWNER");
        require(_rent.status == SaleStatus.InRent, "Rental:NFT_IN_RENT");
        require(
            block.timestamp >= _rent.duration + _rent.startedAt,
            "Rental:NFT_STILL_IN_RENT"
        );
        _redeemRent(rentId);
    }

    function stopTrading() external onlyOwner whenNotPaused {
        _pause();
    }

    function restartTrading() external onlyOwner whenPaused {
        _unpause();
    }

    /* OVERRIDE TRANSFER */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        uint256 amount,
        bytes memory data
    ) public override {
        require(false, "Rental: WRAPPED NFTS CAN'T BE TRANSFERED");
        super.safeTransferFrom(from, to, tokenId, amount, data);
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public virtual override {
        require(false, "Rental: WRAPPED NFTS CAN'T BE TRANSFERED");
        super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    /* CHANGE CONTRACT SETTINGS FUNCTIONS */

    function setNftAllowed(address nftAddress, bool allow) external onlyOwner {
        isAllowed[nftAddress] = allow;
    }

    function setFeeReceiver(address _feeReceiver) external onlyOwner {
        feeReceiver = _feeReceiver;
        emit ChangedFeeReceiver(feeReceiver);
    }

    function setOwnerCut(uint256 _ownerCut) external onlyOwner {
        ownerCut = _ownerCut;
    }

    function updateSalePrice(
        uint256 saleId,
        uint256 newPrice
    ) external onlyOwner {
        Rent storage _rent = rents[saleId];
        require(_saleExists(_rent), "Rental:NOT_AVAILABLE");
        _rent.price = newPrice;
    }

    function updateSaleReceiver(
        uint256 saleId,
        address receiver
    ) external onlyOwner {
        Rent storage _rent = rents[saleId];
        require(_saleExists(_rent), "Rental:NOT_AVAILABLE");
        _rent.seller = receiver;
    }

    function setIpfsHashBatch(
        uint256[] memory ids,
        string[] memory uris
    ) external onlyOwner {
        for (uint256 i = 0; i < ids.length; i++) {
            if (bytes(uris[i]).length > 0) ipfsURIs[ids[i]] = uris[i];
        }
    }

    /* VIEW FUNCTIONS */

    function getRents(
        uint256[] memory rentIds
    ) external view returns (Rent[] memory) {
        Rent[] memory response = new Rent[](rentIds.length);

        for (uint256 i = 0; i < rentIds.length; i++)
            response[i] = rents[rentIds[i]];
        return response;
    }

    function isOnSale(uint256 rentId) external view returns (bool) {
        Rent storage _rent = rents[rentId];
        return _isAvailableToRent(_rent);
    }

    function uri(uint256 id) public view override returns (string memory) {
        string memory ipfsHash = ipfsURIs[id];
        return ipfsHash;
    }

    /* INTERNAL FUNCTIONS */

    function _isAvailableToRent(
        Rent storage _rent
    ) internal view returns (bool) {
        return (_saleExists(_rent) &&
            _rent.status == SaleStatus.AvailableToRent);
    }

    function _saleExists(Rent storage _rent) internal view returns (bool) {
        return (_rent.nft != address(0));
    }

    function _getNftContract(
        address _nftAddress
    ) internal pure returns (IERC1155) {
        IERC1155 candidateContract = IERC1155(_nftAddress);
        return candidateContract;
    }

    function _owns(
        address _nftAddress,
        address _claimant,
        uint256 rentId
    ) internal view returns (bool) {
        IERC1155 _nftContract = _getNftContract(_nftAddress);
        return (_nftContract.balanceOf(_claimant, rentId) > 0);
    }

    function _redeemRent(uint256 rentId) internal {
        Rent storage _rent = rents[rentId];
        _rent.status = SaleStatus.RentFinished;
        console.log(_rent.buyer);
        _burn(_rent.buyer, _rent.nftId, 1);
        _transfer(rentId, _rent.amount, _rent.seller);
        emit RentedEnd(rentId, _rent.seller, _rent.buyer);
    }

    function _addRent(Rent memory _rent) internal {
        uint256 auctionID = tokenIdTracker;
        rents[auctionID] = _rent;
        tokenIdTracker++;

        emit RentAuctionCreated(
            auctionID,
            _rent.nft,
            _rent.nftId,
            _rent.price,
            _rent.startedAt,
            _rent.seller
        );
    }

    function _cancelRent(uint256 rentId) internal {
        Rent storage _rent = rents[rentId];
        require(
            _rent.status != SaleStatus.InRent,
            "Rental: YOUR NFT IS RENTED, YOU CAN'T CANCEL IT UNTIL THE FINAL DATE"
        );
        _rent.status = SaleStatus.Canceled;
        _transfer(rentId, _rent.amount, _rent.seller);
        emit RentAuctionCancelled(rentId);
    }

    function _escrow(
        address _nftAddress,
        address _owner,
        uint256 rentId,
        uint256 _amount
    ) internal {
        IERC1155 _nftContract = _getNftContract(_nftAddress);

        _nftContract.safeTransferFrom(
            _owner,
            address(this),
            rentId,
            _amount,
            ""
        );
    }

    function _transfer(
        uint256 rentId,
        uint256 amount,
        address _receiver
    ) internal {
        Rent storage _rent = rents[rentId];
        IERC1155 _nftContract = _getNftContract(_rent.nft);

        _nftContract.safeTransferFrom(
            address(this),
            _receiver,
            _rent.nftId,
            amount,
            ""
        );
    }

    function _beforeTokenTransfer(address from, address to) internal virtual {
        require(
            address(0) == from || address(0) == to,
            "Rental:CANNOT_TRANSFER"
        );
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC1155Receiver, ERC1155) returns (bool) {
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
