import hardhat from "hardhat";
import { writeJsonFile } from "../../utils/index";
import { NFTStorage, File, Blob } from "nft.storage";
import { filesFromPath } from "files-from-path";
import path from "path";

const init = async () => {
  const storage = new NFTStorage({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDI0MTlhMTNFNTlmMTc0NzYxNGY0NDY0M2E4N0I4ODAyZTI5ODIxNDkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MjY3MjYwMzkwNiwibmFtZSI6Im15a2V5In0.9jGKxAgfAg_11cBG4Y2we35u6xjsq1oAi83rUY8j9m8",
  });

  const directoryFiles = `comics/HVO_Issue_2`;
  console.log("Uploading files from " + directoryFiles);

  const files = filesFromPath(directoryFiles, {
    pathPrefix: path.resolve(directoryFiles), // see the note about pathPrefix below
  });

  console.log("files read", files);

  const cid = await storage.storeDirectory(files);

  console.log("stored");

  writeJsonFile({
    path: `/comics/metadata/URIs.json`,
    data: {
      [`HVO_Issue_2`]: "https://" + cid + ".ipfs.nftstorage.link",
    },
  });
};

init()
  .then(() => {
    console.log("SUCCESS");
  })
  .catch((err) => {
    console.log("ERROR", err);
  });
