
const {uploadIpfs, writeJsonFile} = require("../utils");

task("upload:metadata", "Upload metadata to ipfs")
  .addOptionalParam("path", "File location")
  .addParam("name", "Nft name")
  .setAction(async (taskArgs, hardhat) => {
    const {path, name} = taskArgs;
    const finalPath = path ? path : `/nfts/metadata/${name}.json`
    const ipfs = await uploadIpfs({path: finalPath});
    const hash = ipfs.split("/").reverse()[0];
    writeJsonFile({
      path: "/nfts/metadata/metadata.json",
      data: {
        [name]: {
          ipfs,
          hash,
        },
      },
    });
  });
