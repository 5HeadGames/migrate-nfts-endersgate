import { filesFromPath } from "files-from-path";
import { writeJsonFile } from "../utils/index";
import path from "path";
import { NFTStorage, File, Blob } from "nft.storage";

const AllNfts = require("../cards.json");

const init = async () => {
  const storage = new NFTStorage({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDI0MTlhMTNFNTlmMTc0NzYxNGY0NDY0M2E4N0I4ODAyZTI5ODIxNDkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MjY3MjYwMzkwNiwibmFtZSI6Im15a2V5In0.9jGKxAgfAg_11cBG4Y2we35u6xjsq1oAi83rUY8j9m8",
  });

  const directoryPath = "./nfts/metadata/EndersGate";

  const files = filesFromPath(directoryPath, {
    pathPrefix: path.resolve(directoryPath), // see the note about pathPrefix below
    hidden: true, // use the default of false if you want to ignore files that start with '.'
  });

  const cid2 = await storage.storeDirectory(files);
  console.log(cid2);
};

init()
  .then(() => {
    console.log("SUCCESS");
  })
  .catch((err) => {
    console.log("ERROR", err);
  });
