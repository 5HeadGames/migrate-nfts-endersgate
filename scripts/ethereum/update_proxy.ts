// scripts/2.upgradeV2.ts
import { ethers, upgrades } from "hardhat";

const proxyAddress = "0x2BC5e2622839A68aa57310097c449d2e51AA1Cd3";
// const proxyAddress = '0x1CD0c84b7C7C1350d203677Bb22037A92Cc7e268'

async function main() {
  console.log(proxyAddress, " original Box(proxy) address");
  const DestinationMinter = await ethers.getContractFactory(
    "DestinationMinter",
  );
  console.log("upgrade to DestinationMinter...");
  const destinationMinter = await upgrades.upgradeProxy(
    proxyAddress,
    DestinationMinter,
    {
      call: {
        fn: "",
        args: [
          "0xd0daae2231e9cb96b94c8512223533293c3693bf",
          "0x341B67F3f4bdA0da82CCC1e83e9a04Da2BD88Cf1",
        ],
      },
    },
  );
  console.log(destinationMinter.address, " BoxV2 address(should be the same)");

  console.log(
    await upgrades.erc1967.getImplementationAddress(destinationMinter.address),
    " getImplementationAddress",
  );
  console.log(
    await upgrades.erc1967.getAdminAddress(destinationMinter.address),
    " getAdminAddress",
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
