import { deployContract, deployer, exportDeployments } from "./deploy-contract";

const deployScript = async (): Promise<void> => {
  // await deployContract(
  //   {  },
  //   "YourContract2",
  // );

  const pragma = await deployContract("PriceFeedExample", {
    pragma_contract:
      "0x36031daa264c24520b11d93af622c848b2499b66b41d611bac95e13cfca131a",
  });

  const dai = await deployContract(
    "MockToken",
    {
      name: "DAI",
      symbol: "DAI",
      initial_supply: 1000000000000000000000n,
      recipient: deployer.address,
    },
    "DAI"
  );

  const usdt = await deployContract(
    "MockToken",
    {
      name: "USDT",
      symbol: "USDT",
      initial_supply: 1000000000000000000000n,
      recipient: deployer.address,
    },
    "USDT"
  );

  const strk = await deployContract(
    "MockToken",
    {
      name: "STRK",
      symbol: "STRK",
      initial_supply: 1000000000000000000000n,
      recipient: deployer.address,
    },
    "STRK"
  );

  const nai = await deployContract(
    "MockToken",
    {
      name: "NAI",
      symbol: "NAI",
      initial_supply: 1000000000000000000000n,
      recipient: deployer.address,
    },
    "NAI"
  );

  const ammScaffold = await deployContract(
    "ConstantProductAmm2",
    {
      token0: dai.address,
      token1: usdt.address,
      fee: 1,
    },
    "ScaffoldAMM"
  );

  const ammNadai = await deployContract(
    "ConstantProductAmm2",
    {
      token0: nai.address,
      token1: usdt.address,
      fee: 1,
    },
    "NadaiAMM"
  );

  const ammStarknet = await deployContract(
    "ConstantProductAmm2",
    {
      token0: strk.address,
      token1: usdt.address,
      fee: 1,
    },
    "StarknetAMM"
  );

  const staking = await deployContract("StakingContract", {
    staking_token_address: nai.address,
    reward_token_address: strk.address,
    owner_address: deployer.address,
  });

  const vault = await deployContract("SimpleVault", {
    token: strk.address,
  });
};

deployScript()
  .then(() => {
    exportDeployments();
    console.log("All Setup Done");
  })
  .catch(console.error);
