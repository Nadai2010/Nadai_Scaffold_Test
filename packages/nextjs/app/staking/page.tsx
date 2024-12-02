"use client";

import type { NextPage } from "next";
import {
  createContractCall,
  useScaffoldMultiWriteContract,
} from "~~/hooks/scaffold-stark/useScaffoldMultiWriteContract";
import { Address } from "../components/scaffold-stark";
import { useAccount } from "@starknet-react/core";
import { Address as AddressType } from "@starknet-react/chains";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useState } from "react";
import { getAllContracts } from "~~/utils/scaffold-stark/contractsData";

import strkLogo from "/public/logo-starknet.svg";
import naiLogo from "/public/logo-nai.png";
import { useScaffoldContract } from "~~/hooks/scaffold-stark/useScaffoldContract";

// Función para formatear valores en wei a ether
function formatEther(weiValue: number) {
  const etherValue = weiValue / 1e18;
  return etherValue.toFixed(1);
}

// Función para convertir valores en ether a wei
function toWei(etherValue: number) {
  return etherValue * 1e18;
}

const Starknet: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const contractsData = getAllContracts(); // Obtén los contratos desde la configuración

  // Estados para controlar el estado de la transacción
  const strkContractAddress = contractsData.STRK?.address; // Dirección del contrato STRK desde la configuración
  const naiContractAddress = contractsData.NAI?.address; // Dirección del contrato STRK desde la configuración

  const [isTransactionPending, setTransactionPending] = useState(false);
  const [rewardAmount, setRewardAmount] = useState("");
  const [durationAmount, setDurationAmount] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");
  const [withAmount, setWithAmount] = useState("");

  // Obtener contratos
  const { data: StakingContract } = useScaffoldContract({
    contractName: "Staking",
  });

  // Leer datos de contratos
  const { data: balanceDAI } = useScaffoldReadContract({
    contractName: "DAI",
    functionName: "balanceOf",
    args: [connectedAddress ?? ""],
    watch: true,
  });

  const { data: balanceUSDT } = useScaffoldReadContract({
    contractName: "USDT",
    functionName: "balanceOf",
    args: [connectedAddress ?? ""],
    watch: true,
  });

  const { data: balanceSTRK } = useScaffoldReadContract({
    contractName: "STRK",
    functionName: "balanceOf",
    args: [connectedAddress ?? ""],
    watch: true,
  });

  const { data: balanceNAI } = useScaffoldReadContract({
    contractName: "NAI",
    functionName: "balanceOf",
    args: [connectedAddress ?? ""],
    watch: true,
  });

  //Balance Reserves
  const { data: balanceStaking } = useScaffoldReadContract({
    contractName: "Staking",
    functionName: "get_stake",
    args: [connectedAddress ?? ""],
  });

  // Write datos en Contratos
  const { sendAsync: StakeRewards } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("Staking", "set_reward_amount", [
        toWei(Number(rewardAmount)),
      ]),
      createContractCall("Staking", "set_reward_duration", [
        toWei(Number(durationAmount)),
      ]),
    ],
  });

  const { sendAsync: Stake } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("NAI", "approve", [
        StakingContract?.address,
        toWei(Number(stakeAmount)),
      ]),
      createContractCall("Staking", "stake", [toWei(Number(stakeAmount))]),
    ],
  });

  const { sendAsync: withdrawStake } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("Staking", "withdraw", [toWei(Number(withAmount))]),
    ],
  });

  // Manejo de eventos de botones
  const handleRewardStake = async () => {
    if (!isTransactionPending && StakeRewards) {
      try {
        setTransactionPending(true);
        const result = await StakeRewards();
        console.log("Set Reward Amount & Duration - Transaction Hash:", result);
        setTransactionPending(false);
      } catch (error) {
        console.error(
          "Set Reward Amount & Duration - Transaction Hash:",
          error,
        );
        setTransactionPending(false);
      }
    }
  };

  const handleStake = async () => {
    if (!isTransactionPending && Stake) {
      try {
        setTransactionPending(true);
        const result = await Stake();
        console.log("Stake - Transaction Hash:", result);
        setTransactionPending(false);
      } catch (error) {
        console.error("Stake - Transaction Hash:", error);
        setTransactionPending(false);
      }
    }
  };

  const handleWith = async () => {
    if (!isTransactionPending && withdrawStake) {
      try {
        setTransactionPending(true);
        const result = await withdrawStake();
        console.log("Withdraw Stake - Transaction Hash:", result);
        setTransactionPending(false);
      } catch (error) {
        console.error("Withdraw Stake - Transaction Hash:", error);
        setTransactionPending(false);
      }
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="container mx-auto mt-10 px-4">
        <div className="text-center mb-8">
          <p className="text-3xl font-semibold">Staking</p>
        </div>

        {/* Contenedor para centrar los módulos */}
        <div className="flex flex-col items-center">
          {/* Balances */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-8">
            {/* STRK */}
            <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-white-900">
                  <img src={strkLogo.src} alt="STRK Icon" className="w-8 h-8" />
                  <p className="font-medium">STRK</p>
                </div>
                <p className="text-xl text-white-900">
                  {balanceSTRK
                    ? `${formatEther(Number(balanceSTRK))} STRK`
                    : "0 STRK"}
                </p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xl text-blue-400">
                  <Address address={strkContractAddress as AddressType} />
                </p>
              </div>
            </div>

            {/* NAI */}
            <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-white-900">
                  <img src={naiLogo.src} alt="NAI Icon" className="w-8 h-8" />
                  <p className="font-medium">NAI</p>
                </div>
                <p className="text-xl text-white-900">
                  {balanceNAI
                    ? `${formatEther(Number(balanceNAI))} NAI`
                    : "0 NAI"}
                </p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xl text-blue-400">
                  <Address address={naiContractAddress as AddressType} />
                </p>
              </div>
            </div>
          </div>

          {/* Staking */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-1 mb-8">
            {/* Staking Reserves */}
            <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-600">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img src={naiLogo.src} alt="USDT Icon" className="w-8 h-8" />
                  <div className="text-xl font-semibold text-white-900">
                    Staking
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                <div className="text-base text-blue-900 bg-blue-50 border border-blue-900 rounded-lg p-2 text-center font-medium shadow-sm">
                  {balanceStaking
                    ? `${formatEther(Number(balanceStaking))} STRK`
                    : "0 STRK"}
                </div>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="sm:flex-grow mb-2 sm:mb-0">
                  <label
                    htmlFor="liquidityAmount"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Stake
                  </label>
                  <input
                    type="number"
                    name="liquidityAmount"
                    id="liquidityAmount"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="block w-full sm:w-64 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter amount NAI"
                  />
                </div>
                <button
                  onClick={handleStake}
                  className="bg-blue-900 text-white py-2 px-4 rounded-md text-sm shadow-md mt-2 sm:mt-6 sm:ml-4"
                  style={{ minWidth: "130px" }}
                >
                  Stake
                </button>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="sm:flex-grow mb-2 sm:mb-0">
                  <label
                    htmlFor="liquidityAmount"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Withdraw
                  </label>
                  <input
                    type="number"
                    name="liquidityAmount"
                    id="liquidityAmount"
                    value={withAmount}
                    onChange={(e) => setWithAmount(e.target.value)}
                    className="block w-full sm:w-64 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter amount NAI"
                  />
                </div>
                <button
                  onClick={handleWith}
                  className="bg-red-900 text-white py-2 px-4 rounded-md text-sm shadow-md mt-2 sm:mt-6 sm:ml-4"
                  style={{ minWidth: "130px" }}
                >
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Starknet;
