import { getFilesFromPath } from "files-from-path";
import path from "path";

import { create } from "@web3-storage/w3up-client";
import { filesFromPaths } from "files-from-path";

const init = async () => {
  // e.g "./best-gifs"
  const path = process.env.PATH_TO_FILES;
  const files = await filesFromPaths([path]);

  const client = await create();
  const directoryCid = await client.uploadDirectory(files);
};

init()
  .then(() => {
    console.log("SUCCESS");
  })
  .catch((err) => {
    console.log("ERROR", err);
  });
