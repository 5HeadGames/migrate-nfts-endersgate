const {uploadIpfs} = require('../utils')

task("upload", "Upload image to ipfs")
  .addParam("path", "File location")
  .setAction(async (taskArgs, hardhat) => {
    const ipfs = await uploadIpfs(taskArgs)
    console.log('SUCCESS', ipfs)
  })

