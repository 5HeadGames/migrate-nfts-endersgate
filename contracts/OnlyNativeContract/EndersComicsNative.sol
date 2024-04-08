// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import {ERC1155Supply, ERC1155} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";

contract EndersComicsNative is ERC1155Supply, ReentrancyGuard, AccessControl {
    using Strings for uint256;
    using Address for address;

    struct Comic {
        uint256 comicId;
        uint256 price;
        uint256 limit;
        bool exists;
    }

    mapping(uint256 => Comic) public comics;
    uint256 public comicIdCounter;

    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant SUPPLY_ROLE = keccak256("SUPPLY_ROLE");
    bytes32 public constant COMIC_ROLE = keccak256("COMIC_ROLE");

    string public name;
    string public symbol;
    string public baseURI;

    mapping(uint256 => string) public idToIpfs;

    constructor(string memory _name, string memory _symbol) ERC1155("") {
        name = _name;
        symbol = _symbol;
        comicIdCounter = 0;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(COMIC_ROLE, msg.sender);
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

    function buyBatch(
        address to,
        uint256[] memory tokensId,
        uint256[] memory amounts
    ) public payable {
        require(
            tokensId.length == amounts.length,
            "Array Length must be the same of amount and Ids"
        );
        for (uint256 i = 0; i < tokensId.length; i++) {
            buy(to, tokensId[i], amounts[i]);
        }
    }

    function buy(address receiver, uint256 id, uint256 amount) public payable {
        require(
            comics[id].limit >= totalSupply(comics[id].comicId) + amount,
            "Limit amount of NFTs reached"
        );
        uint256 cost = getPrice(id, amount);
        require(comics[id].exists, "This token doesn't exist");
        require(msg.value >= cost, "Not Enough Value to buy");
        _mint(receiver, id, amount, "");
    }

    function getPrice(
        uint256 id,
        uint256 quantity
    ) public view returns (uint256) {
        Comic storage _comic = comics[id];
        require(_comic.exists, "Comics Does Not Exist");
        return (quantity * (_comic.price));
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

    function addComic(
        uint256 price,
        uint256 limit
    ) external onlyRole(COMIC_ROLE) {
        uint256 id = comicIdCounter + 1;
        comics[id].price = price;
        comics[id].comicId = id;
        comics[id].limit = limit;
        if (!comics[id].exists) {
            comics[id].exists = true;
            comicIdCounter++;
        }
    }

    function editComic(
        uint256 id,
        uint256 comicId,
        uint256 price,
        uint256 limit
    ) external onlyRole(COMIC_ROLE) {
        comics[id].price = price;
        comics[id].comicId = comicId;
        comics[id].limit = limit;
    }

    function getComic(uint256 id) external view returns (Comic memory) {
        return comics[id];
    }

    function getComics() external view returns (Comic[] memory) {
        Comic[] memory response = new Comic[](comicIdCounter);
        for (uint256 i = 1; i <= comicIdCounter; i++)
            response[i - 1] = comics[i];
        return response;
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
