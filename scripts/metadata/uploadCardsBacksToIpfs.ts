import { writeJsonFile } from "../../utils/index";
import { filesFromPath, getFilesFromPath } from "files-from-path";
import path from "path";
import { NFTStorage } from "nft.storage";

const init = async () => {
  const client = new NFTStorage({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDI0MTlhMTNFNTlmMTc0NzYxNGY0NDY0M2E4N0I4ODAyZTI5ODIxNDkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcwMTc5NjA0MzA5MywibmFtZSI6Ik1FIn0.umae5LUnN440iSkF7fkf_ZUePnH2vgHFLlhjThlwikc",
  });

  const arrayTypes = ["Backs"];

  // for (let i = 0; i <= arrayTypes.length; i++) {
  const directoryFiles = `EG-Cards/Backs`;
  console.log("Uploading files from " + directoryFiles);

  const files = await getFilesFromPath(directoryFiles, {
    pathPrefix: path.resolve(directoryFiles), // see the note about pathPrefix below
    hidden: true, // use the default of false if you want to ignore files that start with '.'
  });

  console.log("pre-upload");
  const cid = await client.storeDirectory(files);
  console.log("post-upload");

  writeJsonFile({
    path: `/nfts/URIsBack.json`,
    data: {
      Backs: `https://${cid}.ipfs.nftstorage.link/`,
    },
  });
  // }
};

init()
  .then(() => {
    console.log("SUCCESS");
  })
  .catch((err) => {
    console.log("ERROR", err);
  });
