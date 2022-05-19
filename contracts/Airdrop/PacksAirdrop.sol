// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "hardhat/console.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IERC1155 } from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import { ERC1155Receiver } from "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";
import { EndersPack } from "../Packs/EndersPack.sol";

struct Reward {
  IERC1155 token;
  uint256 amount;
  uint256 tokenId;
}

contract PacksAirdrop is AccessControl, ReentrancyGuard, ERC1155Receiver {
  bytes32 public constant REWARD_MANAGER = keccak256("REWARD_MANAGER");
  bytes32 public constant WITHDRAWER = keccak256("WITHDRAWER");

  mapping(address => Reward[]) public reward;

  modifier hasAllowance() {
    require(reward[msg.sender].length > 0, "PacksAirdrop:NOT_ALLOWED");
    _;
  }

  event RewardChanged(address indexed user, IERC1155[] token, uint256[] amount, uint256[] tokenId);
  event RewardClaimed(address indexed claimer, IERC1155 token, uint256 amount, uint256 tokenId);

  constructor() {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(REWARD_MANAGER, msg.sender);
    _grantRole(WITHDRAWER, msg.sender);
  }

  function setReward(
    address[] memory users,
    uint256[][] memory amounts,
    uint256[][] memory tokenIds,
    IERC1155[][] memory tokens
  ) external onlyRole(REWARD_MANAGER) {
    require(
      amounts.length == tokenIds.length && amounts.length == tokens.length,
      "PacksAirdrop:INVALID_INPUT"
    );

    for (uint256 i = 0; i < users.length; i++) {
      require(
        tokens[i].length == amounts[i].length && amounts[i].length == tokenIds[i].length,
        "PacksAirdrop:INVALID_INPUT"
      );
      for (uint256 j = 0; j < tokens[i].length; j++) {
        reward[users[i]].push(Reward(tokens[i][j], amounts[i][j], tokenIds[i][j]));
      }
      emit RewardChanged(users[i], tokens[i], amounts[i], tokenIds[i]);
    }
  }

  function getRewards(address user) external view returns (Reward[] memory) {
    return reward[user];
  }

  function claimReward() external nonReentrant hasAllowance {
    for (uint256 i = 0; i < reward[msg.sender].length; i++) {
      reward[msg.sender][i].token.safeTransferFrom(
        address(this),
        msg.sender,
        reward[msg.sender][i].tokenId,
        reward[msg.sender][i].amount,
        ""
      );
      emit RewardClaimed(
        msg.sender,
        reward[msg.sender][i].token,
        reward[msg.sender][i].amount,
        reward[msg.sender][i].tokenId
      );
    }

    delete reward[msg.sender];
  }

  function withdraw(
    IERC1155 token,
    uint256 tokenId,
    address receiver
  ) external onlyRole(WITHDRAWER) {
    uint256 balance = token.balanceOf(address(this), tokenId);
    token.safeTransferFrom(address(this), receiver, tokenId, balance, "");
  }

  //required by solidity
  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(AccessControl, ERC1155Receiver)
    returns (bool)
  {
    return interfaceId == type(ERC1155Receiver).interfaceId || super.supportsInterface(interfaceId);
  }

  function onERC1155Received(
    address operator,
    address from,
    uint256 id,
    uint256 value,
    bytes calldata data
  ) external returns (bytes4) {
    return bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"));
  }

  function onERC1155BatchReceived(
    address operator,
    address from,
    uint256[] calldata ids,
    uint256[] calldata values,
    bytes calldata data
  ) external returns (bytes4) {
    return bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"));
  }
}
