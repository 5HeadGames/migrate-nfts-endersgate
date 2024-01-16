/* eslint-disable no-process-exit */

import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  // Deploying the implementation contract
  const ImplementationContract = await ethers.getContractFactory("None"); // Replace with your actual implementation contract name
  // //   const implementation = await ImplementationContract.deploy();

  //   await implementation.deployed();
  //   console.log("Implementation contract deployed to:", implementation.address);

  // Deploying the proxy contract
  //   const ProxyContract = await ethers.getContractFactory("MyProxy");
  const proxy = await upgrades.deployProxy(ImplementationContract, [
    "0xd0daae2231e9cb96b94c8512223533293c3693bf",
    "0x341B67F3f4bdA0da82CCC1e83e9a04Da2BD88Cf1",
  ]); // Replace '0x' with your initialization data

  await proxy.deployed();
  //   console.log("Proxy contract deployed to:", proxy.address);

  // Interact with the proxy (optional)
  const myContract = await ethers.getContractAt("None", proxy.address); // Replace with your actual implementation contract name
  //   const value = await myContract.someFunction(); // Replace with a function from your implementation contract
  console.log("Value from the proxy:", myContract.address);

  console.log(
    await upgrades.erc1967.getImplementationAddress(proxy.address),
    " getImplementationAddress",
  );
  console.log(
    await upgrades.erc1967.getAdminAddress(proxy.address),
    " getAdminAddress",
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
