// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract EndersGate is
  Initializable,
  ERC1155Upgradeable,
  AccessControlUpgradeable,
  ERC1155BurnableUpgradeable,
  UUPSUpgradeable
{
  bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

  mapping(uint256 => string) idToIpfs;
  uint256 public idCount;

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() initializer {}

  function initialize() public initializer {
    __ERC1155_init("");
    __AccessControl_init();
    __ERC1155Burnable_init();
    __UUPSUpgradeable_init();

    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(URI_SETTER_ROLE, msg.sender);
    _grantRole(MINTER_ROLE, msg.sender);
    _grantRole(UPGRADER_ROLE, msg.sender);
  }

  function setURI(string memory newuri) public onlyRole(URI_SETTER_ROLE) {
    _setURI(newuri);
  }

  function mint(
    address account,
    uint256 id,
    uint256 amount,
    string memory hash
  ) public onlyRole(MINTER_ROLE) {
    string[] memory hashes = new string[](1);
    uint256[] memory ids = new uint256[](1);
    hashes[0] = hash;
    ids[0] = id;

    _setIpfsHashBatch(ids, hashes);
    _mint(account, id, amount, "");
  }

  function mintBatch(
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    string[] memory data
  ) public onlyRole(MINTER_ROLE) {
    _setIpfsHashBatch(ids, data);
    _mintBatch(to, ids, amounts, "");
  }

  function _authorizeUpgrade(address newImplementation)
    internal
    override
    onlyRole(UPGRADER_ROLE) //only upgrader role is authorized
  {}

  // The following functions are overrides required by Solidity.

  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC1155Upgradeable, AccessControlUpgradeable)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  function uri(uint256 id) public view override returns (string memory) {
    string memory ipfsHash = idToIpfs[id];
    return
      bytes(super.uri(id)).length > 0 ? string(abi.encodePacked(super.uri(id), ipfsHash)) : "";
  }

  function setIpfsHashBatch(uint256[] memory ids, string[] memory hashes)
    public
    onlyRole(URI_SETTER_ROLE)
  {
    _setIpfsHashBatch(ids, hashes);
  }

  function _setIpfsHashBatch(uint256[] memory ids, string[] memory hashes) internal {
    for (uint256 i = 0; i < ids.length; i++) {
      idToIpfs[ids[i]] = hashes[i];
    }
  }
}
