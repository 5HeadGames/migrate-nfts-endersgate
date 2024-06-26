// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {ERC1155Supply, ERC1155} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

import "@openzeppelin/contracts/utils/Strings.sol";

// import "hardhat/console.sol";

/**
 * @title CreatureAccessoryLootBox
 * CreatureAccessoryLootBox - a randomized and openable lootbox of Creature
 * Accessories.
 */
contract EndersBattlePassFindora is
    ERC1155Supply,
    ReentrancyGuard,
    AccessControl
{
    using Strings for uint256;
    using Address for address;

    struct Season {
        uint256 rewardId;
        uint256 price;
        bool ended;
        bool exists;
    }

    uint256 public currentSeason;
    mapping(uint256 => Season) public seasons;

    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant SUPPLY_ROLE = keccak256("SUPPLY_ROLE");
    bytes32 public constant SEASON_ROLE = keccak256("SEASON_ROLE");

    string public name;
    string public symbol;
    string public baseURI;

    mapping(uint256 => string) public idToIpfs;

    constructor(string memory _name, string memory _symbol) ERC1155("") {
        name = _name;
        symbol = _symbol;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(SEASON_ROLE, msg.sender);
        _grantRole(SUPPLY_ROLE, msg.sender);
        _grantRole(URI_SETTER_ROLE, msg.sender);
    }

    ///////
    // MAIN FUNCTIONS
    //////

    function mint(
        address _to,
        uint256 _optionId,
        bytes calldata _data
    ) external onlyRole(SUPPLY_ROLE) {
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

    function buyBattlePass(uint256 amount) public payable {
        uint256 id = seasons[currentSeason].rewardId;
        uint256 cost = getPrice(amount);
        require(msg.value >= cost, "NOT_ENOUGH_VALUE");
        _mint(msg.sender, id, amount, "");
    }

    function getPrice(uint256 quantity) public view returns (uint256) {
        Season storage _season = seasons[currentSeason];
        require(!_season.ended, "ClockSale:INVALID_SALE");
        return (quantity * _season.price);
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
        string memory ipfsHash = idToIpfs[id];
        return string(ipfsHash);
    }

    function setIpfsHashBatch(
        uint256[] memory ids,
        string[] memory hashes
    ) external onlyRole(URI_SETTER_ROLE) {
        for (uint256 i = 0; i < ids.length; i++) {
            if (bytes(hashes[i]).length > 0) idToIpfs[ids[i]] = hashes[i];
        }
    }

    function addSeason(
        uint256 id,
        uint256 price
    ) external onlyRole(SEASON_ROLE) {
        require(
            id != seasons[currentSeason].rewardId,
            "ids should be different"
        );
        currentSeason++;
        seasons[currentSeason].price = price;
        seasons[currentSeason].rewardId = id;
        if (!seasons[currentSeason].exists) {
            seasons[currentSeason].exists = true;
            seasons[currentSeason - 1].ended = true;
        }
    }

    function editSeason(
        uint256 id,
        uint256 price
    ) external onlyRole(SEASON_ROLE) {
        seasons[currentSeason].price = price;
        seasons[currentSeason].rewardId = id;
    }

    function getSeason(uint256 id) external view returns (Season memory) {
        return seasons[id];
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function withdraw(
        uint256 amount,
        address token,
        address recipient
    ) external onlyRole(URI_SETTER_ROLE) {
        if (token == address(0)) recipient.call{value: amount};
        else IERC20(token).transfer(recipient, amount);
    }
}
