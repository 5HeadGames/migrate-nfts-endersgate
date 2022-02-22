
import Moralis from 'moralis/node'
import fs from 'fs'

const appRoot = require('app-root-path');

export const uploadIpfs = async ({path}: {path: string}) => {
    const name = path.split('/').reverse()[0]

    await Moralis.start({
        serverUrl: process.env.MORALIS_SERVER_URL,
        appId: process.env.MORALIS_APP_ID,
        masterKey: process.env.MORALIS_MASTER_KEY,
    });

    console.log({path: `${appRoot}${path}`})
    const buff = fs.readFileSync(`${appRoot}${path}`).toString("base64");
    const file = new Moralis.File(name, {base64: buff})

    console.log('UPLOADING...', `${appRoot}${path}`)
    await file.saveIPFS({useMasterKey: true})

    return (file as any).ipfs()
}
