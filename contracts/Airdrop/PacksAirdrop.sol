// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import { MintableERC1155 } from "../interfaces/MintableERC1155.sol";
import { EndersPack } from "../Packs/EndersPack.sol";

struct Reward {
  MintableERC1155 token;
  uint256 amount;
  uint256 tokenId;
}

contract PacksAirdrop is AccessControl, ReentrancyGuard {
  bytes32 public constant REWARD_MANAGER = keccak256("REWARD_MANAGER");
  bytes32 public constant ADDRESS_MANAGER = keccak256("ADDRESS_MANAGER");

  mapping(uint256 => mapping(address => bool)) public isAllowed;
  mapping(uint256 => Reward) public reward;

  modifier hasAllowance(uint256 rewardId) {
    require(isAllowed[rewardId][msg.sender], "PacksAirdrop:NOT_ALLOWED");
    _;
  }

  event AddressChanged(uint256 rewardId, address account, bool allowed);
  event RewardChanged(uint256 rewardId, MintableERC1155 token, uint256 amount, uint256 tokenId);
  event RewardClaimed(uint256 rewardId, address claimer);

  constructor() {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(REWARD_MANAGER, msg.sender);
    _grantRole(ADDRESS_MANAGER, msg.sender);
  }

  function setAddresses(
    uint256 rewardId,
    address[] memory accounts,
    bool[] memory _isAllowed
  ) external onlyRole(ADDRESS_MANAGER) {
    require(accounts.length == _isAllowed.length, "PacksAirdrop:INVALID_INPUT");

    for (uint256 i = 0; i < accounts.length; i++) {
      isAllowed[rewardId][accounts[i]] = _isAllowed[i];
      emit AddressChanged(rewardId, accounts[i], _isAllowed[i]);
    }
  }

  function setReward(
    uint256 rewardId,
    uint256 amount,
    uint256 tokenId,
    MintableERC1155 _token
  ) external onlyRole(REWARD_MANAGER) {
    reward[rewardId] = Reward(_token, amount, tokenId);
    emit RewardChanged(rewardId, _token, amount, tokenId);
  }

  function claimReward(uint256 rewardId) external nonReentrant hasAllowance(rewardId) {
    Reward memory currentReward = reward[rewardId];
    require(address(currentReward.token) != address(0), "PacksAirdrop:DOESNT_EXISTS");
    isAllowed[rewardId][msg.sender] = false;

    currentReward.token.mint(msg.sender, currentReward.tokenId, currentReward.amount, "");
    emit RewardClaimed(rewardId, msg.sender);
  }

  //since packs nft is different
  function claimPackReward(uint256 rewardId) external nonReentrant hasAllowance(rewardId) {
    Reward memory currentReward = reward[rewardId];
    require(address(currentReward.token) != address(0), "PacksAirdrop:DOESNT_EXISTS");
    isAllowed[rewardId][msg.sender] = false;

    EndersPack(address(currentReward.token)).mint(
      msg.sender,
      currentReward.tokenId,
      currentReward.amount,
      ""
    );
    emit RewardClaimed(rewardId, msg.sender);
  }

  //for nfts with mint done as owner
  function transferTokenOwnership(Ownable token) external onlyRole(DEFAULT_ADMIN_ROLE) {
    token.transferOwnership(msg.sender);
  }
}
