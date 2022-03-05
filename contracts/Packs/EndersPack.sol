// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";

import "./LootBoxRandomness.sol";

/**
 * @title CreatureAccessoryLootBox
 * CreatureAccessoryLootBox - a randomized and openable lootbox of Creature
 * Accessories.
 */
contract EndersPack is ERC1155, ReentrancyGuard, Ownable, ERC1155Receiver {
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
    uint256 _numTypes,
    uint256 _seed
  ) public onlyOwner {
    LootBoxRandomness.initState(
      state,
      _factoryAddress,
      _numOptions,
      _numClasses,
      _numTypes,
      _seed
    );
  }

  function setTokenTypeForClass(
    uint256 _classId,
    uint256[] memory _tokenIds,
    uint256[] memory _tokenAmounts
  ) public onlyOwner {
    LootBoxRandomness.setTokenTypeForClass(state, _classId, _tokenIds, _tokenAmounts);
  }

  function setOptionSettings(
    uint256 _option,
    uint256[] memory _classIds,
    uint256[] memory _classProbabilities
  ) public onlyOwner {
    LootBoxRandomness.setOptionSettings(state, _option, _classIds, _classProbabilities);
  }

  function setTokensForTypes(uint256 _typeId, uint256[] memory _tokenIds) public onlyOwner {
    LootBoxRandomness.setTokensForTypes(state, _typeId, _tokenIds);
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
  ) public onlyOwner nonReentrant {
    require(_optionId < state.numOptions, "Lootbox: Invalid Option");
    // Option ID is used as a token ID here
    _mint(_to, _optionId, _amount, _data);
  }

  function mintBatch(
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory
  ) public onlyOwner nonReentrant {
    _mintBatch(to, ids, amounts, "");
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
    return
      bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"));
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC1155, ERC1155Receiver)
    returns (bool)
  {
    return
      interfaceId == type(IERC1155Receiver).interfaceId ||
      super.supportsInterface(interfaceId);
  }

  fallback() external {
    require(false, "DONT_SEND_MONEY");
  }
}
