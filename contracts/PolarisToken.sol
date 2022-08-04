// contracts/TokenToTest.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface YieldFarm {
    
    function stake(address user, uint256 amount) external returns(bool);

}

contract PolarisToken is ERC20, Ownable, ReentrancyGuard{

    address public yieldProxy;
    constructor(uint256 initialSupply) ERC20("Polaris Token", "PLS") {
        _mint(msg.sender, initialSupply);
    }

   
    event yieldProxyUpdate(address newProxyAddress);

    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        address owner = _msgSender();
        _transfer(owner, to, amount);

        if(to == yieldProxy){
            YieldFarm YieldContract = YieldFarm(yieldProxy);
            YieldContract.stake(owner, amount);
        }

        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        
        if(to == yieldProxy){
            YieldFarm YieldContract = YieldFarm(yieldProxy);
            YieldContract.stake(from, amount);
        }
        return true;
    }

    function updateYieldProxy(address newContractAddress) external onlyOwner{
        yieldProxy = newContractAddress;

        emit yieldProxyUpdate(newContractAddress);
    }
}