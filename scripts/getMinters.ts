import {ethers} from "hardhat";

const oldAddresses = {
  dracul: {
    address: "0x51BE175Fa7A56B98BCFFA124D6Bd31480b093214",
    blockNumber: 20133969,
  },
  eross: {
    address: "0xE1C04284652be3771D514e5f05F823b35075D70F",
    blockNumber: 21013637,
  },
  presale: "0x08536482fDE0caDdef1C1f558E1D02b1c7b9e3f7",
};

async function main(): Promise<void> {
  const dracul = (await ethers.getContractFactory("ERC1155card")).attach(
    oldAddresses.dracul.address
  );
  const events = await dracul.queryFilter(
    dracul.filters.TransferSingle(),
    oldAddresses.dracul.blockNumber
  );

  console.log(events);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
