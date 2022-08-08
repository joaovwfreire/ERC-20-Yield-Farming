# Polaris Yield Farming

ERC20 Token and Yield Farming smart contract made for the Polaris on Chain project. 

Polaris Token has a couple of differences in comparison to the normal ERC-20 token.

It has control flow into it's transfer actions, so that users can automatically stake their tokens into the Yield Farming pool provided the tokens are transferred to the correct address. 
```
function transfer(address to, uint256 amount) public virtual override returns (bool) {
        address owner = _msgSender();
        _transfer(owner, to, amount);

        if(to == yieldProxy){
            YieldFarm YieldContract = YieldFarm(yieldProxy);
            YieldContract.stake(owner, amount);
        }

        return true;
    }
    
function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        
        if(to == yieldProxy){
            YieldFarm YieldContract = YieldFarm(yieldProxy);
            YieldContract.stake(from, amount);
        }
        return true;
    }
 ```
 

 
 The Yield Farm implementation is an upgradable proxy built into the Polaris Token smart contract. The entry point is made via token transfers to the current yield proxy contract and ONLY the token can call the stake function (modifier currently not implement).
 


 
