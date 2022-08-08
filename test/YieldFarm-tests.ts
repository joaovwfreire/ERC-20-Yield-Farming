import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Polaris Yield Farm", function () {
  let user1: any;
  let user2: any;
  let user3: any;
  let polarisToken;
  let polarisTokenContract: any;
  let startBlock;
  let polarisYieldFarming;
  let polarisYieldFarmingDeployed: any;
  let polarisYieldFarmingCurrentBalance : number;

  before(async() => {
    [user1, user2, user3] = await ethers.getSigners();
    polarisToken = await ethers.getContractFactory("PolarisToken");
    polarisTokenContract = await polarisToken.connect(user1).deploy(1000000000);
    startBlock = await ethers.provider.getBlock("latest");


  })
  

  describe("Polaris Token", function () {
    it("Should deploy the correct amount", async function () {
        let user1TokenBalance = (await polarisTokenContract.balanceOf(user1.address))
        expect(user1TokenBalance)
        .to.equal("1000000000")

    });

    it("Should transfer a couple of tokens to someone else", async function () {
      const tx = await polarisTokenContract.connect(user1).transfer(user2.address, 50000);
      
     
      
      await expect(await polarisTokenContract.balanceOf(user2.address)).to.equal(50000);
    });

    it("Should show correct balances", async function () {
        await expect(await polarisTokenContract.balanceOf(user1.address)).to.equal(999950000);


    });

    
});
    

  describe("Yield Farming", function () {
    describe("Constructor ", function () {
      it("Should deploy with correct token address", async function () {
        polarisYieldFarming = await ethers.getContractFactory("polarisYieldFarming");
        polarisYieldFarmingDeployed = await polarisYieldFarming.connect(user1).deploy(polarisTokenContract.address, 10);
        
        await expect(await polarisYieldFarmingDeployed.polarisToken()).to.equal(polarisTokenContract.address);

      });

      it("Should deploy with correct apy", async function () {
        await expect(await polarisYieldFarmingDeployed.apy()).to.equal(10);
      });

      it("Should update the yield farm contract address that's proxied by the token contract", async function () {
        await polarisTokenContract.connect(user1).updateYieldProxy(polarisYieldFarmingDeployed.address);

        await expect(await polarisTokenContract.yieldProxy()).to.equal(polarisYieldFarmingDeployed.address);
        
      })

   
    });

    describe("Stake", function () {

        
        it("Should send the yield contract a couple of tokens", async function () {
            await polarisTokenContract.connect(user2).transfer(polarisYieldFarmingDeployed.address, 4999);
            let tx = await polarisTokenContract.connect(user1).transfer(polarisYieldFarmingDeployed.address, 500000);
            let receipt = await tx.wait();
        
            //console.log(receipt.events);
            await expect(await polarisTokenContract.balanceOf(polarisYieldFarmingDeployed.address)).to.equal(504999);

            let nonHexValue = 500000;
           
            await expect((await polarisYieldFarmingDeployed.investments(user1.address))[0].toNumber()).to.equal(nonHexValue);
            await expect((await polarisYieldFarmingDeployed.investments(user1.address))[1].toNumber()).to.equal((await ethers.provider.getBlock("latest")).timestamp)
        });
    
  
       
     
      });

      describe("Unstake", function () {

        
        it("Should return the original amount invested plus it's earnings", async function () {
          
          const thirtyDays = 30 * 24 * 60 * 60;
          await ethers.provider.send('evm_increaseTime', [thirtyDays]);
          await ethers.provider.send('evm_mine', []);

          // _calculateEarnings function made for unit tests since the original one has internal access and therefore cannot be called.
          const user1Earnings = await polarisYieldFarmingDeployed._calculateEarnings(user1.address);
          
          await polarisYieldFarmingDeployed.connect(user1).unstake(user1.address);
              
          await expect(await polarisTokenContract.balanceOf(polarisYieldFarmingDeployed.address)).to.equal(4999 - user1Earnings.toNumber());
          await expect(await polarisTokenContract.balanceOf(user1.address)).to.equal(999900000 + 50000 + user1Earnings.toNumber());

          polarisYieldFarmingCurrentBalance = 4999 - user1Earnings.toNumber();
        });

        it("Should change the APY value ", async function(){
          await polarisTokenContract.connect(user1).transfer(polarisYieldFarmingDeployed.address, 5000000);

          polarisYieldFarmingCurrentBalance += 5000000;

          const user1Earnings = await polarisYieldFarmingDeployed._calculateEarnings(user1.address);
          
          await polarisYieldFarmingDeployed.connect(user1).changeApy(14);
              
          await expect(await polarisYieldFarmingDeployed.apy()).to.equal(14);
        
        })

        it("Should give earnings proportional to the new APY  ", async function(){

          const user2Earnings = await polarisYieldFarmingDeployed._calculateEarnings(user2.address);
          const user2OnContractBalance = (await polarisYieldFarmingDeployed.investments(user2.address))[0].toNumber();
          const user2InitialBalance = (await polarisTokenContract.balanceOf(user2.address)).toNumber();

          
          await polarisYieldFarmingDeployed.connect(user2).unstake(user2.address);
              
          await expect(await polarisTokenContract.balanceOf(polarisYieldFarmingDeployed.address)).to.equal(polarisYieldFarmingCurrentBalance - user2Earnings.toNumber() - user2OnContractBalance);
          await expect(await polarisTokenContract.balanceOf(user2.address)).to.equal(user2InitialBalance + user2OnContractBalance + user2Earnings.toNumber());
        })
    
    
  
       

      });
})
});