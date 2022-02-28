// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./LootBoxRandomness.sol";

/**
 * @title CreatureAccessoryLootBox
 * CreatureAccessoryLootBox - a randomized and openable lootbox of Creature
 * Accessories.
 */
contract EndersPack is ERC1155, ReentrancyGuard, Ownable {
  using LootBoxRandomness for LootBoxRandomness.LootBoxRandomnessState;

  LootBoxRandomness.LootBoxRandomnessState state;

  /***
  /*@dev owner, name, symbol, contractURI and tokenURIPrefix are necesarty to make harmony explorer detect the contract (as erc1155)
  ***/
  string public name;
  string public symbol;
  string public contractURI;
  string public tokenURIPrefix;

  mapping(uint256 => uint256) public tokenSupply;

  constructor(
    string memory _name,
    string memory _symbol,
    string memory _contractURI,
    string memory _tokenURIPrefix
  ) ERC1155(_contractURI) {
    name = _name;
    symbol = _symbol;
    contractURI = _contractURI;
    tokenURIPrefix = _tokenURIPrefix;
  }

  function setState(
    address _factoryAddress,
    uint256 _numOptions,
    uint256 _numClasses,
    uint256 _seed
  ) public onlyOwner {
    LootBoxRandomness.initState(state, _factoryAddress, _numOptions, _numClasses, _seed);
  }

  function setTokenIdsForClass(uint256 _classId, uint256[] memory _tokenIds) public onlyOwner {
    LootBoxRandomness.setTokenIdsForClass(state, _classId, _tokenIds);
  }

  function setOptionSettings(
    uint256 _option,
    uint256 _maxQuantityPerOpen,
    uint16[] memory _classProbabilities,
    uint16[] memory _guarantees
  ) public onlyOwner {
    LootBoxRandomness.setOptionSettings(
      state,
      _option,
      _maxQuantityPerOpen,
      _classProbabilities,
      _guarantees
    );
  }

  ///////
  // MAIN FUNCTIONS
  //////

  function unpack(
    uint256 _optionId,
    address _toAddress,
    uint256 _amount
  ) external {
    // This will underflow if _msgSender() does not own enough tokens.
    _burn(_msgSender(), _optionId, _amount);
    // Mint nfts contained by LootBox
    LootBoxRandomness._mint(state, _optionId, _toAddress, _amount, "", address(this));
  }

  /**
   *  @dev Mint the token/option id.
   */
  function mint(
    address _to,
    uint256 _optionId,
    uint256 _amount,
    bytes memory _data
  ) public nonReentrant {
    require(_optionId < state.numOptions, "Lootbox: Invalid Option");
    // Option ID is used as a token ID here
    _mint(_to, _optionId, _amount, _data);
  }

  /**
   *  @dev track the number of tokens minted.
   */
  function _mint(
    address _to,
    uint256 _id,
    uint256 _quantity,
    bytes memory _data
  ) internal override {
    tokenSupply[_id] = tokenSupply[_id] + _quantity;
    super._mint(_to, _id, _quantity, _data);
  }
}
