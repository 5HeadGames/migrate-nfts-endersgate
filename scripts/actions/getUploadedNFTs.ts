import { filesFromPath } from "files-from-path";
import { writeJsonFile } from "../../utils/index";
import path from "path";
import { Web3Storage, File, Blob } from "web3.storage";

const AllNfts = require("../cards.json");

const init = async () => {
  const client = new Web3Storage({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDRiNjMwZEI5OTMwNWU4Q2M3ZjQxQzFiOTEzNTlCNUEyMDI4OTYxMTYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTQwOTg0MDE4NzIsIm5hbWUiOiJlbmRlcnNnIn0.vpHXhTvikwns1_GUwD4pQwpk0-JCNYLcH2DEGk9CXpo",
  });

  const uploadItems = [];
  for await (const item of client.list({ maxResults: 300 })) {
    if (
      item.name.includes("Humans-vs-ogres-second-") ||
      item.name.includes("ezgif.com-gif-maker")
    ) {
      uploadItems.push(item);
    }
  }

  const sortedComics = uploadItems
    .sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    })
    .map((item) => {
      return {
        url: `https://${item.cid}.ipfs.dweb.link/${item.name}`,
        isPannal: true,
      };
    });

  writeJsonFile({
    path: "/nfts/metadata/HvO2Panels.json",
    data: sortedComics,
  });
};

init()
  .then(() => {
    console.log("SUCCESS");
  })
  .catch((err) => {
    console.log("ERROR", err);
  });
