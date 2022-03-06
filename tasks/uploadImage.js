const {uploadIpfs, writeJsonFile} = require("../utils");

task("upload:image", "Upload image to ipfs")
  .addOptionalParam("path", "File location")
  .addParam("name", "File name")
  .setAction(async (taskArgs, hardhat) => {
    const {path, name} = taskArgs;
    const finalPath = path ? path : `/nfts/images/${name}.png`
    const ipfs = await uploadIpfs({path: finalPath});
    const hash = ipfs.split("/").reverse()[0];
    writeJsonFile({
      path: "/nfts/metadata/images.json",
      data: {
        [name]: {
          ipfs,
          hash,
        },
      },
    });
  });
