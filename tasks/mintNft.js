const {loadJsonFile} = require("../utils");
const appRoot = require("app-root-path");

const getFile = (name) => {
  const path = `/nfts/metadata/${name}.json`
  const file = loadJsonFile(`${appRoot}/${path}`)
  return file
}

task("mint", "Mint nft")
  .addParam("id", "Nft id")
  .addParam("amount", "Nft amount")
  .addParam("name", "local name")
  .setAction(async (taskArgs, hardhat) => {
    const {ethers, network} = hardhat
    const {id, amount, name} = taskArgs;
    const addresses = loadJsonFile(`addresses.${network.name}.json`)
    let image = getFile('images')[name]
    let metadata = getFile('metadata')[name]

    const signer = await ethers.getSigner()
    const endersGate = (await ethers.getContractFactory('EndersGate')).attach(addresses.endersGate)

    //if (!image) {
    //await hardhat.run('upload:image', {name})
    //image = getFile(name)[name]
    //}

    //if (!metadata) {
    //await hardhat.run('upload:metadata', {name})
    //metadata = getFile(name)[name]
    //}

    //console.log('Minting', signer.address, id, amount, metadata.hash)
    //const tx = await endersGate.mint(signer.address, id, amount, metadata.hash)
    //console.log('SUCCESS', (await tx.wait()).transactionHash)
  });
