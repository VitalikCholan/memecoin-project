// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28; 

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Capped} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

contract MemcoinSuperCycle is ERC20, ERC20Capped {
    address payable public owner;

    constructor(uint256 cap) ERC20("MemcoinSuperCycle", "MSC") ERC20Capped(cap * (10 ** decimals())) {
        owner = payable(msg.sender);
        _mint(owner, 50000000 * (10 ** decimals())); // Initial supply
    }

    function _update(address from, address to, uint256 value) internal virtual override(ERC20, ERC20Capped) {
        super._update(from, to, value);
    }
}
