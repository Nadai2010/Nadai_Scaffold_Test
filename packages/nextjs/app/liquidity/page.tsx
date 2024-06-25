"use client"
import { NextPage } from "next";
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

// Función para convertir valores en ether a wei
function toWei(etherValue: number) {
  return etherValue * 1e18;
}

const Starknet: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const transactor = useTransactor();
  const contractsData = getAllContracts(); // Obtén los contratos desde la configuración

  // Estados para controlar el estado de la transacción y los valores de input
  const [isTransactionPending, setTransactionPending] = useState(false);
  const [liquidityAmount, setLiquidityAmount] = useState("");
  const [liquidityAmount2, setLiquidityAmount2] = useState("");
  const [liquidityAmount3, setLiquidityAmount3] = useState("");
  const [removeAmount, setRemoveAmount] = useState("");
  const [removeAmount2, setRemoveAmount2] = useState("");
  const [removeAmount3, setRemoveAmount3] = useState("");

  const usdtContractAddress = contractsData.USDT?.address; // Dirección del contrato USDT desde la configuración
  const daiContractAddress = contractsData.DAI?.address; // Dirección del contrato DAI desde la configuración
  const strkContractAddress = contractsData.STRK?.address; // Dirección del contrato STRK desde la configuración
  const naiContractAddress = contractsData.NAI?.address; // Dirección del contrato STRK desde la configuración

  // Obtener contratos
  const { data: NadaiAMM } = useScaffoldContract({ contractName: "NadaiAMM" });
  const { data: ScaffoldAMM } = useScaffoldContract({ contractName: "ScaffoldAMM" });
  const { data: StarknetAMM } = useScaffoldContract({ contractName: "StarknetAMM" });

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
    args: [connectedAddress ?? ''],
    watch: true,
  });

  //Balance Account
  const { data: balanceScaffoldAccount } = useScaffoldReadContract({
    contractName: "ScaffoldAMM",
    functionName: "get_balance_of",
    args: [connectedAddress ?? ''],
    watch: true,
  });

  const { data: balanceNaiAccount } = useScaffoldReadContract({
    contractName: "NadaiAMM",
    functionName: 'get_balance_of',
    args: [connectedAddress ?? ''],
    watch: true,
  });

  const { data: balanceStarknetAccount } = useScaffoldReadContract({
    contractName: "StarknetAMM",
    functionName: 'get_balance_of',
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

  const { data: totalSupplyStarknet } = useScaffoldReadContract({
    contractName: "StarknetAMM",
    functionName: "get_total_supply",
    watch: true,
  });

  // Multiwrite Approve + add liquidity
  const { writeAsync: MultiApproveAmmScaffold } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("DAI", "approve", [ScaffoldAMM?.address, toWei(Number(liquidityAmount))]),
      createContractCall("USDT", "approve", [ScaffoldAMM?.address, toWei(Number(liquidityAmount))]),
      createContractCall("ScaffoldAMM", "add_liquidity", [toWei(Number(liquidityAmount)), toWei(Number(liquidityAmount))]),
    ]
  });

  const { writeAsync: MultiApproveAmmNadai } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("NAI", "approve", [NadaiAMM?.address, toWei(Number(liquidityAmount2))]),
      createContractCall("USDT", "approve", [NadaiAMM?.address, toWei(Number(liquidityAmount2))]),
      createContractCall("NadaiAMM", "add_liquidity", [toWei(Number(liquidityAmount2)), toWei(Number(liquidityAmount2))]),
    ]
  });

  const { writeAsync: MultiApproveAmmStarknet } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("STRK", "approve", [StarknetAMM?.address, toWei(Number(liquidityAmount3))]),
      createContractCall("USDT", "approve", [StarknetAMM?.address, toWei(Number(liquidityAmount3))]),
      createContractCall("StarknetAMM", "add_liquidity", [toWei(Number(liquidityAmount3)), toWei(Number(liquidityAmount3))]),
    ]
  });

  // Withdraw
  const { writeAsync: removeLiquidityScaffold } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("ScaffoldAMM", "remove_liquidity", [toWei(Number(removeAmount))]),
    ]
  });

  const { writeAsync: removeLiquidityNadai } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("NadaiAMM", "remove_liquidity", [toWei(Number(removeAmount2))]),
    ]
  });

  const { writeAsync: removeLiquidityStarknet } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("StarknetAMM", "remove_liquidity", [toWei(Number(removeAmount3))]),
    ]
  });

  // Withdraw ALL
  const { writeAsync: removeLiquidityAllAMM } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("ScaffoldAMM", "remove_liquidity", [toWei(Number(balanceScaffoldAccount))]),
      createContractCall("NadaiAMM", "remove_liquidity", [toWei(Number(balanceNaiAccount))]),
      createContractCall("StarknetAMM", "remove_liquidity", [toWei(Number(balanceStarknetAccount))]),
    ]
  });


  // Funciones para manejar las transacciones
  const handleAddLiquidityScaffold = async () => {
    if (!isTransactionPending && MultiApproveAmmScaffold) {
      try {
        setTransactionPending(true);
        const tx = async () => {
          const result = await MultiApproveAmmScaffold();
          return result as string;
        };
        const txHash = await transactor(tx);
        console.log('Add Liquidity ScaffoldAMM Transaction Hash:', txHash);
      } catch (error) {
        console.error('Add Liquidity ScaffoldAMM Transaction Error:', error);
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
        console.log('Add Liquidity NadaiAMM Transaction Hash:', txHash);
      } catch (error) {
        console.error('Add Liquidity NadaiAMM Transaction Error:', error);
      } finally {
        setTransactionPending(false);
      }
    }
  };

  const handleAddLiquidityStarknet = async () => {
    if (!isTransactionPending && MultiApproveAmmStarknet) {
      try {
        setTransactionPending(true);
        const tx = async () => {
          const result = await MultiApproveAmmStarknet();
          return result as string;
        };
        const txHash = await transactor(tx);
        console.log('Add Liquidity StraknetAMM Transaction Hash:', txHash);
      } catch (error) {
        console.error('Add Liquidity StraknetAMM Transaction Error:', error);
      } finally {
        setTransactionPending(false);
      }
    }
  };



  const handleRemoveAllLiquidityScaffoldOnly = async () => {
    if (!isTransactionPending && removeLiquidityScaffold) {
      try {
        setTransactionPending(true);
        const tx = async () => {
          const result = await removeLiquidityScaffold();
          return result as string;
        };
        const txHash = await transactor(tx);
        console.log('Remove All Liquidity ScaffoldAMM Transaction Hash:', txHash);
      } catch (error) {
        console.error('Remove All Liquidity ScaffoldAMM Transaction Error:', error);
      } finally {
        setTransactionPending(false);
      }
    }
  };

  const handleRemoveAllLiquidityNadaiOnly = async () => {
    if (!isTransactionPending && removeLiquidityNadai) {
      try {
        setTransactionPending(true);
        const tx = async () => {
          const result = await removeLiquidityNadai();
          return result as string;
        };
        const txHash = await transactor(tx);
        console.log('Remove All Liquidity NadaiAMM Transaction Hash:', txHash);
      } catch (error) {
        console.error('Remove All Liquidity NadaiAMM Transaction Error:', error);
      } finally {
        setTransactionPending(false);
      }
    }
  };

  const handleRemoveAllLiquidityStarknetOnly = async () => {
    if (!isTransactionPending && removeLiquidityStarknet) {
      try {
        setTransactionPending(true);
        const tx = async () => {
          const result = await removeLiquidityStarknet();
          return result as string;
        };
        const txHash = await transactor(tx);
        console.log('Remove All Liquidity StarknetAMM Transaction Hash:', txHash);
      } catch (error) {
        console.error('Remove All Liquidity StarknetAMM Transaction Error:', error);
      } finally {
        setTransactionPending(false);
      }
    }
  };

  // TODO //
  //
  //
  const handleRemoveLiquidityAllAMM = async () => {
    console.log("Balance Scaffold Account:", balanceScaffoldAccount);
    console.log("Balance Nai Account:", balanceNaiAccount);
    console.log("Balance Starknet Account:", balanceStarknetAccount);

    if (!isTransactionPending && removeLiquidityScaffold && removeLiquidityNadai && removeLiquidityStarknet) {
      try {
        setTransactionPending(true);

        // Función para ejecutar cada transacción de retirada de liquidez de forma secuencial
        const executeTransactions = async () => {
          try {
            const txHashScaffold = await removeLiquidityScaffold();
            console.log('Remove Liquidity ScaffoldAMM Transaction Hash:', txHashScaffold);
            const txHashNadai = await removeLiquidityNadai();
            console.log('Remove Liquidity NadaiAMM Transaction Hash:', txHashNadai);
            const txHashStarknet = await removeLiquidityStarknet();
            console.log('Remove Liquidity StarknetAMM Transaction Hash:', txHashStarknet);

            return [txHashScaffold, txHashNadai, txHashStarknet];
          } catch (error) {
            console.error('Error executing remove liquidity transactions:', error);
            throw error; // Re-lanza el error para que pueda ser capturado externamente
          }
        };

        // Ejecutar las transacciones y obtener los hashes de las transacciones
        const transactionHashes = await executeTransactions();
        console.log('All remove liquidity transactions completed successfully:', transactionHashes);
      } catch (error) {
        console.error('Error handling remove liquidity transactions:', error);
      } finally {
        setTransactionPending(false);
      }
    }
  };
  //





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

      {/* Total Supply */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src={usdtLogo.src} alt="USDT Icon" className="w-8 h-8" />
              <img src={daiLogo.src} alt="DAI Icon" className="w-8 h-8" />
              <div className="text-l font-semibold text-blue-900">
                Scaffold Total Supply
              </div>
            </div>
            <div className="text-l text-blue-900">
              {totalSupplyScaffold ? formatEther(Number(totalSupplyScaffold)) : '0'}
              &nbsp;LPS  | &nbsp;
              {balanceScaffoldAccount ? formatEther(Number(balanceScaffoldAccount)) : '0'}
              &nbsp;LPS
            </div>
          </div>
        </div>


        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src={usdtLogo.src} alt="USDT Icon" className="w-8 h-8" />
              <img src={naiLogo.src} alt="NAI Icon" className="w-8 h-8" />
              <div className="text-l font-semibold text-blue-900">
                Nadai Total Supply
              </div>
            </div>
            <div className="text-l text-blue-900">
              {totalSupplyNadai ? formatEther(Number(totalSupplyNadai)) : '0'}
              &nbsp;LPN | &nbsp;
              {balanceNaiAccount ? formatEther(Number(balanceNaiAccount)) : '0'}
              &nbsp;LPN
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src={usdtLogo.src} alt="USDT Icon" className="w-8 h-8" />
              <img src={strkLogo.src} alt="STRK Icon" className="w-8 h-8" />
              <div className="text-l font-semibold text-blue-900">
                Starknet Total Supply
              </div>
            </div>
            <div className="text-l text-blue-900">
              {totalSupplyStarknet ? formatEther(Number(totalSupplyStarknet)) : '0'}
              &nbsp;LPS | &nbsp;
              {balanceStarknetAccount ? formatEther(Number(balanceStarknetAccount)) : '0'}
              &nbsp;LPN
            </div>
          </div>
        </div>
      </div>

      {/* Add and Remove Liquidity */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Add Liquidity Scaffold */}
        <div className="bg-white p-4 rounded-lg shadow-md w-full">
          <div className="mb-4">
            <label htmlFor="liquidityAmount" className="block text-sm font-medium text-gray-700">
              Add Liquidity Amount for Scaffold AMM
            </label>
            <input
              type="number"
              name="liquidityAmount"
              id="liquidityAmount"
              value={liquidityAmount}
              onChange={(e) => setLiquidityAmount(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            onClick={handleAddLiquidityScaffold}
            className="w-full bg-blue-900 text-white py-2 px-4 rounded-md text-sm mt-2"
          >
            Add Liquidity
          </button>
          <div className="mt-4">
            <label htmlFor="removeAmount" className="block text-sm font-medium text-gray-700">
              Remove Liquidity Amount for Scaffold AMM
            </label>
            <input
              type="number"
              name="removeAmount"
              id="removeAmount"
              value={removeAmount}
              onChange={(e) => setRemoveAmount(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <button
              onClick={handleRemoveAllLiquidityScaffoldOnly}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md text-sm mt-2"
            >
              Remove Liquidity
            </button>
          </div>
        </div>

        {/* Add Liquidity Nadai */}
        <div className="bg-white p-4 rounded-lg shadow-md w-full">
          <div className="mb-4">
            <label htmlFor="liquidityAmount2" className="block text-sm font-medium text-gray-700">
              Add Liquidity Amount for Nadai AMM
            </label>
            <input
              type="number"
              name="liquidityAmount2"
              id="liquidityAmount2"
              value={liquidityAmount2}
              onChange={(e) => setLiquidityAmount2(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            onClick={handleAddLiquidityNadai}
            className="w-full bg-blue-900 text-white py-2 px-4 rounded-md text-sm mt-2"
          >
            Add Liquidity
          </button>
          <div className="mt-4">
            <label htmlFor="removeAmount2" className="block text-sm font-medium text-gray-700">
              Remove Liquidity Amount for Nadai AMM
            </label>
            <input
              type="number"
              name="removeAmount2"
              id="removeAmount2"
              value={removeAmount2}
              onChange={(e) => setRemoveAmount2(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <button
              onClick={handleRemoveAllLiquidityNadaiOnly}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md text-sm mt-2"
            >
              Remove Liquidity
            </button>
          </div>
        </div>

        {/* Add Liquidity Starknet */}
        <div className="bg-white p-4 rounded-lg shadow-md w-full">
          <div className="mb-4">
            <label htmlFor="liquidityAmount3" className="block text-sm font-medium text-gray-700">
              Add Liquidity Amount for Starknet AMM
            </label>
            <input
              type="number"
              name="liquidityAmount3"
              id="liquidityAmount3"
              value={liquidityAmount3}
              onChange={(e) => setLiquidityAmount3(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            onClick={handleAddLiquidityStarknet}
            className="w-full bg-blue-900 text-white py-2 px-4 rounded-md text-sm mt-2"
          >
            Add Liquidity
          </button>
          <div className="mt-4">
            <label htmlFor="removeAmount3" className="block text-sm font-medium text-gray-700">
              Remove Liquidity Amount for Starknet AMM
            </label>
            <input
              type="number"
              name="removeAmount3"
              id="removeAmount3"
              value={removeAmount3}
              onChange={(e) => setRemoveAmount3(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <button
              onClick={handleRemoveAllLiquidityStarknetOnly}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md text-sm mt-2"
            >
              Remove Liquidity
            </button>
          </div>
        </div>


        {/* Remove All AMMs */}
        <div>
          <h3 className="text-lg font-medium mb-2">All AMMs</h3>
          <button
            onClick={handleRemoveLiquidityAllAMM}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={isTransactionPending}
          >
            Remove Liquidity from All AMMs
          </button>
        </div>
      </div>



    </div>

  );
};

export default Starknet;


