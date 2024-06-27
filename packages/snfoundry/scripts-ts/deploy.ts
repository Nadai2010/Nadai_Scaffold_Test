import { deployContract, deployer, exportDeployments } from "./deploy-contract";

const deployScript = async (): Promise<void> => {

  // await deployContract(
  //   {  },
  //   "YourContract2",
  // );

  const random = await deployContract(
    {
      randomness_contract_address: "0x60c69136b39319547a4df303b6b3a26fab8b2d78de90b6bd215ce82e9cb515c",
    },
    "SimpleVault",
  );
  

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

  const strk = await deployContract(
    {
      name: "STRK",
      symbol: "STRK",
      initial_supply: 1000000000000000000000n,
      recipient: deployer.address,
    },
    "MockToken",
    "STRK"
  );

  const nai = await deployContract(
    {
      name: "NAI",
      symbol: "NAI",
      initial_supply: 1000000000000000000000n,
      recipient: deployer.address,
    },
    "MockToken",
    "NAI"
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

  const ammNadai = await deployContract(
    {
      token0: nai.address,
      token1: usdt.address,
      fee: 1,
    },
    "ConstantProductAmm",
    "NadaiAMM"
  );

  const ammStarknet = await deployContract(
    {
      token0: strk.address,
      token1: usdt.address,
      fee: 1,
    },
    "ConstantProductAmm",
    "StarknetAMM"
  );

  const staking = await deployContract(
    {
      staking_token_address: nai.address,
      reward_token_address: strk.address,
      owner_address: deployer.address,
    },
    "StakingContract",
  );

  const vault = await deployContract(
    {
      token: strk.address,
    },
    "SimpleVault",
  );


}


deployScript()
  .then(() => {
    exportDeployments();
    console.log("All Setup Done");
  })
  .catch(console.error);


