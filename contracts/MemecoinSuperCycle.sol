// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MemcoinSuperCycle is ERC20 {
    constructor(uint256 initialSupply) ERC20("MemcoinSyperCycle", "MSC") {
        _mint(msg.sender, initialSupply);
    }
}
