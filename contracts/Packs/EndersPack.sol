// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import { ERC1155Supply, ERC1155 } from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { Address } from "@openzeppelin/contracts/utils/Address.sol";

import { LootBoxRandomness } from "./LootBoxRandomness.sol";
import { BridgeNFTBatch } from "../interfaces/BridgeNFTBatch.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title CreatureAccessoryLootBox
 * CreatureAccessoryLootBox - a randomized and openable lootbox of Creature
 * Accessories.
 */
contract EndersPack is
  BridgeNFTBatch,
  ERC1155Supply,
  ReentrancyGuard,
  AccessControl
{
  using Strings for uint256;
  using Address for address;
  using LootBoxRandomness for LootBoxRandomness.LootBoxRandomnessState;

  event LootBoxOpened(
    uint256 indexed optionId,
    address indexed buyer,
    uint256 boxesPurchased,
    uint256 itemsMinted
  );

  bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
  bytes32 public constant SUPPLY_ROLE = keccak256("SUPPLY_ROLE");
  bytes32 public constant PACKS_ROLE = keccak256("PACKS_ROLE");
  string public baseURI;

  LootBoxRandomness.LootBoxRandomnessState public state;

  // mapping(uint256 => string) public idToIpfs;

  constructor(string memory _tokenURIPrefix) ERC1155("") {
    baseURI = _tokenURIPrefix;
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(PACKS_ROLE, msg.sender);
    _grantRole(SUPPLY_ROLE, msg.sender);
    _grantRole(URI_SETTER_ROLE, msg.sender);
  }

  function setState(
    address _factoryAddress,
    uint256 _numOptions,
    uint256 _numTypes,
    uint256 _seed
  ) external onlyRole(PACKS_ROLE) {
    LootBoxRandomness.initState(
      state,
      _factoryAddress,
      _numOptions,
      _numTypes,
      _seed
    );
  }

  function setOptionSettings(
    uint256 _option,
    uint256 _mintLimit,
    uint256[] memory _typeIds,
    uint256[] memory _typeInferiorLimit,
    uint256[] memory _typeSuperiorLimit
  ) external onlyRole(PACKS_ROLE) {
    LootBoxRandomness.setOptionSettings(
      state,
      _option,
      _mintLimit,
      _typeIds,
      _typeInferiorLimit,
      _typeSuperiorLimit
    );
  }

  function setTokensForTypes(uint256 _typeId, uint256[] memory _tokenIds)
    external
    onlyRole(PACKS_ROLE)
  {
    LootBoxRandomness.setTokensForTypes(state, _typeId, _tokenIds);
  }

  ///////
  // MAIN FUNCTIONS
  //////

  function unpack(uint256 _optionId, uint256 _amount)
    external
    nonReentrant
    returns (uint256)
  {
    address sender = _msgSender();
    require(!sender.isContract(), "Only EOA accounts");
    require(tx.origin == sender, "Only EOA accounts");
    // This will underflow if _msgSender() does not own enough tokens.
    _burn(sender, _optionId, _amount);
    // Mint nfts contained by LootBox
    return
      LootBoxRandomness._mint(
        state,
        _optionId,
        sender,
        _amount,
        "",
        address(this)
      );
  }

  function mint(
    address _to,
    uint256 _optionId,
    bytes calldata _data
  ) external onlyRole(SUPPLY_ROLE) {
    require(_optionId < state.numOptions);
    _mint(_to, _optionId, 1, _data);
  }

  function mintBatch(
    address to,
    uint256[] calldata ids,
    uint256[] calldata amounts,
    bytes calldata
  ) external onlyRole(SUPPLY_ROLE) {
    _mintBatch(to, ids, amounts, "");
  }

  function burnBatchFor(
    address from,
    uint256[] calldata ids,
    uint256[] calldata amounts
  ) external onlyRole(SUPPLY_ROLE) {
    _burnBatch(from, ids, amounts);
  }

  function burnFor(address to, uint256 id) external onlyRole(SUPPLY_ROLE) {
    _burn(to, id, 1);
  }

  function uri(uint256 id) public view override returns (string memory) {
    // string memory ipfsHash = idToIpfs[id];
    return
      bytes(baseURI).length > 0
        ? string(abi.encodePacked(baseURI, id.toString()))
        : "";
  }

  function setURI(string memory newuri) external onlyRole(URI_SETTER_ROLE) {
    baseURI = newuri;
  }

  // function setIpfsHashBatch(uint256[] memory ids, string[] memory hashes)
  //   external
  //   onlyRole(URI_SETTER_ROLE)
  // {
  //   for (uint256 i = 0; i < ids.length; i++) {
  //     if (bytes(hashes[i]).length > 0) idToIpfs[ids[i]] = hashes[i];
  //   }
  // }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC1155, AccessControl)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  function onERC1155Received(
    address operator,
    address from,
    uint256 id,
    uint256 value,
    bytes calldata data
  ) external returns (bytes4) {
    return
      bytes4(
        keccak256("onERC1155Received(address,address,uint256,uint256,bytes)")
      );
  }

  function onERC1155BatchReceived(
    address operator,
    address from,
    uint256[] calldata ids,
    uint256[] calldata values,
    bytes calldata data
  ) external returns (bytes4) {
    return
      bytes4(
        keccak256(
          "onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"
        )
      );
  }
}
