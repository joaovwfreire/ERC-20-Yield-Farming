//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract polarisYieldFarming is Ownable, ReentrancyGuard{

    struct Investment {
        uint256 amount;
        uint256 startTime;
    }

    address owner;
    IERC20 polarisToken;
    uint256 apy;

    mapping(address=> Investment) investments;

    event Stake(address user, uint256 amount);
    event Unstake(address user, uint256 amount);
    event ApyChanged(uint256 time, uint256 newValue);

    constructor(address _polarisTokenAddress, uint256 _initialApy){
        polarisToken = _polarisTokenAddress;
        apy = initialApy;
    }

    function stake(address user, uint256 amount) external nonReentrant{
        require(msg.sender == user, "Cannot stake for somebody else");
        require(polarisToken.balanceOf(msg.sender) > amount, "Cant stake <= to balance");

        polarisToken.transferFrom(msg.sender, address(this), amount);

        thisUserInvestment[msg.sender].amount = amount;
        thisUserInvestment[msg.sender].time = block.timestamp;

        

    }

    function unstake(address user, uint256 amount) external nonReentrant{
        require(msg.sender == user, "Cannot stake for somebody else");
        
        uint finalAmount = thisUserInvestment[msg.sender].amount + calculateEarnings;
    

        polarisToken.transfer(msg.sender, finalAmount);

        
        thisUserInvestment[msg.sender].time = block.timestamp;
        thisUserInvestment[msg.sender].amount = 0;

        
        
    }

    function changeApy(uint256 newApy) external onlyOwner{
       
        require(newApy < 15);
        apy = newApy;
    }

    function changeOwner() external onlyOwner{

    }

	function calculateEarnings() internal returns(uint256) {



    }
    

    


}



