// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28; 

import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";      
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {MemecoinSuperCycle} from "./MemecoinSuperCycle.sol";   

contract FaucetMSC is ReentrancyGuard, Ownable { 
    MemecoinSuperCycle public immutable token; 

    uint256 public amountPerRequest = 10 * 10**18; // 10 tokens
    uint256 public lockTime = 1 minutes; // For testing purposes, we set the lock time to 1 minute

    mapping(address user => uint256 nextAccessTime) public nextAccessTime;
 
    // Add events
    event TokensDispensed(address indexed user, uint256 amount);
    event SettingsUpdated(uint256 amount, uint256 lockTime); 

    constructor(address _tokenAddress) Ownable(msg.sender) {
        require(_tokenAddress != address(0), "Invalid token address");
        token = MemecoinSuperCycle(_tokenAddress);
    }

    function requestTokens() external nonReentrant {
        require(msg.sender != address(0), "Cannot send token zero address");
        require(
            block.timestamp >= nextAccessTime[msg.sender],
            "Please wait 1 minutes between requests"
        );
        require(
            token.balanceOf(address(this)) >= amountPerRequest,
            "Faucet empty"
        );

        nextAccessTime[msg.sender] = block.timestamp + lockTime;
        require(
            token.transfer(msg.sender, amountPerRequest),
            "Transfer failed"
        );

        emit TokensDispensed(msg.sender, amountPerRequest);
    }

    // Helper function to check wait time
    function timeUntilNextRequest(address user) external view returns (uint256) {
        if (block.timestamp >= nextAccessTime[user]) return 0;
        return nextAccessTime[user] - block.timestamp;
    }
    
    function getBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function setAmountPerRequest(uint256 _amount) external onlyOwner {
        require(_amount > 0, "Amount must be greater than 0");
        amountPerRequest = _amount;
        emit SettingsUpdated(_amount, lockTime);
    }

    function setLockTime(uint256 _time) public onlyOwner {
        require(_time > 0, "Time must be greater than 0");
        lockTime = _time * 1 minutes;
        emit SettingsUpdated(amountPerRequest, lockTime);
    }

    function withdrawTokens(uint256 _amount) external onlyOwner {
        require(token.transfer(owner(), _amount), "Transfer failed");
    }
}
