import {task} from "hardhat/config";
import {TaskArguments} from "hardhat/types";

import {Attack} from "../../src/types/Attack";
import {Attack__factory} from "../../src/types/factories/Attack__factory";

task("deploy:Greeter")
  .addParam("greeting", "Say hello, be nice")
  .setAction(async function (taskArguments: TaskArguments, {ethers}) {
    const attackFactory: Attack__factory = <Attack__factory>await ethers.getContractFactory("Greeter");
    const attack: Attack = <Attack>await attackFactory.deploy();
    await attack.deployed();
    console.log("Greeter deployed to: ", attack.address);
  });
