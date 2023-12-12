// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

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
contract EndersBattlePass is ERC1155Supply, ReentrancyGuard, AccessControl {
    using Strings for uint256;
    using Address for address;

    struct Season {
        uint256 rewardId;
        uint256 priceUSD;
        bool ended;
        bool exists;
    }

    uint256 public currentSeason;
    mapping(uint256 => Season) public seasons;
    //All the sales price have to have 6 decimals
    uint256 public decimalsUSD = 6;

    // token address to priceFeed address
    mapping(address => address) public priceFeedsByToken;
    mapping(address => uint256) public decimalsByToken;

    // Tokens allowed in the marketplace
    address public wcurrency;

    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant SUPPLY_ROLE = keccak256("SUPPLY_ROLE");
    bytes32 public constant SEASON_ROLE = keccak256("SEASON_ROLE");

    string public name;
    string public symbol;
    string public baseURI;

    mapping(uint256 => string) public idToIpfs;

    constructor(
        string memory _name,
        string memory _symbol,
        address _wcurrency,
        address _priceFeedW,
        uint256 _decimals
    ) ERC1155("") {
        name = _name;
        symbol = _symbol;
        wcurrency = _wcurrency;
        priceFeedsByToken[_wcurrency] = _priceFeedW;
        decimalsByToken[_wcurrency] = _decimals;
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

    function buyBattlePass(address tokenToPay, uint256 amount) public payable {
        uint256 id = seasons[currentSeason].rewardId;
        uint256 cost = getPrice(tokenToPay, amount);
        if (tokenToPay == wcurrency) {
            require(msg.value >= cost, "NOT_ENOUGH_VALUE");
        } else {
            require(isTokenAllowed(tokenToPay), "TOKEN TO PAY IS NOT ALLOWED");
            require(
                IERC20(tokenToPay).balanceOf(_msgSender()) > cost,
                "INSUFICIENT BALANCE"
            );
            require(
                IERC20(tokenToPay).allowance(_msgSender(), address(this)) >
                    cost,
                "INSUFICIENT ALLOWANCE"
            );

            IERC20(tokenToPay).transferFrom(_msgSender(), address(this), cost);
        }

        _mint(msg.sender, id, amount, "");
    }

    function isTokenAllowed(address _token) public view returns (bool) {
        return
            abi.encodePacked(priceFeedsByToken[_token]).length > 0
                ? true
                : false;
    }

    function getPrice(
        address tokenToGet,
        uint256 quantity
    ) public view returns (uint256) {
        Season storage _season = seasons[currentSeason];
        require(!_season.ended, "ClockSale:INVALID_SALE");
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            priceFeedsByToken[tokenToGet]
        );
        // (, int256 price, , , ) = priceFeed.latestRoundData();
        // uint256 decimals = priceFeed.decimals();
        int256 price = 84679030;
        uint256 decimals = 8;
        return
            (quantity *
                (_season.priceUSD) *
                10 ** (decimalsByToken[tokenToGet] + decimals - decimalsUSD)) /
            uint256(price);
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

    function addToken(
        address _token,
        address priceFeed,
        uint256 decimals
    ) external onlyRole(SUPPLY_ROLE) {
        priceFeedsByToken[_token] = priceFeed;
        decimalsByToken[_token] = decimals;
    }

    function addSeason(
        uint256 id,
        uint256 priceUSD
    ) external onlyRole(SEASON_ROLE) {
        require(
            id != seasons[currentSeason].rewardId,
            "ids should be different"
        );
        currentSeason++;
        seasons[currentSeason].priceUSD = priceUSD;
        seasons[currentSeason].rewardId = id;
        if (!seasons[currentSeason].exists) {
            seasons[currentSeason].exists = true;
            seasons[currentSeason - 1].ended = true;
        }
    }

    function editSeason(
        uint256 id,
        uint256 priceUSD
    ) external onlyRole(SEASON_ROLE) {
        seasons[currentSeason].priceUSD = priceUSD;
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
