const hre = require("hardhat");

async function main() {

    const RENTit = await hre.ethers.getContractFactory("RENTit");
    const rentit = await RENTit.deploy();
    await rentit.deployed();

    console.log("RENTit deployed to:", rentit.address);
    storeRENTitData(rentit)


    const Minter = await hre.ethers.getContractFactory("Minter");
    const minter = await Minter.deploy();
    await minter.deployed();

    console.log("Minter deployed to:", minter.address);
    storeMinterData(minter);
}

function storeRENTitData(contract) {
    const fs = require("fs");
    const contractsDir = __dirname + "/../src/contracts";
  
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }
    fs.writeFileSync(
      contractsDir + "/RENTit-address.json",
      JSON.stringify({ RENTit: contract.address }, undefined, 2)
    );
  
    const RENTitArtifact = artifacts.readArtifactSync("RENTit");
  
    fs.writeFileSync(
      contractsDir + "/RENTit.json",
      JSON.stringify(RENTitArtifact, null, 2)
    );
}
  

function storeMinterData(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/Minter-address.json",
    JSON.stringify({ Minter: contract.address }, undefined, 2)
  );

  const MinterArtifact = artifacts.readArtifactSync("Minter");

  fs.writeFileSync(
    contractsDir + "/Minter.json",
    JSON.stringify(MinterArtifact, null, 2)
  );
 
}



  


main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});