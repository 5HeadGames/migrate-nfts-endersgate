// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract MyERC1155 is ERC1155 {
  string public name = "DUMMY NAME TOKEN";
  string public symbol = "DNT";
  string public contractURI;
  string public tokenURIPrefix;

  constructor(
    string memory uri,
    string memory _contractURI,
    string memory _tokenURIPrefix
  ) ERC1155(uri) {
    contractURI = _contractURI;
    tokenURIPrefix = _tokenURIPrefix;
  }

  function mint(uint256 id, uint256 amount) public {
    _mint(msg.sender, id, amount, "");
  }
}
