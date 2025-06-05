const hre = require("hardhat");
const fs = require("fs");
const fse = require("fs-extra");
const { verify } = require("../utils/verify");

const LOCAL_NETWORKS = ["localhost", "ganache", "blockdag"];

async function deployMock() {
  const DECIMALS = 8;
  const INITIAL_PRICE = 200000000000;

  try {
    console.log("Deploying MockV3Aggregator...");
    const Mock = await hre.ethers.getContractFactory("MockV3Aggregator");
    const mockContract = await Mock.deploy(DECIMALS, INITIAL_PRICE);
    await mockContract.deployed();
    console.log("MockV3Aggregator deployed to:", mockContract.address);
    return mockContract.address;
  } catch (error) {
    throw new Error(`Failed to deploy MockV3Aggregator: ${error.message}`);
  }
}

async function main() {
  try {
    const listingFee = hre.ethers.utils.parseEther("0.001");
    let priceFeedAddress;

    console.log(`Deploying to network: ${hre.network.name}`);
    if (LOCAL_NETWORKS.includes(hre.network.name)) {
      priceFeedAddress = await deployMock();
    } else {
      throw new Error("Price feed address not set for non-local network");
    }

    console.log("Deploying DecentralAirbnb...");
    const DecentralAirbnb = await hre.ethers.getContractFactory("DecentralAirbnb");
    const airbnbContract = await DecentralAirbnb.deploy(listingFee, priceFeedAddress);
    await airbnbContract.deployed();
    console.log("DecentralAirbnb deployed to:", airbnbContract.address);
    console.log("Network deployed to:", hre.network.name);

    if (fs.existsSync("../src")) {
      console.log("Copying artifacts to frontend...");
      fs.rmSync("../src/artifacts", { recursive: true, force: true });
      fse.copySync("./artifacts/contracts", "../src/artifacts");
      fs.writeFileSync(
        "../src/utils/contracts-config.js",
        `
        export const contractAddress = "${airbnbContract.address}";
        export const ownerAddress = "${airbnbContract.signer.address}";
        export const networkDeployedTo = "${hre.network.config.chainId}";
        `
      );
      console.log("Artifacts and config copied to frontend.");
    }

    if (!LOCAL_NETWORKS.includes(hre.network.name) && hre.config.etherscan?.apiKey) {
      console.log("Verifying contract...");
      await airbnbContract.deployTransaction.wait(6);
      await verify(airbnbContract.address, [listingFee, priceFeedAddress]);
      console.log("Contract verified.");
    }
  } catch (error) {
    console.error("Deployment failed:", error.message);
    throw error;
  }
}

main()
  .then(() => {
    console.log("Deployment completed successfully.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });