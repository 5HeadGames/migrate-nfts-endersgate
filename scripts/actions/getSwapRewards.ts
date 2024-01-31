import { ethers, network } from "hardhat";
import { loadJsonFile } from "../../utils";

async function main(): Promise<void> {
  const fileName = `addresses/addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);

  const endersGate = (await ethers.getContractFactory("EndersGate")).attach(
    fileData.endersGate,
  );

  const wallets: any = [
    {
      NFTsToMint: [{ id: 233, balance: 10 }],
      address: "0x04068E69c09c0422997AF8CC9ADb68272840248D",
    },
    {
      NFTsToMint: [{ id: 233, balance: 1 }],
      address: "0x53Bcb0922028d91148128173F79a74938B6591B3",
    },
    {
      NFTsToMint: [{ id: 233, balance: 1 }],
      address: "0xC45Ab7cdBCc9f7A7AEbB61a4540492F5Ee55Ec90",
    },
    {
      NFTsToMint: [{ id: 233, balance: 2 }],
      address: "0xd918736286a63E0637A9FA521E60C90A5Cc0fda4",
    },
    {
      NFTsToMint: [{ id: 233, balance: 14 }],
      address: "0xB527198a114073a7F097eC866AbBFca2995EeA36",
    },
    {
      NFTsToMint: [{ id: 233, balance: 1 }],
      address: "0xcd9F96F9289573d4e3319E60F0FED1F082cFf7B4",
    },
    {
      NFTsToMint: [{ id: 233, balance: 2 }],
      address: "0xA6F1C95D8d069b894ef506e15E4AE9ddf065a39F",
    },
    {
      NFTsToMint: [{ id: 233, balance: 3 }],
      address: "0xef354d312b9d923792c6c1a0a06989181a45a168",
    },
    {
      NFTsToMint: [{ id: 233, balance: 2 }],
      address: "0x69CB9ac1eaF23B6Ea23Fd1a8Bd578dA94b97FCAa",
    },
    {
      NFTsToMint: [{ id: 233, balance: 3 }],
      address: "0xcC2b9fDe1e59342C1Ae10ebc02bb44E1dbE2B02D",
    },
    {
      NFTsToMint: [{ id: 233, balance: 2 }],
      address: "0x8803C0fa17C7050000895b12170D6e412a48ECD2",
    },
    {
      NFTsToMint: [{ id: 233, balance: 2 }],
      address: "0x3589Cc53b10659505C12922A1F8E78bB30770B16",
    },
    {
      NFTsToMint: [{ id: 233, balance: 1 }],
      address: "0x1D0Aabc6403255E28521CdA694fB2832A60579F7",
    },
    {
      NFTsToMint: [{ id: 233, balance: 4 }],
      address: "0xa6e1096715AFE0B132052e0589a980CFD378f133",
    },
  ];

  for (let i = 0; i < wallets.length; i++) {
    const { address, NFTsToMint } = wallets[i];
    const balance = await endersGate.balanceOf(address, 233);
    if (balance.toNumber() == 0) {
      await endersGate.mintBatch(
        address,
        NFTsToMint.map(({ id }: any) => id),
        NFTsToMint.map(({ balance }: any) => balance),
        "0x00",
      );
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
