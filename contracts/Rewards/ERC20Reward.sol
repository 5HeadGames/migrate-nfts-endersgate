// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Reward is ERC20, Ownable {
    address rewardsContract;

    constructor(
        string memory name,
        string memory symbol,
        address _rewards
    ) ERC20(name, symbol) {
        rewardsContract = _rewards;
    }

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }

    function mint(address receiver, uint256 amount) external onlyOwner {
        _mint(receiver, amount);
    }

    function transfer(
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        require(
            to == rewardsContract,
            "Yo only can transfer to the Rewards Contract"
        );
        address owner = _msgSender();
        _transfer(owner, to, amount);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        require(
            to == rewardsContract,
            "Yo only can transfer to the Rewards Contract"
        );
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }

    function setRewardContract(address newRewards) external onlyOwner {
        rewardsContract = newRewards;
    }
}
