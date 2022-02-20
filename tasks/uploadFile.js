const Moralis = require("moralis/node")
const fs = require("fs")
const {Buffer} = require("buffer")
const appRoot = require('app-root-path');

task("upload", "Upload image to ipfs")
  .addParam("path", "File location")
  .setAction(async (taskArgs, hardhat) => {
    const {path} = taskArgs
    const name = path.split('/').reverse()[0]

    await Moralis.start({
      serverUrl: process.env.MORALIS_SERVER_URL,
      appId: process.env.MORALIS_APP_ID,
      masterKey: process.env.MORALIS_MASTER_KEY,
    });

    const buff = fs.readFileSync(`${appRoot}${path}`).toString("base64");
    const file = new Moralis.File(name, {base64: buff})

    console.log(name)
    console.log('UPLOADING...', `${appRoot}${path}`)
    await file.saveIPFS({useMasterKey: true})
    console.log('SUCCESS', file.ipfs())
  })

