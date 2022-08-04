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

    IERC20 public polarisToken;
    uint256 public apy;

    mapping(address => Investment) public investments;

    event Stake(address user, uint256 amount);
    event Unstake(address user, uint256 amount);
    event ApyChanged(uint256 time, uint256 newValue);

    constructor(IERC20 _polarisTokenAddress, uint256 _initialApy){
        polarisToken = _polarisTokenAddress;
        apy = _initialApy;
    }

    function stake(address user, uint256 amount) external nonReentrant returns(bool){
        // maybe works without this
        require(polarisToken.balanceOf(user) > amount, "Cant stake <= to balance");

        investments[user].amount = amount;
        investments[user].startTime = block.timestamp;

        return true;

        emit Stake(user, amount);

    }

    function unstake(address user) external nonReentrant{
        require(msg.sender == user, "Cannot stake for somebody else");
        
        uint finalAmount = investments[msg.sender].amount + calculateEarnings(user);
    

        polarisToken.transfer(msg.sender, finalAmount);

        
        investments[msg.sender].startTime = block.timestamp;
        investments[msg.sender].amount = 0;

        emit Unstake(user, finalAmount);
        
    }

    function changeApy(uint256 newApy) external onlyOwner{
       
        require(newApy < 15);
        apy = newApy;
    }




	function calculateEarnings(address user) internal view returns(uint256) {
        // earnings = apy * user investment * year fraction * 10^4 to handle some imprecisions
         uint256 earnings = ((apy/100) * investments[user].amount * (block.timestamp - investments[user].startTime)/ (365 days)) * 10000; 

        return earnings;

    }
    

    


}



