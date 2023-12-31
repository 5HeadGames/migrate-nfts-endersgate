import { writeJsonFile } from "../../utils/index";
import { filesFromPath, getFilesFromPath } from "files-from-path";
import path from "path";
import { NFTStorage } from "nft.storage";

const init = async () => {
  const client = new NFTStorage({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDI0MTlhMTNFNTlmMTc0NzYxNGY0NDY0M2E4N0I4ODAyZTI5ODIxNDkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcwMTc5NjA0MzA5MywibmFtZSI6Ik1FIn0.umae5LUnN440iSkF7fkf_ZUePnH2vgHFLlhjThlwikc",
  });

  const arrayTypes = [
    "Action/1",
    "Action/2",
    "Action/3",
    "Reaction/1",
    "Reaction/2",
    "Reaction/3",
    "Gold-Guardian-Cards/1",
    "Gold-Guardian-Cards/2",
    "Gold-Guardian-Cards/3",
    "Iron-Guardian-Cards/1",
    "Iron-Guardian-Cards/2",
    "Iron-Guardian-Cards/3",
    "Legendary-Guardian-Cards",
    "Stone-Guardian-Cards/3",
    "Stone-Guardian-Cards/2",
    "Stone-Guardian-Cards/1",
    "Wood-Guardian-Cards/1",
    "Wood-Guardian-Cards/2",
    "Wood-Guardian-Cards/3",
  ];

  for (let i = 0; i < arrayTypes.length; i++) {
    const directoryFiles = `EG-Cards/${arrayTypes[i]}`;
    console.log("Uploading files from " + directoryFiles);

    const files = await getFilesFromPath(directoryFiles, {
      pathPrefix: path.resolve(directoryFiles), // see the note about pathPrefix below
      hidden: true, // use the default of false if you want to ignore files that start with '.'
    });

    console.log("pre-upload");
    const cid = await client.storeDirectory(files);
    console.log("post-upload");

    writeJsonFile({
      path: `/nfts/URIs.json`,
      data: {
        [arrayTypes[i]]: `https://${cid}.ipfs.nftstorage.link/`,
      },
    });
  }
};

init()
  .then(() => {
    console.log("SUCCESS");
  })
  .catch((err) => {
    console.log("ERROR", err);
  });
