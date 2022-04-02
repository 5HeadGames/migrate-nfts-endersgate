// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract EndersGate is ERC1155, AccessControl, ERC1155Burnable {
  bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  /***
  /*@dev owner, name, symbol, contractURI and tokenURIPrefix are necesarty to make harmony explorer detect the contract (as erc1155)
  ***/
  address public owner;
  string public name;
  string public symbol;
  string public contractURI;
  string public tokenURIPrefix;

  mapping(uint256 => string) public idToIpfs;
  mapping(uint256 => uint256) public totalSupply;

  /// @custom:oz-upgrades-unsafe-allow constructor

  constructor(
    string memory _name,
    string memory _symbol,
    string memory _contractURI,
    string memory _tokenURIPrefix
  ) ERC1155(_contractURI) {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(URI_SETTER_ROLE, msg.sender);
    _grantRole(MINTER_ROLE, msg.sender);

    owner = address(msg.sender);
    name = _name;
    symbol = _symbol;
    contractURI = _contractURI;
    tokenURIPrefix = _tokenURIPrefix;
  }

  function setURI(string memory newuri) external onlyRole(URI_SETTER_ROLE) {
    tokenURIPrefix = newuri;
  }

  function setContractURI(string memory newuri) external onlyRole(URI_SETTER_ROLE) {
    contractURI = newuri;
  }

  function mint(
    address account,
    uint256 id,
    uint256 amount,
    string memory hash
  ) external onlyRole(MINTER_ROLE) {
    string[] memory hashes = new string[](1);
    uint256[] memory ids = new uint256[](1);
    hashes[0] = hash;
    ids[0] = id;

    totalSupply[id] += amount;

    _setIpfsHashBatch(ids, hashes);
    _mint(account, id, amount, "");
  }

  function mintBatch(
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    string[] memory data
  ) external onlyRole(MINTER_ROLE) {
    for (uint256 i = 0; i < ids.length; i++) totalSupply[ids[i]] += amounts[i];

    _setIpfsHashBatch(ids, data);
    _mintBatch(to, ids, amounts, "");
  }

  function totalSupplyBatch(uint256[] memory ids) external view returns (uint256[] memory) {
    uint256[] memory supply = new uint256[](ids.length);
    for (uint256 i = 0; i < ids.length; i++) supply[i] = totalSupply[ids[i]];
    return supply;
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC1155, AccessControl)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  function uri(uint256 id) public view override returns (string memory) {
    string memory ipfsHash = idToIpfs[id];
    return
      bytes(tokenURIPrefix).length > 0
        ? string(abi.encodePacked(tokenURIPrefix, ipfsHash))
        : "";
  }

  function setIpfsHashBatch(uint256[] memory ids, string[] memory hashes)
    external
    onlyRole(URI_SETTER_ROLE)
  {
    _setIpfsHashBatch(ids, hashes);
  }

  function _setIpfsHashBatch(uint256[] memory ids, string[] memory hashes) internal {
    for (uint256 i = 0; i < ids.length; i++) {
      if (bytes(hashes[i]).length > 0) idToIpfs[ids[i]] = hashes[i];
    }
  }
}
