"use client"

import type { NextPage } from "next";
import { useScaffoldContract } from "~~/hooks/scaffold-stark/useScaffoldContract";
import { createContractCall, useScaffoldMultiWriteContract } from "~~/hooks/scaffold-stark/useScaffoldMultiWriteContract";
import { Address } from "~~/components/scaffold-stark";
import { useAccount } from "@starknet-react/core";
import { Address as AddressType } from "@starknet-react/chains";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useTransactor } from '~~/hooks/scaffold-stark/useTransactor';
import { getAllContracts } from '~~/utils/scaffold-stark/contractsData';

import usdtLogo from '/public/logo-usdt.svg';
import daiLogo from '/public/logo-dai.svg';
import strkLogo from '/public/logo-starknet.svg';
import naiLogo from '/public/logo-nai.png';
import { useState } from "react";

// Función para formatear valores en wei a ether
function formatEther(weiValue: number) {
  const etherValue = weiValue / 1e18;
  return etherValue.toFixed(1);
}

const Starknet: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const transactor = useTransactor();
  const contractsData = getAllContracts(); // Obtén los contratos desde la configuración

  // Estados para controlar el estado de la transacción
  const [isTransactionPending, setTransactionPending] = useState(false);
  const usdtContractAddress = contractsData.USDT?.address; // Dirección del contrato USDT desde la configuración
  const daiContractAddress = contractsData.DAI?.address; // Dirección del contrato DAI desde la configuración
  const strkContractAddress = contractsData.STRK?.address; // Dirección del contrato STRK desde la configuración
  const naiContractAddress = contractsData.NAI?.address; // Dirección del contrato STRK desde la configuración

  // Obtener contratos
  const { data: NadaiAMM } = useScaffoldContract({ contractName: "NadaiAMM" });
  const { data: ScaffoldAMM } = useScaffoldContract({ contractName: "ScaffoldAMM" });

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
    functionName: 'balanceOf',
    args: [connectedAddress ?? ''],
    watch: true,
  });

  // Total Supply
  const { data: totalSupplyScaffold } = useScaffoldReadContract({
    contractName: "ScaffoldAMM",
    functionName: "get_total_supply",
    watch: true,
  });

  const { data: totalSupplyNadai } = useScaffoldReadContract({
    contractName: "NadaiAMM",
    functionName: "get_total_supply",
    watch: true,
  });

  // Multiwrite Approve + add liquidity
  const { writeAsync: MultiApproveAmmScaffold } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("DAI", "approve", [ScaffoldAMM?.address, 100000000000000000000]),
      createContractCall("USDT", "approve", [ScaffoldAMM?.address, 100000000000000000000]),
      createContractCall("ScaffoldAMM", "add_liquidity", [100000000000000000000, 100000000000000000000]),
    ]
  });

  const { writeAsync: MultiApproveAmmNadai } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("DAI", "approve", [NadaiAMM?.address, 100000000000000000000]),
      createContractCall("USDT", "approve", [NadaiAMM?.address, 100000000000000000000]),
      createContractCall("NadaiAMM", "add_liquidity", [100000000000000000000, 100000000000000000000]),
    ]
  });

  // Withdraw
  const { writeAsync: removeLiquidityScaffold } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("ScaffoldAMM", "remove_liquidity", [100000000000000000000]),
    ]
  });

  // Withdraw
  const { writeAsync: removeLiquidityNadai } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("NadaiAMM", "remove_liquidity", [100000000000000000000]),
    ]
  });

  // Add Liquidity
  const handleAddLiquidityScaffold = async () => {
    if (!isTransactionPending && MultiApproveAmmScaffold) {
      try {
        setTransactionPending(true);
        const tx = async () => {
          const result = await MultiApproveAmmScaffold();
          return result as string;
        };
        const txHash = await transactor(tx);
        console.log('Add Liquidity Scaffold Transaction Hash:', txHash);
      } catch (error) {
        console.error('Add Liquidity Scaffold Transaction Error:', error);
      } finally {
        setTransactionPending(false);
      }
    }
  };

  const handleAddLiquidityNadai = async () => {
    if (!isTransactionPending && MultiApproveAmmNadai) {
      try {
        setTransactionPending(true);
        const tx = async () => {
          const result = await MultiApproveAmmNadai();
          return result as string;
        };
        const txHash = await transactor(tx);
        console.log('Add Liquidity Nadai Transaction Hash:', txHash);
      } catch (error) {
        console.error('Add Liquidity Nadai Transaction Error:', error);
      } finally {
        setTransactionPending(false);
      }
    }
  };


  // Remove Liquitidy 
  const handleRemoveAllLiquidityScaffold = async () => {
    if (!isTransactionPending && removeLiquidityScaffold) {
      try {
        setTransactionPending(true);
        const tx = async () => {
          const result = await removeLiquidityScaffold();
          return result as string;
        };
        const txHash = await transactor(tx);
        console.log('Remove All Liquidity Scaffold Transaction Hash:', txHash);
      } catch (error) {
        console.error('Remove All Liquidity Scaffold Transaction Error:', error);
      } finally {
        setTransactionPending(false);
      }
    }
  };

  const handleRemoveAllLiquidityNadai = async () => {
    if (!isTransactionPending && removeLiquidityNadai) {
      try {
        setTransactionPending(true);
        const tx = async () => {
          const result = await removeLiquidityNadai();
          return result as string;
        };
        const txHash = await transactor(tx);
        console.log('Remove All Liquidity Nadai Transaction Hash:', txHash);
      } catch (error) {
        console.error('Remove All Liquidity Nadai Transaction Error:', error);
      } finally {
        setTransactionPending(false);
      }
    }
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="text-center mb-8">
        <p className="text-3xl font-semibold">Liquidity</p>
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
              {balanceUSDT ? `${formatEther(Number(balanceUSDT))} USDT` : '0 USDT'}
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
              {balanceDAI ? `${formatEther(Number(balanceDAI))} DAI` : '0 DAI'}
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
              {balanceSTRK ? `${formatEther(Number(balanceSTRK))} STRK` : '0 STRK'}
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
              {balanceNAI ? `${formatEther(Number(balanceNAI))} NAI` : '0 NAI'}
            </p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xl text-blue-900">
              <Address address={naiContractAddress as AddressType} />
            </p>
          </div>
        </div>
      </div>

      {/* Liquidity */}
      <div className="flex flex-wrap items-center justify-center gap-6">
        <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full max-w-md">
          <p className="text-lg font-semibold text-blue-900">Total Supply Scaffold:</p>
          <p className="text-xl text-blue-900">
            {totalSupplyScaffold ? `${formatEther(Number(totalSupplyScaffold))} LPS` : "0 LPS"}
          </p>
          <div className="mt-4 flex flex-col space-y-2">
            <button
              onClick={handleAddLiquidityScaffold}
              disabled={isTransactionPending}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              {isTransactionPending ? 'Add Liquidity...' : 'Add 100 USDT/DAI'}
            </button>
            <button
              onClick={handleRemoveAllLiquidityScaffold}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              Remove 100 LPS
            </button>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full max-w-md">
          <p className="text-lg font-semibold text-blue-900">Total Supply Nadai:</p>
          <p className="text-xl text-blue-900">
            {totalSupplyNadai ? `${formatEther(Number(totalSupplyNadai))} LPN` : "0 LPN"}
          </p>
          <div className="mt-4 flex flex-col space-y-2">
            <button
              onClick={handleAddLiquidityNadai}
              disabled={isTransactionPending}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              {isTransactionPending ? 'Add Liquidity...' : 'Add 100 USDT/DAI'}
            </button>
            <button
              onClick={handleRemoveAllLiquidityNadai}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              Remove 100 LPN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Starknet;
