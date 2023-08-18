// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Test {
    address public name = 0xc2B8Abc5249397DB5d159b4E3c311c2fAf4091f2;

    string public variable = "";

    constructor() {}

    function setString(string memory newuri) external {
        variable = newuri;
    }
}
