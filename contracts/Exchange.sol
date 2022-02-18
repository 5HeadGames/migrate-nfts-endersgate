// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./EndersGate.sol";

contract ExchangeERC1155 is Ownable {
  mapping(IERC1155 => mapping(uint256 => uint256)) public nftToId; //wich nft id should you receive for x address
  EndersGate public targetContract;

  constructor(
    IERC1155[] memory nftAddresses,
    uint256[] memory nftIds,
    uint256[] memory targetIds
  ) {
    require(nftAddresses.length == nftIds.length, "Wrong input");

    for (uint8 i = 0; i < nftAddresses.length; i++)
      nftToId[nftAddresses[i]][nftIds[i]] = targetIds[i];
  }

  function exchangeAllERC1155(IERC1155 nft, uint256 id) public {
    //used by users
    uint256 balance = nft.balanceOf(msg.sender, id);
    nft.safeTransferFrom(msg.sender, address(this), id, balance, "");
    _mintEquivalent(nft, id, balance);
  }

  function _mintEquivalent(
    IERC1155 nft,
    uint256 id,
    uint256 amount
  ) internal {
    uint256 targetId = nftToId[nft][id];
    targetContract.mint(msg.sender, targetId, amount, "");
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
}
