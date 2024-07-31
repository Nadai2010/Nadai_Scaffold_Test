"use client";

import type { NextPage } from "next";
import { useScaffoldContract } from "~~/hooks/scaffold-stark/useScaffoldContract";
import {
  createContractCall,
  useScaffoldMultiWriteContract,
} from "~~/hooks/scaffold-stark/useScaffoldMultiWriteContract";
import { Address } from "~~/components/scaffold-stark";
import { useAccount } from "@starknet-react/core";
import { Address as AddressType } from "@starknet-react/chains";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useState } from "react";
import { getAllContracts } from "~~/utils/scaffold-stark/contractsData";

import usdtLogo from "/public/logo-usdt.svg";
import daiLogo from "/public/logo-dai.svg";
import strkLogo from "/public/logo-starknet.svg";
import naiLogo from "/public/logo-nai.png";

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
  const [isTransactionPending, setTransactionPending] = useState(false);
  const usdtContractAddress = contractsData.USDT?.address; // Dirección del contrato USDT desde la configuración
  const daiContractAddress = contractsData.DAI?.address; // Dirección del contrato DAI desde la configuración
  const strkContractAddress = contractsData.STRK?.address; // Dirección del contrato STRK desde la configuración
  const naiContractAddress = contractsData.NAI?.address; // Dirección del contrato STRK desde la configuración
  const [liquidityAmount, setLiquidityAmount] = useState("");
  const [liquidityAmount2, setLiquidityAmount2] = useState("");
  const [liquidityAmount3, setLiquidityAmount3] = useState("");

  // Obtener contratos
  const { data: NadaiAMM } = useScaffoldContract({ contractName: "NadaiAMM" });
  const { data: ScaffoldAMM } = useScaffoldContract({
    contractName: "ScaffoldAMM",
  });
  const { data: StarknetAMM } = useScaffoldContract({
    contractName: "StarknetAMM",
  });
  const { data: contractDai } = useScaffoldContract({ contractName: "DAI" });
  const { data: contractUsdt } = useScaffoldContract({ contractName: "USDT" });
  const { data: contractNai } = useScaffoldContract({ contractName: "NAI" });
  const { data: contractStrk } = useScaffoldContract({ contractName: "STRK" });

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
  const { data: balanceReserveScaffold } = useScaffoldReadContract({
    contractName: "ScaffoldAMM",
    functionName: "get_reserves",
  });

  const { data: balanceReserveNadai } = useScaffoldReadContract({
    contractName: "NadaiAMM",
    functionName: "get_reserves",
  });

  const { data: balanceReserveStarknet } = useScaffoldReadContract({
    contractName: "StarknetAMM",
    functionName: "get_reserves",
  });

  // Swap 10 USDT for X DAI
  const { writeAsync: SwapAmmScaffoldUSDT } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("USDT", "approve", [
        ScaffoldAMM?.address,
        toWei(Number(liquidityAmount)),
      ]),
      createContractCall("ScaffoldAMM", "swap", [
        contractUsdt?.address,
        toWei(Number(liquidityAmount)),
      ]),
    ],
  });

  const { writeAsync: SwapAmmNadaiUsdt } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("USDT", "approve", [
        NadaiAMM?.address,
        toWei(Number(liquidityAmount2)),
      ]),
      createContractCall("NadaiAMM", "swap", [
        contractUsdt?.address,
        toWei(Number(liquidityAmount2)),
      ]),
    ],
  });

  const { writeAsync: SwapAmmStarknetUsdt } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("USDT", "approve", [
        StarknetAMM?.address,
        toWei(Number(liquidityAmount3)),
      ]),
      createContractCall("StarknetAMM", "swap", [
        contractUsdt?.address,
        toWei(Number(liquidityAmount3)),
      ]),
    ],
  });

  // MultiWrite Cross Swap in 3 AMM
  const { writeAsync: MultiSwapAmmScaffoldALL } = useScaffoldMultiWriteContract(
    {
      calls: [
        createContractCall("DAI", "approve", [
          ScaffoldAMM?.address,
          100000000000000000000,
        ]),
        createContractCall("USDT", "approve", [
          NadaiAMM?.address,
          100000000000000000000,
        ]),
        createContractCall("USDT", "approve", [
          StarknetAMM?.address,
          100000000000000000000,
        ]),
        createContractCall("ScaffoldAMM", "swap", [
          contractDai?.address,
          10000000000000000000,
        ]),
        createContractCall("NadaiAMM", "swap", [
          contractUsdt?.address,
          10000000000000000000,
        ]),
        createContractCall("StarknetAMM", "swap", [
          contractUsdt?.address,
          10000000000000000000,
        ]),
      ],
    },
  );

  // Manejo de eventos de botones
  const handleSwapScaffoldUSDT = async () => {
    if (!isTransactionPending && SwapAmmScaffoldUSDT) {
      try {
        setTransactionPending(true);
        const result = await SwapAmmScaffoldUSDT();
        console.log("Scaffold - USDT Transaction Hash:", result);
        setTransactionPending(false);
      } catch (error) {
        console.error("Scaffold - USDT Transaction Error:", error);
        setTransactionPending(false);
      }
    }
  };

  const handleSwapNadaiUSDT = async () => {
    if (!isTransactionPending && SwapAmmNadaiUsdt) {
      try {
        setTransactionPending(true);
        const result = await SwapAmmNadaiUsdt();
        console.log("Nadai - USDT Transaction Hash:", result);
        setTransactionPending(false);
      } catch (error) {
        console.error("Nadai - USDT Transaction Error:", error);
      } finally {
        setTransactionPending(false);
      }
    }
  };

  const handleSwapStarknetUSDT = async () => {
    if (!isTransactionPending && SwapAmmStarknetUsdt) {
      try {
        setTransactionPending(true);
        const result = await SwapAmmStarknetUsdt();
        console.log("Nadai - USDT Transaction Hash:", result);
        setTransactionPending(false);
      } catch (error) {
        console.error("Nadai - USDT Transaction Error:", error);
      } finally {
        setTransactionPending(false);
      }
    }
  };

  const handleMultiSwapAll = async () => {
    if (!isTransactionPending && MultiSwapAmmScaffoldALL) {
      try {
        setTransactionPending(true);
        const result = await MultiSwapAmmScaffoldALL();
        console.log("MultiSwap Nadai - Transaction Hash:", result);
        setTransactionPending(false);
      } catch (error) {
        console.error("MultiSwap Nadai -  Transaction Error:", error);
      } finally {
        setTransactionPending(false);
      }
    }
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="text-center mb-8">
        <p className="text-3xl font-semibold">Swap Cross-AMM</p>
      </div>

      {/* Balances */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-8">
        {/* USDT */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-blue-900">
              <img src={usdtLogo.src} alt="USDT Icon" className="w-8 h-8" />
              <p className="font-medium">USDT</p>
            </div>
            <p className="text-xl text-blue-900">
              {balanceUSDT
                ? `${formatEther(Number(balanceUSDT))} USDT`
                : "0 USDT"}
            </p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xl text-blue-900">
              <Address address={usdtContractAddress as AddressType} />
            </p>
          </div>
        </div>

        {/* DAI */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-blue-900">
              <img src={daiLogo.src} alt="DAI Icon" className="w-8 h-8" />
              <p className="font-medium">DAI</p>
            </div>
            <p className="text-xl text-blue-900">
              {balanceDAI ? `${formatEther(Number(balanceDAI))} DAI` : "0 DAI"}
            </p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xl text-blue-900">
              <Address address={daiContractAddress as AddressType} />
            </p>
          </div>
        </div>

        {/* STRK */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-blue-900">
              <img src={strkLogo.src} alt="STRK Icon" className="w-8 h-8" />
              <p className="font-medium">STRK</p>
            </div>
            <p className="text-xl text-blue-900">
              {balanceSTRK
                ? `${formatEther(Number(balanceSTRK))} STRK`
                : "0 STRK"}
            </p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xl text-blue-900">
              <Address address={strkContractAddress as AddressType} />
            </p>
          </div>
        </div>

        {/* NAI */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-blue-900">
              <img src={naiLogo.src} alt="NAI Icon" className="w-8 h-8" />
              <p className="font-medium">NAI</p>
            </div>
            <p className="text-xl text-blue-900">
              {balanceNAI ? `${formatEther(Number(balanceNAI))} NAI` : "0 NAI"}
            </p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xl text-blue-900">
              <Address address={naiContractAddress as AddressType} />
            </p>
          </div>
        </div>
      </div>

      {/* Swap AMMs */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
        {/* Scaffold Reserves */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md border border-gray-300 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img src={usdtLogo.src} alt="USDT Icon" className="w-8 h-8" />
              <img src={daiLogo.src} alt="DAI Icon" className="w-8 h-8" />
              <div className="text-xl font-semibold text-blue-900">
                Total Reserve Scaffold
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
            <div className="text-base text-blue-900 bg-blue-50 border border-blue-900 rounded-lg p-2 text-center font-medium shadow-sm">
              {balanceReserveScaffold
                ? `${formatEther(Number((balanceReserveScaffold as any)[1]))} USDT / ${formatEther(Number((balanceReserveScaffold as any)[0]))} DAI`
                : "0 USDT / 0 DAI"}
            </div>
            <div className="text-base text-blue-900 bg-blue-50 border border-blue-900 rounded-lg p-2 text-center font-medium shadow-sm">
              {balanceReserveScaffold &&
              Number((balanceReserveScaffold as any)[0]) !== 0
                ? `Ratio ${Number((balanceReserveScaffold as any)[1]) !== 0 ? (Number((balanceReserveScaffold as any)[1]) / Number((balanceReserveScaffold as any)[0])).toFixed(2) : "Indefinido"}`
                : "Ratio"}
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="sm:flex-grow mb-2 sm:mb-0">
              <label
                htmlFor="liquidityAmount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Swap USDT/DAI
              </label>
              <input
                type="number"
                name="liquidityAmount"
                id="liquidityAmount"
                value={liquidityAmount}
                onChange={(e) => setLiquidityAmount(e.target.value)}
                className="block w-full sm:w-64 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter amount USDT"
              />
            </div>
            <button
              onClick={handleSwapScaffoldUSDT}
              className="bg-blue-900 text-white py-2 px-4 rounded-md text-sm shadow-md mt-2 sm:mt-6 sm:ml-4"
              style={{ minWidth: "130px" }}
            >
              Swap
            </button>
          </div>
        </div>

        {/* Nadai Reserves */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md border border-gray-300 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img src={usdtLogo.src} alt="USDT Icon" className="w-8 h-8" />
              <img src={naiLogo.src} alt="NAI Icon" className="w-8 h-8" />
              <div className="text-xl font-semibold text-blue-900">
                Total Reserve Nadai
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
            <div className="text-base text-blue-900 bg-blue-50 border border-blue-900 rounded-lg p-2 text-center font-medium shadow-sm">
              {balanceReserveNadai
                ? `${formatEther(Number((balanceReserveNadai as any)[1]))} USDT / ${formatEther(Number((balanceReserveNadai as any)[0]))} NAI`
                : "0 USDT / 0 NAI"}
            </div>
            <div className="text-base text-blue-900 bg-blue-50 border border-blue-900 rounded-lg p-2 text-center font-medium shadow-sm">
              {balanceReserveNadai &&
              Number((balanceReserveNadai as any)[0]) !== 0
                ? `Ratio ${Number((balanceReserveNadai as any)[1]) !== 0 ? (Number((balanceReserveNadai as any)[1]) / Number((balanceReserveNadai as any)[0])).toFixed(2) : "Indefinido"}`
                : "Ratio"}
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="sm:flex-grow mb-2 sm:mb-0">
              <label
                htmlFor="liquidityAmount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Swap USDT/NAI
              </label>
              <input
                type="number"
                name="liquidityAmount"
                id="liquidityAmount"
                value={liquidityAmount2}
                onChange={(e) => setLiquidityAmount2(e.target.value)}
                className="block w-full sm:w-64 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter amount USDT"
              />
            </div>
            <button
              onClick={handleSwapNadaiUSDT}
              className="bg-blue-900 text-white py-2 px-4 rounded-md text-sm shadow-md mt-2 sm:mt-6 sm:ml-4"
              style={{ minWidth: "130px" }}
            >
              Swap
            </button>
          </div>
        </div>

        {/* Starknet Reserves */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md border border-gray-300 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img src={usdtLogo.src} alt="USDT Icon" className="w-8 h-8" />
              <img src={strkLogo.src} alt="STRK Icon" className="w-8 h-8" />
              <div className="text-xl font-semibold text-blue-900">
                Total Reserve Starknet
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
            <div className="text-base text-blue-900 bg-blue-50 border border-blue-900 rounded-lg p-2 text-center font-medium shadow-sm">
              {balanceReserveStarknet
                ? `${formatEther(Number((balanceReserveStarknet as any)[1]))} USDT / ${formatEther(Number((balanceReserveStarknet as any)[0]))} STRK`
                : "0 USDT / 0 STRK"}
            </div>
            <div className="text-base text-blue-900 bg-blue-50 border border-blue-900 rounded-lg p-2 text-center font-medium shadow-sm">
              {balanceReserveStarknet &&
              Number((balanceReserveStarknet as any)[0]) !== 0
                ? `Ratio ${Number((balanceReserveStarknet as any)[1]) !== 0 ? (Number((balanceReserveStarknet as any)[1]) / Number((balanceReserveStarknet as any)[0])).toFixed(2) : "Indefinido"}`
                : "Ratio"}
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="sm:flex-grow mb-2 sm:mb-0">
              <label
                htmlFor="liquidityAmount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Swap USDT/STRK
              </label>
              <input
                type="number"
                name="liquidityAmount"
                id="liquidityAmount"
                value={liquidityAmount3}
                onChange={(e) => setLiquidityAmount3(e.target.value)}
                className="block w-full sm:w-64 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter amount USDT"
              />
            </div>
            <button
              onClick={handleSwapStarknetUSDT}
              className="bg-blue-900 text-white py-2 px-4 rounded-md text-sm shadow-md mt-2 sm:mt-6 sm:ml-4"
              style={{ minWidth: "130px" }}
            >
              Swap
            </button>
          </div>
        </div>
      </div>

      {/* Bloque Multi Swap All AMMs  */}
      <div className="flex items-center justify-center">
        <div className="bg-gray-100 p-4 rounded-lg shadow-md border border-gray-300 mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="text-center">
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                Multi Swap in All AMMs
              </h3>
              <button
                onClick={handleMultiSwapAll}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Multi Swaps ALL - CLICK
              </button>
            </div>
          </div>
          {/* Powered by Starknet */}
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                <span className="inline-block align-middle">Powered by</span>{" "}
                <img
                  src={strkLogo.src}
                  alt="STRK Icon"
                  className="w-8 h-8 inline-block align-middle"
                />
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Starknet;
