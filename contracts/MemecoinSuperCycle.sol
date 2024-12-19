// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28; 

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Capped} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Pausable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract MemcoinSuperCycle is ERC20, ERC20Capped, ERC20Burnable, ERC20Pausable, ERC20Permit {
    address payable public owner;

    constructor(uint256 cap) 
    ERC20("MemcoinSuperCycle", "MSC") 
    ERC20Capped(cap * (10 ** decimals())) 
    ERC20Permit("MemcoinSuperCycle") {
        owner = payable(msg.sender);
        _mint(owner, 50000000 * (10 ** decimals())); // Initial supply
    }
    
    function _update(address from, address to, uint256 value) internal virtual override(ERC20, ERC20Capped, ERC20Pausable) whenNotPaused  {
        super._update(from, to, value);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount); // Will fail if it exceeds the cap
    }

    function setOwner(address payable newOwner) public onlyOwner {
        owner = newOwner;
    }

    function pause() public onlyOwner {
        pause();
    }

     function unpause() public onlyOwner {
        unpause();
    }

     function destroy() public onlyOwner {
        payable(owner).transfer(address(this).balance); // Transfer remaining funds to owner.
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
}
