// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28; 

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol"; 
import {ERC20Capped} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Pausable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
contract MemecoinSuperCycle is ERC20, ERC20Capped, ERC20Burnable, ERC20Pausable, ERC20Permit, Ownable {
    constructor(uint256 cap) 
        ERC20("MemecoinSuperCycle", "MSC") 
        ERC20Capped(cap * (10 ** decimals())) 
        ERC20Permit("MemecoinSuperCycle")
        Ownable(msg.sender) {
        _mint(msg.sender, 50000000 * (10 ** decimals())); // Initial supply
    }
    
    function _update(address from, address to, uint256 value) internal virtual override(ERC20, ERC20Capped, ERC20Pausable) {
        super._update(from, to, value);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount); // Will fail if it exceeds the cap
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function destroy() public onlyOwner {
        payable(owner()).transfer(address(this).balance); // Transfer remaining funds to owner
    }
} 
