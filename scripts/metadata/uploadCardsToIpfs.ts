import { writeJsonFile } from "../../utils/index";
import { filesFromPath } from "files-from-path";
import path from "path";
import { Web3Storage, getFilesFromPath } from "web3.storage";

const init = async () => {
  const client = new Web3Storage({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDRiNjMwZEI5OTMwNWU4Q2M3ZjQxQzFiOTEzNTlCNUEyMDI4OTYxMTYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTQwOTg0MDE4NzIsIm5hbWUiOiJlbmRlcnNnIn0.vpHXhTvikwns1_GUwD4pQwpk0-JCNYLcH2DEGk9CXpo",
  });

  const arrayTypes = [
    "Action",
    "Reaction",
    "Avatar-Cards",
    "Gold-Guardian-Cards",
    "Iron-Guardian-Cards",
    "Legendary-Guardian-Cards",
    "Stone-Guardian-Cards",
    "Wood-Guardian-Cards",
  ];

  for (let i = 0; i <= arrayTypes.length; i++) {
    const directoryFiles = `EG-Cards/${arrayTypes[i]}`;
    console.log("Uploading files from " + directoryFiles);

    const files = await getFilesFromPath(directoryFiles, {
      pathPrefix: path.resolve(directoryFiles), // see the note about pathPrefix below
      hidden: true, // use the default of false if you want to ignore files that start with '.'
    });

    const cid = await client.put(files);

    writeJsonFile({
      path: `/nfts/URIs.json`,
      data: {
        [arrayTypes[i]]: `https://${cid}.ipfs.dweb.link/`,
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
