// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { ERC1155Supply, ERC1155 } from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import { DefaultOperatorFilterer } from "./lib/opensea-filter/src/DefaultOperatorFilterer.sol";
import { BridgeNFTBatch } from "./interfaces/BridgeNFTBatch.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract EndersGate is
  ERC1155Supply,
  BridgeNFTBatch,
  AccessControl,
  ERC2981,
  Ownable,
  DefaultOperatorFilterer
{
  using Strings for uint256;
  struct SetRoyalty {
    address receiver;
    uint96 feeNumerator; // 10000 == 100%
  }

  bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
  bytes32 public constant SUPPLY_ROLE = keccak256("SUPPLY_ROLE");

  string public name;
  string public symbol;
  string public contractURI;
  string public baseURI;

  // mapping(uint256 => string) public idToIpfs;
  mapping(address => uint256) public lastTransfer;

  /// @custom:oz-upgrades-unsafe-allow constructor

  constructor(
    string memory _name,
    string memory _symbol,
    string memory _contractURI,
    string memory _tokenURIPrefix,
    SetRoyalty memory setRoyaltyInfo
  ) ERC1155(_contractURI) {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(URI_SETTER_ROLE, msg.sender);
    _grantRole(SUPPLY_ROLE, msg.sender);

    if (setRoyaltyInfo.receiver != address(0)) {
      _setDefaultRoyalty(setRoyaltyInfo.receiver, setRoyaltyInfo.feeNumerator);
    }

    name = _name;
    symbol = _symbol;
    contractURI = _contractURI;
    baseURI = _tokenURIPrefix;
  }

  function setURI(string memory newuri) external onlyRole(URI_SETTER_ROLE) {
    baseURI = newuri;
  }

  function setContractURI(string memory newuri)
    external
    onlyRole(URI_SETTER_ROLE)
  {
    contractURI = newuri;
  }

  function mint(
    address account,
    uint256 id,
    bytes calldata _data
  ) external onlyRole(SUPPLY_ROLE) {
    _mint(account, id, 1, "");
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

  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC1155, AccessControl, ERC2981)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  function uri(uint256 id) public view override returns (string memory) {
    // string memory ipfsHash = idToIpfs[id];
    return
      bytes(baseURI).length > 0
        ? string(abi.encodePacked(baseURI, id.toString()))
        : "";
  }

  // function setIpfsHashBatch(uint256[] memory ids, string[] memory hashes)
  //   external
  //   onlyRole(URI_SETTER_ROLE)
  // {
  //   _setIpfsHashBatch(ids, hashes);
  // }

  // function _setIpfsHashBatch(uint256[] memory ids, string[] memory hashes)
  //   internal
  // {
  //   for (uint256 i = 0; i < ids.length; i++) {
  //     if (bytes(hashes[i]).length > 0) idToIpfs[ids[i]] = hashes[i];
  //   }
  // }

  function _beforeTokenTransfer(
    address operator,
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) internal override {
    lastTransfer[to] = block.timestamp;
    super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
  }

  function safeTransferFrom(
    address from,
    address to,
    uint256 tokenId,
    uint256 amount,
    bytes memory data
  ) public override onlyAllowedOperator(from) {
    super.safeTransferFrom(from, to, tokenId, amount, data);
  }

  function safeBatchTransferFrom(
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) public virtual override onlyAllowedOperator(from) {
    super.safeBatchTransferFrom(from, to, ids, amounts, data);
  }
}
