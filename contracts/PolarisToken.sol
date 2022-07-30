// contracts/TokenToTest.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PolarisToken is ERC20, Ownable{
    constructor(uint256 initialSupply) ERC20("Polaris Token", "PLS") {
        _mint(msg.sender, initialSupply);
    }
}