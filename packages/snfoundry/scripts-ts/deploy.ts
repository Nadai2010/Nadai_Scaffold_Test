import { deployContract, deployer, exportDeployments } from "./deploy-contract";

const deployScript = async (): Promise<void> => {

  // await deployContract(
  //   {  },
  //   "YourContract2",
  // );

  const dai = await deployContract(
    {
      name: "DAI",
      symbol: "DAI",
      initial_supply: 1000000000000000000000n,
      recipient: deployer.address,
    },
    "MockToken",
    "DAI"
  );

  const usdt = await deployContract(
    {
      name: "USDT",
      symbol: "USDT",
      initial_supply: 1000000000000000000000n,
      recipient: deployer.address,
    },
    "MockToken",
    "USDT"
  );

  await deployContract(
    {
      name: "STRK",
      symbol: "STRK",
      initial_supply: 1000000000000000000000n,
      recipient: deployer.address,
    },
    "MockToken",
    "STRK"
  );

  const ammNadai = await deployContract(
    {
      token0: dai.address,
      token1: usdt.address,
      fee: 10,
    },
    "ConstantProductAmm",
    "NadaiAMM"
  );

  const ammScaffold = await deployContract(
    {
      token0: dai.address,
      token1: usdt.address,
      fee: 1,
    },
    "ConstantProductAmm",
    "ScaffoldAMM"
  );

}

deployScript()
  .then(() => {
    exportDeployments();
    console.log("All Setup Done");
  })
  .catch(console.error);


