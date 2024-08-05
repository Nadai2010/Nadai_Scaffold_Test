import {
  deployContract,
  executeDeployCalls,
  exportDeployments,
  deployer,
} from "./deploy-contract";
import { green } from "./helpers/colorize-log";

/**
 * Deploy a contract using the specified parameters.
 *
 * @example (deploy contract with contructorArgs)
 * const deployScript = async (): Promise<void> => {
 *   await deployContract(
 *     {
 *       contract: "YourContract",
 *       contractName: "YourContractExportName",
 *       constructorArgs: {
 *         owner: deployer.address,
 *       },
 *       options: {
 *         maxFee: BigInt(1000000000000)
 *       }
 *     }
 *   );
 * };
 *
 * @example (deploy contract without contructorArgs)
 * const deployScript = async (): Promise<void> => {
 *   await deployContract(
 *     {
 *       contract: "YourContract",
 *       contractName: "YourContractExportName",
 *       options: {
 *         maxFee: BigInt(1000000000000)
 *       }
 *     }
 *   );
 * };
 *
 *
 * @returns {Promise<void>}
 */
const deployScript = async (): Promise<void> => {
  await deployContract({
    contract: "YourContract",
    constructorArgs: {
      owner: deployer.address,
    },
  });

  const dai = await deployContract({
    contract: "MockToken",
    contractName: "DAI",
    constructorArgs: {
      name: "DAI",
      symbol: "DAI",
      initial_supply: 1000000000000000000000n,
      recipient: deployer.address,
      owner: deployer.address,
    },
  });

  const usdt = await deployContract({
    contract: "MockToken",
    contractName: "USDT",
    constructorArgs: {
      name: "USDT",
      symbol: "USDT",
      initial_supply: 1000000000000000000000n,
      recipient: deployer.address,
      owner: deployer.address,
    },
  });

  const strk = await deployContract({
    contract: "MockToken",
    contractName: "STRK",
    constructorArgs: {
      name: "STRK",
      symbol: "STRK",
      initial_supply: 1000000000000000000000n,
      recipient: deployer.address,
      owner: deployer.address,
    },
  });

  const nai = await deployContract({
    contract: "MockToken",
    contractName: "NAI",
    constructorArgs: {
      name: "NAI",
      symbol: "NAI",
      initial_supply: 1000000000000000000000n,
      recipient: deployer.address,
      owner: deployer.address,
    },
  });

  const ammScaffold = await deployContract({
    contract: "ConstantProductAmm",
    contractName: "ScaffoldAMM",
    constructorArgs: {
      token0: dai.address,
      token1: usdt.address,
      fee: 1,
    },
  });

  const ammNadai = await deployContract({
    contract: "ConstantProductAmm",
    contractName: "NadaiAMM",
    constructorArgs: {
      token0: nai.address,
      token1: usdt.address,
      fee: 1,
    },
  });

  const ammStarknet = await deployContract({
    contract: "ConstantProductAmm",
    contractName: "StarknetAMM",
    constructorArgs: {
      token0: strk.address,
      token1: usdt.address,
      fee: 1,
    },
  });

  const staking = await deployContract({
    contract: "StakingContract",
    contractName: "Staking",
    constructorArgs: {
      staking_token_address: nai.address,
      reward_token_address: strk.address,
      owner_address: deployer.address,
    },
  });

  const vault = await deployContract({
    contract: "SimpleVault",
    contractName: "Vault",
    constructorArgs: {
      token: strk.address,
    },
  });

  const pragma = await deployContract({
    contract: "PriceFeedExample",
    contractName: "PriceFeedExample",
    constructorArgs: {
      pragma_contract:
        "0x2a85bd616f912537c50a49a4076db02c00b29b2cdc8a197ce92ed1837fa875b",
    },
  });
};

deployScript()
  .then(async () => {
    await executeDeployCalls();
    exportDeployments();

    console.log(green("All Setup Done"));
  })
  .catch(console.error);
