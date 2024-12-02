"use client";
import { NextPage } from "next";
import { useScaffoldContract } from "~~/hooks/scaffold-stark/useScaffoldContract";
import {
  createContractCall,
  useScaffoldMultiWriteContract,
} from "~~/hooks/scaffold-stark/useScaffoldMultiWriteContract";
import { Address } from "../components/scaffold-stark";
import { useAccount } from "@starknet-react/core";
import { Address as AddressType } from "@starknet-react/chains";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { getAllContracts } from "~~/utils/scaffold-stark/contractsData";

import usdtLogo from "/public/logo-usdt.svg";
import daiLogo from "/public/logo-dai.svg";
import strkLogo from "/public/logo-starknet.svg";
import naiLogo from "/public/logo-nai.png";
import { useEffect, useState } from "react";
import { parseEther } from "ethers";
import { BlockNumber } from "starknet";

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

  // Estados para controlar el estado de la transacción y los valores de input
  const [isTransactionPending, setTransactionPending] = useState(false);
  const [liquidityAmount, setLiquidityAmount] = useState("");
  const [liquidityAmount2, setLiquidityAmount2] = useState("");
  const [liquidityAmount3, setLiquidityAmount3] = useState("");
  const [removeAmount, setRemoveAmount] = useState("");
  const [removeAmount2, setRemoveAmount2] = useState("");
  const [removeAmount3, setRemoveAmount3] = useState("");
  const [balanceScaffoldAccount, setBalanceScaffoldAccount] =
    useState<string>("");
  const [balanceNaiAccount, setBalanceNaiAccount] = useState<string>("");
  const [balanceStarknetAccount, setBalanceStarknetAccount] =
    useState<string>("");

  const usdtContractAddress = contractsData.USDT?.address; // Dirección del contrato USDT desde la configuración
  const daiContractAddress = contractsData.DAI?.address; // Dirección del contrato DAI desde la configuración
  const strkContractAddress = contractsData.STRK?.address; // Dirección del contrato STRK desde la configuración
  const naiContractAddress = contractsData.NAI?.address; // Dirección del contrato STRK desde la configuración

  // Obtener contratos
  const { data: NadaiAMM } = useScaffoldContract({ contractName: "NadaiAMM" });
  const { data: ScaffoldAMM } = useScaffoldContract({
    contractName: "ScaffoldAMM",
  });
  const { data: StarknetAMM } = useScaffoldContract({
    contractName: "StarknetAMM",
  });

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

  //Balance Account
  const { data: scaffoldAccountData } = useScaffoldReadContract({
    contractName: "ScaffoldAMM",
    functionName: "get_balance_of",
    args: [connectedAddress ?? ""],
    watch: true,
    blockIdentifier: "pending" as BlockNumber,
  });

  const { data: naiAccountData } = useScaffoldReadContract({
    contractName: "NadaiAMM",
    functionName: "get_balance_of",
    args: [connectedAddress ?? ""],
    watch: true,
    blockIdentifier: "pending" as BlockNumber,
  });

  const { data: starknetAccountData } = useScaffoldReadContract({
    contractName: "StarknetAMM",
    functionName: "get_balance_of",
    args: [connectedAddress ?? ""],
    watch: true,
    blockIdentifier: "pending" as BlockNumber,
  });

  useEffect(() => {
    if (scaffoldAccountData !== undefined) {
      setBalanceScaffoldAccount(scaffoldAccountData.toString());
    } else {
      setBalanceScaffoldAccount("");
    }

    if (naiAccountData !== undefined) {
      setBalanceNaiAccount(naiAccountData.toString());
    } else {
      setBalanceNaiAccount("");
    }

    if (starknetAccountData !== undefined) {
      setBalanceStarknetAccount(starknetAccountData.toString());
    } else {
      setBalanceStarknetAccount("");
    }
  }, [scaffoldAccountData, naiAccountData, starknetAccountData]);

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

  const { data: amount1 } = useScaffoldReadContract({
    contractName: "ScaffoldAMM",
    functionName: "get_amount1_out",
    args: [
      liquidityAmount
        ? (parseEther(liquidityAmount).toString() as any)
        : ("0" as any),
    ],
  });

  const { data: amount2 } = useScaffoldReadContract({
    contractName: "NadaiAMM",
    functionName: "get_amount1_out",
    args: [
      liquidityAmount2
        ? (parseEther(liquidityAmount2).toString() as any)
        : ("0" as any),
    ],
  });

  const { data: amount3 } = useScaffoldReadContract({
    contractName: "StarknetAMM",
    functionName: "get_amount1_out",
    args: [
      liquidityAmount3
        ? (parseEther(liquidityAmount3).toString() as any)
        : ("0" as any),
    ],
  });

  // Multiwrite Approve + add liquidity
  const { sendAsync: MultiApproveAmmScaffold } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("DAI", "approve", [
        ScaffoldAMM?.address,
        toWei(Number(liquidityAmount)),
      ]),
      createContractCall("USDT", "approve", [
        ScaffoldAMM?.address,
        amount1 as any,
      ]),
      createContractCall("ScaffoldAMM", "add_liquidity", [
        toWei(Number(liquidityAmount)),
        amount1 as any,
      ]),
    ],
  });
  const { sendAsync: MultiApproveAmmNadai } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("NAI", "approve", [
        NadaiAMM?.address,
        toWei(Number(liquidityAmount2)),
      ]),
      createContractCall("USDT", "approve", [
        NadaiAMM?.address,
        amount2 as any,
      ]),
      createContractCall("NadaiAMM", "add_liquidity", [
        toWei(Number(liquidityAmount2)),
        amount2 as any,
      ]),
    ],
  });

  const { sendAsync: MultiApproveAmmStarknet } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("STRK", "approve", [
        StarknetAMM?.address,
        toWei(Number(liquidityAmount3)),
      ]),
      createContractCall("USDT", "approve", [
        StarknetAMM?.address,
        amount3 as any,
      ]),
      createContractCall("StarknetAMM", "add_liquidity", [
        toWei(Number(liquidityAmount3)),
        amount3 as any,
      ]),
    ],
  });

  // Withdraw
  const { sendAsync: removeLiquidityScaffold } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("ScaffoldAMM", "remove_liquidity", [
        toWei(Number(removeAmount)),
      ]),
    ],
  });

  const { sendAsync: removeLiquidityNadai } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("NadaiAMM", "remove_liquidity", [
        toWei(Number(removeAmount2)),
      ]),
    ],
  });

  const { sendAsync: removeLiquidityStarknet } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("StarknetAMM", "remove_liquidity", [
        toWei(Number(removeAmount3)),
      ]),
    ],
  });

  // Withdraw ALL
  const { sendAsync: removeLiquidityAllAMM } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("ScaffoldAMM", "remove_liquidity", [
        Number(balanceScaffoldAccount),
      ]), // Convertir a número si es necesario
      createContractCall("NadaiAMM", "remove_liquidity", [
        Number(balanceNaiAccount),
      ]), // Convertir a número si es necesario
      createContractCall("StarknetAMM", "remove_liquidity", [
        Number(balanceStarknetAccount),
      ]), // Convertir a número si es necesario
    ],
  });

  // Funciones para manejar las transacciones
  const handleAddLiquidityScaffold = async () => {
    if (!isTransactionPending && MultiApproveAmmScaffold) {
      try {
        setTransactionPending(true);
        const result = await MultiApproveAmmScaffold();
        console.log("Add Liquidity ScaffoldAMM Transaction Hash:", result);
        setTransactionPending(false);
      } catch (error) {
        console.error("Add Liquidity ScaffoldAMM Transaction Error:", error);
      } finally {
        setTransactionPending(false);
      }
    }
  };

  const handleAddLiquidityNadai = async () => {
    if (!isTransactionPending && MultiApproveAmmNadai) {
      try {
        setTransactionPending(true);
        const result = await MultiApproveAmmNadai();
        console.log("Add Liquidity NadaiAMM Transaction Hash:", result);
        setTransactionPending(false);
      } catch (error) {
        console.error("Add Liquidity NadaiAMM Transaction Error:", error);
      } finally {
        setTransactionPending(false);
      }
    }
  };

  const handleAddLiquidityStarknet = async () => {
    if (!isTransactionPending && MultiApproveAmmStarknet) {
      try {
        setTransactionPending(true);
        const result = await MultiApproveAmmStarknet();
        console.log("Add Liquidity StraknetAMM Transaction Hash:", result);
        setTransactionPending(false);
      } catch (error) {
        console.error("Add Liquidity StraknetAMM Transaction Error:", error);
      } finally {
        setTransactionPending(false);
      }
    }
  };

  const handleRemoveAllLiquidityScaffoldOnly = async () => {
    if (!isTransactionPending && removeLiquidityScaffold) {
      try {
        setTransactionPending(true);
        const result = await removeLiquidityScaffold();
        console.log(
          "Remove All Liquidity ScaffoldAMM Transaction Hash:",
          result,
        );
        setTransactionPending(false);
      } catch (error) {
        console.error(
          "Remove All Liquidity ScaffoldAMM Transaction Error:",
          error,
        );
      } finally {
        setTransactionPending(false);
      }
    }
  };

  const handleRemoveAllLiquidityNadaiOnly = async () => {
    if (!isTransactionPending && removeLiquidityNadai) {
      try {
        setTransactionPending(true);
        const result = await removeLiquidityNadai();
        console.log("Remove All Liquidity NadaiAMM Transaction Hash:", result);
        setTransactionPending(false);
      } catch (error) {
        console.error(
          "Remove All Liquidity NadaiAMM Transaction Error:",
          error,
        );
      } finally {
        setTransactionPending(false);
      }
    }
  };

  const handleRemoveAllLiquidityStarknetOnly = async () => {
    if (!isTransactionPending && removeLiquidityStarknet) {
      try {
        setTransactionPending(true);
        const result = await removeLiquidityStarknet();
        console.log(
          "Remove All Liquidity StarknetAMM Transaction Result:",
          result,
        );

        setTransactionPending(false);
      } catch (error) {
        console.error(
          "Remove All Liquidity StarknetAMM Transaction Error:",
          error,
        );
        setTransactionPending(false);
      }
    }
  };

  // Remove ALL Liquidity 3 AMM
  const handleRemoveLiquidityAllAMM = async () => {
    console.log("Balance Scaffold Account:", balanceScaffoldAccount);
    console.log("Balance Nai Account:", balanceNaiAccount);
    console.log("Balance Starknet Account:", balanceStarknetAccount);

    if (!isTransactionPending && removeLiquidityAllAMM) {
      try {
        setTransactionPending(true);

        const executeTransactions = async () => {
          try {
            const txHashAll = await removeLiquidityAllAMM();
            console.log(
              "Remove Liquidity ScaffoldAMM Transaction Hash:",
              txHashAll,
            );
            return [txHashAll];
          } catch (error) {
            console.error(
              "Error executing remove liquidity transactions:",
              error,
            );
            throw error;
          }
        };

        const transactionHashes = await executeTransactions();
        console.log(
          "All remove liquidity transactions completed successfully:",
          transactionHashes,
        );
      } catch (error) {
        console.error("Error handling remove liquidity transactions:", error);
      } finally {
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
          <p className="text-3xl font-semibold">Liquidity</p>
        </div>

        {/* Balances */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-8">
          {/* USDT */}
          <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-white-900">
                <img src={usdtLogo.src} alt="USDT Icon" className="w-8 h-8" />
                <p className="font-medium">USDT</p>
              </div>
              <p className="text-xl text-white-900">
                {balanceUSDT
                  ? `${formatEther(Number(balanceUSDT))} USDT`
                  : "0 USDT"}
              </p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xl text-blue-400">
                <Address address={usdtContractAddress as AddressType} />
              </p>
            </div>
          </div>

          {/* DAI */}
          <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-white-900">
                <img src={daiLogo.src} alt="DAI Icon" className="w-8 h-8" />
                <p className="font-medium">DAI</p>
              </div>
              <p className="text-xl text-white-900">
                {balanceDAI
                  ? `${formatEther(Number(balanceDAI))} DAI`
                  : "0 DAI"}
              </p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xl text-blue-400">
                <Address address={daiContractAddress as AddressType} />
              </p>
            </div>
          </div>

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

        {/* Total Supply */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
          {/* Scaffold Add and Remove Liquidity */}
          <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img src={usdtLogo.src} alt="USDT Icon" className="w-8 h-8" />
                <img src={daiLogo.src} alt="DAI Icon" className="w-8 h-8" />
                <div className="text-l font-semibold text-white-900">
                  Scaffold Total Supply
                </div>
              </div>
              <div className="text-sm text-blue-900 bg-blue-50 border border-blue-900 rounded-lg p-2 text-center font-small shadow-sm">
                {totalSupplyScaffold
                  ? formatEther(Number(totalSupplyScaffold))
                  : "0"}
                &nbsp;LPS | &nbsp;
                {balanceScaffoldAccount
                  ? formatEther(Number(balanceScaffoldAccount))
                  : "0"}
                &nbsp;LPS
              </div>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="sm:flex-grow mb-2 sm:mb-0">
                <label
                  htmlFor="liquidityAmount"
                  className="block text-sm font-medium text-gray-500 mb-2"
                >
                  Add Liquidity for Scaffold AMM
                </label>
                <input
                  type="number"
                  name="liquidityAmount"
                  id="liquidityAmount"
                  value={liquidityAmount}
                  onChange={(e) => setLiquidityAmount(e.target.value)}
                  className="block w-full sm:w-64 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter amount"
                />
              </div>
              <button
                onClick={handleAddLiquidityScaffold}
                className="bg-blue-900 text-white py-2 px-3 rounded-md text-sm shadow-md mt-2 sm:mt-6 sm:ml-2"
                style={{ minWidth: "130px" }}
              >
                Add Liquidity
              </button>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="sm:flex-grow">
                <label
                  htmlFor="removeAmount"
                  className="block text-sm font-medium text-gray-500 mb-2"
                >
                  Remove Liquidity for Scaffold AMM
                </label>
                <input
                  type="number"
                  name="removeAmount"
                  id="removeAmount"
                  value={removeAmount}
                  onChange={(e) => setRemoveAmount(e.target.value)}
                  className="block w-full sm:w-64 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter amount"
                />
              </div>
              <button
                onClick={handleRemoveAllLiquidityScaffoldOnly}
                className="bg-red-600 text-white py-2 px-3 rounded-md text-sm shadow-md mt-2 sm:mt-6 sm:ml-2"
                style={{ minWidth: "130px" }}
              >
                Remove Liquidity
              </button>
            </div>
          </div>

          {/* Nadai Add and Remove Liquidity */}
          <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img src={usdtLogo.src} alt="USDT Icon" className="w-8 h-8" />
                <img src={naiLogo.src} alt="NAI Icon" className="w-8 h-8" />
                <div className="text-md font-semibold text-white-900">
                  Nadai Total Supply
                </div>
              </div>
              <div className="text-sm text-blue-900 bg-blue-50 border border-blue-900 rounded-lg p-2 text-center font-small shadow-sm">
                {totalSupplyNadai ? formatEther(Number(totalSupplyNadai)) : "0"}
                &nbsp;LPN | &nbsp;
                {balanceNaiAccount
                  ? formatEther(Number(balanceNaiAccount))
                  : "0"}
                &nbsp;LPN
              </div>
            </div>

            {/* Add Liquidity Nadai */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="sm:flex-grow">
                <label
                  htmlFor="liquidityAmount2"
                  className="block text-sm font-medium text-gray-500 mb-2"
                >
                  Add Liquidity Amount for Nadai AMM
                </label>
                <input
                  type="number"
                  name="liquidityAmount2"
                  id="liquidityAmount2"
                  value={liquidityAmount2}
                  onChange={(e) => setLiquidityAmount2(e.target.value)}
                  className="block w-full sm:w-64 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter amount"
                />
              </div>
              <button
                onClick={handleAddLiquidityNadai}
                className="bg-blue-900 text-white py-2 px-3 rounded-md text-sm shadow-md mt-2 sm:mt-6 sm:ml-2"
                style={{ minWidth: "130px" }}
              >
                Add Liquidity
              </button>
            </div>

            {/* Remove Liquidity Nadai */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="sm:flex-grow">
                <label
                  htmlFor="removeAmount2"
                  className="block text-sm font-medium text-gray-500 mb-2"
                >
                  Remove Liquidity Amount for Nadai AMM
                </label>
                <input
                  type="number"
                  name="removeAmount2"
                  id="removeAmount2"
                  value={removeAmount2}
                  onChange={(e) => setRemoveAmount2(e.target.value)}
                  className="block w-full sm:w-64 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter amount"
                />
              </div>
              <button
                onClick={handleRemoveAllLiquidityNadaiOnly}
                className="bg-red-600 text-white py-2 px-3 rounded-md text-sm shadow-md mt-2 sm:mt-6 sm:ml-2"
                style={{ minWidth: "130px" }}
              >
                Remove Liquidity
              </button>
            </div>
          </div>

          {/* Starknet Add and Remove Liquidit */}
          <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img src={usdtLogo.src} alt="USDT Icon" className="w-8 h-8" />
                <img src={strkLogo.src} alt="STRK Icon" className="w-8 h-8" />
                <div className="text-md font-semibold text-white-900">
                  Starknet Total Supply
                </div>
              </div>
              <div className="text-sm text-blue-900 bg-blue-50 border border-blue-900 rounded-lg p-2 text-center font-small shadow-sm">
                {totalSupplyStarknet
                  ? formatEther(Number(totalSupplyStarknet))
                  : "0"}
                &nbsp;LPS | &nbsp;
                {balanceStarknetAccount
                  ? formatEther(Number(balanceStarknetAccount))
                  : "0"}
                &nbsp;LPN
              </div>
            </div>

            {/* Add Liquidity Starknet */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="sm:flex-grow">
                <label
                  htmlFor="liquidityAmount3"
                  className="block text-sm font-medium text-gray-500 mb-2"
                >
                  Add Liquidity for Starknet AMM
                </label>
                <input
                  type="number"
                  name="liquidityAmount3"
                  id="liquidityAmount3"
                  value={liquidityAmount3}
                  onChange={(e) => setLiquidityAmount3(e.target.value)}
                  className="block w-full sm:w-64 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter amount"
                />
              </div>
              <button
                onClick={handleAddLiquidityStarknet}
                className="bg-blue-900 text-white py-2 px-3 rounded-md text-sm shadow-md mt-2 sm:mt-6 sm:ml-2"
                style={{ minWidth: "130px" }}
              >
                Add Liquidity
              </button>
            </div>

            {/* Remove Liquidity Starknet */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="sm:flex-grow">
                <label
                  htmlFor="removeAmount3"
                  className="block text-sm font-medium text-gray-500 mb-2"
                >
                  Remove Liquidity for Starknet AMM
                </label>
                <input
                  type="number"
                  name="removeAmount3"
                  id="removeAmount3"
                  value={removeAmount3}
                  onChange={(e) => setRemoveAmount3(e.target.value)}
                  className="block w-full sm:w-64 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter amount"
                />
              </div>
              <button
                onClick={handleRemoveAllLiquidityStarknetOnly}
                className="bg-red-600 text-white py-2 px-3 rounded-md text-sm shadow-md mt-2 sm:mt-6 sm:ml-2"
              >
                Remove Liquidity
              </button>
            </div>
          </div>
        </div>

        {/* Bloque Multi Remove All AMMs */}
        <div className="flex items-center justify-center">
          <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-600">
            <div className="flex items-center justify-center mb-4">
              <div className="text-center">
                <h3 className="text-lg font-medium text-white-900 mb-2">
                  Multi Remove LPs in All AMMs
                </h3>
                <button
                  onClick={handleRemoveLiquidityAllAMM}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Multi Remove ALL - CLICK
                </button>
              </div>
            </div>
            {/* Powered by Starknet */}
            <div className="flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-medium text-blue-00 mb-2">
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
    </div>
  );
};

export default Starknet;
