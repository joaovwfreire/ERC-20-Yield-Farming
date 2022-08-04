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
      const tx = await polarisTokenContract.connect(user1).transfer(user2.address, 5000);
      //const receipt = await tx.wait();
        //console.log(receipt);
     
      
      await expect(await polarisTokenContract.balanceOf(user2.address)).to.equal(5000);
    });

    it("Should show correct balances", async function () {
        await expect(await polarisTokenContract.balanceOf(user1.address)).to.equal(999995000);


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

   
    });

    describe("Stake", function () {

        
        it("Should send the yield contract a couple of tokens", async function () {
            let tx = await polarisTokenContract.connect(user1).transfer(polarisYieldFarmingDeployed.address, 500000);
            let receipt = await tx.wait();
        
            console.log(receipt.events);
            await expect(await polarisTokenContract.balanceOf(polarisYieldFarmingDeployed.address)).to.equal(500000);

            console.log(await polarisYieldFarmingDeployed.investments(user1.address));
            await expect(await polarisYieldFarmingDeployed.investments(user1.address)).to.equal(500000);
        
        });
    
  
       
     
      });

      describe("Unstake", function () {

        
        

        it("Should return the original amount invested plus it's earnings", async function () {
          
          await ethers.provider.send("evm_increaseTime", [3600 * 23 + 3590])

            const tx = await polarisYieldFarmingDeployed.connect(user1).unstake(user1.address);
            const receipt = await tx.wait();

            console.log(receipt.events[1]);
           
            
            await expect(await polarisTokenContract.balanceOf(polarisYieldFarmingDeployed.address)).to.equal(500000);
        
        });

        it("Should change the user's investment size to ")
    
  
       
     
      });
})
});