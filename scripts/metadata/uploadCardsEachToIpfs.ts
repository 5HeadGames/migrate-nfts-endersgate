import { writeJsonFile } from "../../utils/index";
import { filesFromPath, getFilesFromPath } from "files-from-path";
import path from "path";
import { File, NFTStorage } from "nft.storage";

// The 'fs' builtin module on Node.js provides access to the file system
import { promises } from "fs";

async function fileFromPath(filePath: any) {
  const content = await promises.readFile(filePath);
  return new File([content], path.basename(filePath), { type: ".webp" });
}

const init = async () => {
  const client = new NFTStorage({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDI0MTlhMTNFNTlmMTc0NzYxNGY0NDY0M2E4N0I4ODAyZTI5ODIxNDkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcwMTc5NjA0MzA5MywibmFtZSI6Ik1FIn0.umae5LUnN440iSkF7fkf_ZUePnH2vgHFLlhjThlwikc",
  });

  const arrayTypes = [
    "Avatar-Cards",
    "Action",
    "Reaction",
    "Gold-Guardian-Cards",
    "Iron-Guardian-Cards",
    "Legendary-Guardian-Cards",
    "Stone-Guardian-Cards",
    "Wood-Guardian-Cards",
  ];

  console.log("a?");

  for (let i = 0; i < arrayTypes.length; i++) {
    const directoryFiles = `EG-Cards/${arrayTypes[i]}`;

    const files = await getFilesFromPath(directoryFiles, {
      pathPrefix: path.resolve(directoryFiles), // see the note about pathPrefix below
      hidden: true, // use the default of false if you want to ignore files that start with '.'
    });
    const uploaded = [];
    for (const file of files) {
      console.log(file);
      const image = await fileFromPath(
        path.resolve(directoryFiles) + file.name,
      );
      console.log("pre-upload file", {
        name: file.name,
        image: image,
        description: "",
      });

      const cid = await client.store({
        name: file.name,
        image: image,
        description: "",
      });
      console.log("post-upload file", {
        name: file.name,
        image: image,
        description: "",
      });
      uploaded.push({
        name: file.name,
        link: cid.url,
      });
    }
    writeJsonFile({
      path: `/nfts/URIsFileEach.json`,
      data: {
        [arrayTypes[i]]: uploaded,
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
