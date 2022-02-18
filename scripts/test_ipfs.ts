import Moralis from "moralis/node";
import {Buffer} from "buffer";

const main = async () => {
  await Moralis.start({
    serverUrl: process.env.MORALIS_SERVER_URL,
    appId: process.env.MORALIS_APP_ID,
    masterKey: process.env.MORALIS_MASTER_KEY,
  });
  console.log({
    serverUrl: process.env.MORALIS_SERVER_URL,
    appId: process.env.MORALIS_APP_ID,
    masterKey: process.env.MORALIS_MASTER_KEY,
  })
  const buff = Buffer.from(JSON.stringify({hello: "world"})).toString("base64");
  const file = new Moralis.File("myfile.json", {base64: buff}) as any

  await file.saveIPFS({useMasterKey: true})
  console.log('SUCCESS', file.ipfs())
};

main()
  .then(() => {})
  .catch((err) => {
    console.log("ERR", err);
  });
