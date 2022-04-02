// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "./LootBoxRandomness.sol";

/**
 * @title CreatureAccessoryLootBox
 * CreatureAccessoryLootBox - a randomized and openable lootbox of Creature
 * Accessories.
 */
contract EndersPack is ERC1155, ERC1155Burnable, ReentrancyGuard, Ownable, ERC1155Receiver {
  using Address for address;
  using LootBoxRandomness for LootBoxRandomness.LootBoxRandomnessState;

  event LootBoxOpened(
    uint256 indexed optionId,
    address indexed buyer,
    uint256 boxesPurchased,
    uint256 itemsMinted
  );

  LootBoxRandomness.LootBoxRandomnessState state;

  /***
  /*@dev owner, name, symbol, contractURI and tokenURIPrefix are necesarty to make harmony explorer detect the contract (as erc1155)
  ***/
  string public name;
  string public symbol;
  string public contractURI;
  string public tokenURIPrefix;

  mapping(uint256 => uint256) public tokenSupply;
  mapping(uint256 => string) public idToIpfs;

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
    uint256 _numTypes,
    uint256 _seed
  ) external onlyOwner {
    LootBoxRandomness.initState(state, _factoryAddress, _numOptions, _numTypes, _seed);
  }

  function setOptionSettings(
    uint256 _option,
    uint256 _mintLimit,
    uint256[] memory _typeIds,
    uint256[] memory _typeInferiorLimit,
    uint256[] memory _typeSuperiorLimit
  ) external onlyOwner {
    LootBoxRandomness.setOptionSettings(
      state,
      _option,
      _mintLimit,
      _typeIds,
      _typeInferiorLimit,
      _typeSuperiorLimit
    );
  }

  function setTokensForTypes(uint256 _typeId, uint256[] memory _tokenIds) external onlyOwner {
    LootBoxRandomness.setTokensForTypes(state, _typeId, _tokenIds);
  }

  ///////
  // MAIN FUNCTIONS
  //////

  function unpack(uint256 _optionId, uint256 _amount) external nonReentrant returns (uint256) {
    address sender = _msgSender();
    require(!sender.isContract(), "Only EOA accounts");
    require(tx.origin == sender, "Only EOA accounts");
    // This will underflow if _msgSender() does not own enough tokens.
    _burn(sender, _optionId, _amount);
    // Mint nfts contained by LootBox
    return LootBoxRandomness._mint(state, _optionId, sender, _amount, "", address(this));
  }

  /**
   *  @dev Mint the token/option id.
   */
  function mint(
    address _to,
    uint256 _optionId,
    uint256 _amount,
    bytes memory _data
  ) external onlyOwner {
    require(_optionId < state.numOptions, "Lootbox: Invalid Option");
    // Option ID is used as a token ID here
    _mint(_to, _optionId, _amount, _data);
  }

  function mintBatch(
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory
  ) external onlyOwner {
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

  function uri(uint256 id) public view override returns (string memory) {
    string memory ipfsHash = idToIpfs[id];
    return
      bytes(tokenURIPrefix).length > 0
        ? string(abi.encodePacked(tokenURIPrefix, ipfsHash))
        : "";
  }

  function setURI(string memory newuri) external onlyOwner {
    tokenURIPrefix = newuri;
  }

  function setContractURI(string memory newuri) external onlyOwner {
    contractURI = newuri;
  }

  function setIpfsHashBatch(uint256[] memory ids, string[] memory hashes) external onlyOwner {
    _setIpfsHashBatch(ids, hashes);
  }

  function _setIpfsHashBatch(uint256[] memory ids, string[] memory hashes) internal {
    for (uint256 i = 0; i < ids.length; i++) {
      if (bytes(hashes[i]).length > 0) idToIpfs[ids[i]] = hashes[i];
    }
  }

  fallback() external {
    require(false, "DONT_SEND_MONEY");
  }
}
