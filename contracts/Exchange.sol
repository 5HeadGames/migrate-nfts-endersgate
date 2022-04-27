// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./EndersGate.sol";

contract ExchangeERC1155 is Ownable, ERC1155Receiver {
  mapping(IERC1155 => mapping(uint256 => uint256)) public nftToId; //wich nft id should you receive for x address
  mapping(IERC1155 => bool) public isAllowedNft;
  bool private _onExchange;

  EndersGate public targetContract;

  modifier onlyExchange() {
    require(_onExchange, "ONLY_WHEN_EXCHANGE");
    _;
  }

  constructor(
    IERC1155[] memory nftAddresses,
    uint256[] memory nftIds,
    uint256[] memory targetIds,
    EndersGate _targetContract
  ) {
    require(nftAddresses.length == nftIds.length, "Wrong input");

    targetContract = _targetContract;
    for (uint8 i = 0; i < nftAddresses.length; i++) {
      nftToId[nftAddresses[i]][nftIds[i]] = targetIds[i];
      isAllowedNft[nftAddresses[i]] = true;
    }
  }

  function exchangeAllERC1155(IERC1155[] memory nft, uint256[] memory id) public {
    require(nft.length == id.length, "INVALID_INPUT");
    _onExchange = true;

    bool hasBalance = false;

    for (uint256 i = 0; i < nft.length; i++) {
      require(isAllowedNft[nft[i]], "INVALID_NFT");

      uint256 balance = nft[i].balanceOf(msg.sender, id[i]);
      hasBalance = balance > 0;

      nft[i].safeTransferFrom(msg.sender, address(this), id[i], balance, "");
      _mintEquivalent(nft[i], id[i], balance);
    }

    _onExchange = false;
    require(hasBalance, "NO_ENOUGH_BALANCE");
  }

  function safeWithdrawal(IERC1155 nft, uint256 id) public onlyOwner {
    //just in case
    uint256 balance = nft.balanceOf(address(this), id);
    nft.safeTransferFrom(address(this), msg.sender, id, balance, "");
  }

  function updateNftsToId(
    IERC1155 nft,
    uint256 id,
    uint256 targetId
  ) public onlyOwner {
    nftToId[nft][id] = targetId;
  }

  function updateAllowedNft(IERC1155 nft, bool isAllowed) public onlyOwner {
    isAllowedNft[nft] = isAllowed;
  }

  function _mintEquivalent(
    IERC1155 nft,
    uint256 id,
    uint256 amount
  ) internal {
    uint256 targetId = nftToId[nft][id];
    targetContract.mint(msg.sender, targetId, amount, "");
  }

  function onERC1155Received(
    address operator,
    address from,
    uint256 id,
    uint256 value,
    bytes calldata data
  ) external onlyExchange returns (bytes4) {
    return bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"));
  }

  function onERC1155BatchReceived(
    address operator,
    address from,
    uint256[] calldata ids,
    uint256[] calldata values,
    bytes calldata data
  ) external onlyExchange returns (bytes4) {
    return bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"));
  }

  fallback() external {
    require(false, "DONT_SEND_MONEY");
  }
}
