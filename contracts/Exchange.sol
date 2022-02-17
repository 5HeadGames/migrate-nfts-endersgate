// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ExchangeERC1155 is ERC1155Receiver, Ownable{
  mapping(IERC1155 => mapping(uint256 => uint)) public nftToId; //wich nft id should you receive for x address
  IERC1155 public targetContract;

  constructor(IERC1155[] memory nftAddresses, uint256[] memory nftIds, uint[] memory targetIds) {
    require(nftAddresses.length == nftIds.length, "Wrong input");

    for (uint8 i = 0; i < nftAddresses.length; i++)
      contractToId[nftAddresses[i]][nftIds[i]] = targetIds[i];
  }

  function exchangeAllERC1155(IERC1155 contract,uint id) public { //used by users
    uint balance = contract.balanceOf(msg.sender,id);
    contract.safeTransferFrom(msg.sender,address(this),id,balance);
    _mintEquivalent(contract,id,amount);
  }

  function _mintEquivalent(IERC1155 contract,uint id,uint amount) public {
    uint targetId = nftToId[contract][id];
    targetContract.mint(msg.sender,targetId,amount);
  }

  function safeWithdrawal(IERC1155 contract, uint id) public onlyOwner { //just in case
    uint balance = contract.balanceOf(address(this),id);
    contract.safeTransferFrom(address(this),msg.sender,id,balance);
  }

  function updateNftsToId(IERC1155 contract,uint id,uint targetId) onlyOwner{
    nftToId[contract][id] = targetId;
  }

}
