import { ethers, network } from "hardhat";
import fs from "fs";
import { loadJsonFile } from "../../utils";
import previousSunday from "date-fns/previousSunday";
import previousWednesday from "date-fns/previousWednesday";
import nextWednesday from "date-fns/nextWednesday";

async function main() {
  const fileName = `addresses/addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);
  const [EndersPacks, _accounts] = await Promise.all([
    ethers.getContractFactory("EndersPack", {
      libraries: {
        LootBoxRandomness: fileData.library,
      },
    }),

    ethers.getSigners(),
  ]);

  function today() {
    var today: any = new Date();
    today.setDate(today.getDate());

    return today;
  }

  function lastDate() {
    var date = new Date();
    return previousSunday(date);
  }

  const [data, gameSettings]: any = await Promise.all([
    await (
      await fetch(
        "https://endersgate-test-server.herokuapp.com/api/v1/getPlayersRoundInfos?from=0&limit=10000",
      )
    ).json(),
    await (
      await fetch("https://endergate.herokuapp.com/api/v1/getGameSetting")
    ).json(),
  ]);

  const endersPacks = EndersPacks.attach(fileData.pack);

  const winners = data
    ?.map((user: any) => {
      return {
        ...user,
        histories: user.histories.filter((game: any) => {
          console.log(game.finish_time);
          return game.finish_time < today() && game.finish_time > lastDate();
        }),
      };
    })
    .map((user: any) => {
      let wins = 0,
        losses = 0,
        points = 0;
      for (let i = 0; i < user.histories.length; i++) {
        let game_result_expected = -1;
        if (user.histories[i].player1 == user.id) {
          game_result_expected = 0;
        } else {
          game_result_expected = 1;
        }
        if (user.histories[i].game_result == game_result_expected) {
          wins++;
          points += gameSettings.gameSetting.DuelPointIncrease;
        }
      }
      return { ...user, wins, losses, point: points };
    })
    .sort((a: any, b: any) => b.points - a.points || b.level - a.level)
    .filter((user: any, i: any) => i < 3);

  console.log(winners, "WINNERS");

  console.log("Next Date", lastDate(), "Last Date", today(), "Today");

  const rewards = [
    {
      winner: winners[0],
      ids: [0, 1, 2],
      quantity: [1, 1, 1],
    },
    {
      winner: winners[1],
      ids: [0, 1],
      quantity: [1, 1],
    },
    {
      winner: winners[2],
      ids: [0],
      quantity: [1],
    },
  ];

  const txs: any = [];

  for (let i = 0; i < rewards.length; i++) {
    const { winner, ids, quantity } = rewards[i];
    const tx = await endersPacks.safeBatchTransferFrom(
      _accounts[0].address,
      winner.address,
      ids,
      quantity,
      "0x00",
    );
    console.log(tx);
    txs.push(
      `https://${
        network.name === "mumbai" ? "mumbai." : ""
      }polygonscan.com/tx/${tx.hash}`,
    );
  }

  const configFileName = `airdrops/rewards.${network.name}.json`;

  const airdropFileData = loadJsonFile(configFileName);

  const configData = JSON.stringify(
    {
      ...airdropFileData,
      [`${today().toLocaleDateString()}`]: txs,
    },
    null,
    2,
  );
  fs.writeFileSync(configFileName, configData);
  console.log("SUCCESS", configData);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
