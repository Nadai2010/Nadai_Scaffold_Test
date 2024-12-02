"use client";

import React from "react";
import { NextPage } from "next";
import { useState } from "react";
import { useAccount } from "@starknet-react/core";
import { Address } from "../app/components/scaffold-stark";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import { Address as AddressType } from "@starknet-react/chains";
import { useTransactor } from "~~/hooks/scaffold-stark/useTransactor";
import { getAllContracts } from "~~/utils/scaffold-stark/contractsData";
import { BlockNumber } from "starknet";
import usdtLogo from "../public/logo-usdt.svg";
import daiLogo from "/public/logo-dai.svg";
import strkLogo from "/public/logo-starknet.svg";
import naiLogo from "/public/logo-nai.png";
import {
  createContractCall,
  useScaffoldMultiWriteContract,
} from "~~/hooks/scaffold-stark/useScaffoldMultiWriteContract";

// Función para formatear valores en wei a ether
function formatEther(weiValue: number) {
  const etherValue = weiValue / 1e18;
  return etherValue.toFixed(2);
}

const Starknet: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const transactor = useTransactor();
  const contractsData = getAllContracts(); // Obtén los contratos desde la configuración

  const [isTransactionPending, setTransactionPending] = useState<string | null>(
    null,
  );
  const usdtContractAddress = contractsData.USDT?.address;
  const daiContractAddress = contractsData.DAI?.address;
  const strkContractAddress = contractsData.STRK?.address;
  const naiContractAddress = contractsData.NAI?.address;

  // Leer datos de contratos
  const { data: balanceDAI } = useScaffoldReadContract({
    contractName: "DAI",
    functionName: "balanceOf",
    args: [connectedAddress ?? ""],
    watch: true,
    blockIdentifier: "pending" as BlockNumber,
  });

  const { data: balanceUSDT } = useScaffoldReadContract({
    contractName: "USDT",
    functionName: "balanceOf",
    args: [connectedAddress ?? ""],
    watch: true,
    blockIdentifier: "pending" as BlockNumber,
  });

  const { data: balanceSTRK } = useScaffoldReadContract({
    contractName: "STRK",
    functionName: "balanceOf",
    args: [connectedAddress ?? ""],
    watch: true,
    blockIdentifier: "pending" as BlockNumber,
  });

  const { data: balanceNAI } = useScaffoldReadContract({
    contractName: "NAI",
    functionName: "balanceOf",
    args: [connectedAddress ?? ""],
    watch: true,
    blockIdentifier: "pending" as BlockNumber,
  });

  // Faucet
  const { sendAsync: faucetUSDT } = useScaffoldWriteContract({
    contractName: "USDT",
    functionName: "faucet",
    args: [connectedAddress, 100000000000000000000],
  });

  const { sendAsync: faucetDAI } = useScaffoldWriteContract({
    contractName: "DAI",
    functionName: "faucet",
    args: [connectedAddress, 100000000000000000000],
  });

  const { sendAsync: faucetSTRK } = useScaffoldWriteContract({
    contractName: "STRK",
    functionName: "faucet",
    args: [connectedAddress, 100000000000000000000],
  });

  const { sendAsync: faucetNAI } = useScaffoldWriteContract({
    contractName: "NAI",
    functionName: "faucet",
    args: [connectedAddress, 100000000000000000000],
  });

  const { sendAsync: faucetALL } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("USDT", "faucet", [
        connectedAddress,
        1000000000000000000000,
      ]),
      createContractCall("DAI", "faucet", [
        connectedAddress,
        1000000000000000000000,
      ]),
      createContractCall("STRK", "faucet", [
        connectedAddress,
        1000000000000000000000,
      ]),
      createContractCall("NAI", "faucet", [
        connectedAddress,
        1000000000000000000000,
      ]),
    ],
  });

  const handleFaucet = async (token: string, faucet: any) => {
    if (isTransactionPending !== token && faucet) {
      try {
        setTransactionPending(token);
        const result = await faucet();
        console.log(`${token} Transaction Hash:`, result);
      } catch (error) {
        console.error(`${token} Transaction Error:`, error);
      } finally {
        setTransactionPending(null);
      }
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="container mx-auto mt-10 px-4">
        <div className="text-center mb-20">
          <p className="text-4xl font-bold text-white">Token Portfolio</p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {[
            {
              logo: usdtLogo,
              name: "USDT",
              balance: balanceUSDT,
              address: usdtContractAddress,
              faucet: faucetUSDT,
            },
            {
              logo: daiLogo,
              name: "DAI",
              balance: balanceDAI,
              address: daiContractAddress,
              faucet: faucetDAI,
            },
            {
              logo: strkLogo,
              name: "STRK",
              balance: balanceSTRK,
              address: strkContractAddress,
              faucet: faucetSTRK,
            },
            {
              logo: naiLogo,
              name: "NAI",
              balance: balanceNAI,
              address: naiContractAddress,
              faucet: faucetNAI,
            },
          ].map((token, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-600"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={token.logo.src}
                    alt={`${token.name} Icon`}
                    className="w-12 h-12 object-contain"
                  />
                  <p className="text-lg font-semibold">{token.name}</p>
                </div>
                <p className="text-lg font-semibold">
                  {token.balance
                    ? `${formatEther(Number(token.balance))} ${token.name}`
                    : `0 ${token.name}`}
                </p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-blue-400">
                  {token.address ? (
                    <Address address={token.address as AddressType} />
                  ) : (
                    "N/A"
                  )}
                </p>
                <button
                  onClick={() => handleFaucet(token.name, token.faucet)}
                  disabled={isTransactionPending === token.name}
                  className={`px-4 py-2 font-semibold rounded-lg shadow-md transition-colors ${isTransactionPending === token.name ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"} text-white`}
                >
                  {isTransactionPending === token.name
                    ? "Minting..."
                    : `Mint ${token.name}`}
                </button>
              </div>
            </div>
          ))}

          <div className="relative flex justify-center items-center md:col-span-2 lg:col-span-4 my-12">
            <button
              onClick={() => handleFaucet("ALL", faucetALL)}
              disabled={isTransactionPending !== null}
              className={`relative w-60 h-60 rounded-full flex items-center justify-center bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white overflow-hidden ${isTransactionPending !== null ? "cursor-wait" : ""}`}
            >
              <div
                className={`absolute inset-0 flex items-center justify-center ${isTransactionPending === "ALL" ? "animate-spin" : ""}`}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute w-full h-full flex items-center justify-center">
                    <img
                      src={usdtLogo.src}
                      alt="USDT Icon"
                      className="w-12 h-12 absolute"
                      style={{ top: "15%", left: "15%" }}
                    />
                    <img
                      src={daiLogo.src}
                      alt="DAI Icon"
                      className="w-12 h-12 absolute"
                      style={{ top: "15%", right: "15%" }}
                    />
                    <img
                      src={strkLogo.src}
                      alt="STRK Icon"
                      className="w-12 h-12 absolute"
                      style={{ bottom: "15%", left: "15%" }}
                    />
                    <img
                      src={naiLogo.src}
                      alt="NAI Icon"
                      className="w-12 h-12 absolute"
                      style={{ bottom: "15%", right: "15%" }}
                    />
                  </div>
                </div>
              </div>
              <span className="font-semibold relative z-10">
                Mint All Tokens
              </span>
              <div
                className="absolute inset-0 rounded-full border-0 border-transparent bg-gradient-to-br from-blue-600 to-purple-600"
                style={{
                  maskImage:
                    "linear-gradient(to right, rgba(0,0,0,0) 10%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 90%)",
                }}
              ></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Starknet;
