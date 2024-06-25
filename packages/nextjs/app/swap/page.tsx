"use client"

import type { NextPage } from "next";
import { useScaffoldContract } from "~~/hooks/scaffold-stark/useScaffoldContract";
import { createContractCall, useScaffoldMultiWriteContract } from "~~/hooks/scaffold-stark/useScaffoldMultiWriteContract";
import { Address } from "~~/components/scaffold-stark";
import { useAccount } from "@starknet-react/core";
import { Address as AddressType } from "@starknet-react/chains";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useTransactor } from "~~/hooks/scaffold-stark/useTransactor";
import { useState } from "react";
import { getAllContracts } from '~~/utils/scaffold-stark/contractsData';

import usdtLogo from '/public/logo-usdt.svg';
import daiLogo from '/public/logo-dai.svg';
import strkLogo from '/public/logo-starknet.svg';
import naiLogo from '/public/logo-nai.png';

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
  const { data: StarknetAMM } = useScaffoldContract({ contractName: "StarknetAMM" });
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

    // Total 
  const { data: balanceNAI } = useScaffoldReadContract({
    contractName: "NAI",
    functionName: "balanceOf",
    args: [connectedAddress ?? ""],
    watch: true,
  });

  const { data: balanceReserveScaffold } = useScaffoldReadContract({
    contractName: "ScaffoldAMM",
    functionName: "get_reserves"
  });

  const { data: balanceReserveNadai } = useScaffoldReadContract({
    contractName: "NadaiAMM",
    functionName: "get_reserves"
  });

  const { data: balanceReserveStarknet } = useScaffoldReadContract({
    contractName: "StarknetAMM",
    functionName: "get_reserves"
  });


  // Swap 10 USDT for X DAI
  const { writeAsync: SwapAmmScaffoldUSDT } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("USDT", "approve", [ScaffoldAMM?.address, 100000000000000000000]),
      createContractCall("ScaffoldAMM", "swap", [contractUsdt?.address, 10000000000000000000]),
    ]
  });

  const { writeAsync: SwapAmmNadaiUsdt } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("USDT", "approve", [NadaiAMM?.address, 100000000000000000000]),
      createContractCall("NadaiAMM", "swap", [contractUsdt?.address, 10000000000000000000]),
    ]
  });

  const { writeAsync: MultiSwapAmmNadai } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("DAI", "approve", [NadaiAMM?.address, 100000000000000000000]),
      createContractCall("USDT", "approve", [NadaiAMM?.address, 100000000000000000000]),
      createContractCall("NadaiAMM", "swap", [contractDai?.address, 10000000000000000000]),
      createContractCall("NadaiAMM", "swap", [contractUsdt?.address, 20000000000000000000]),
      createContractCall("NadaiAMM", "swap", [contractDai?.address, 10000000000000000000]),
      createContractCall("NadaiAMM", "swap", [contractUsdt?.address, 20000000000000000000]),
    ]
  });

  const { writeAsync: MultiSwapAmmScaffold } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("DAI", "approve", [ScaffoldAMM?.address, 100000000000000000000]),
      createContractCall("USDT", "approve", [ScaffoldAMM?.address, 100000000000000000000]),
      createContractCall("ScaffoldAMM", "swap", [contractDai?.address, 10000000000000000000]),
      createContractCall("ScaffoldAMM", "swap", [contractUsdt?.address, 20000000000000000000]),
      createContractCall("ScaffoldAMM", "swap", [contractDai?.address, 10000000000000000000]),
      createContractCall("ScaffoldAMM", "swap", [contractUsdt?.address, 20000000000000000000]),
    ]
  });

  const { writeAsync: MultiSwapAmmScaffoldALL } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("DAI", "approve", [ScaffoldAMM?.address, 100000000000000000000]),
      createContractCall("USDT", "approve", [NadaiAMM?.address, 100000000000000000000]),
      createContractCall("USDT", "approve", [StarknetAMM?.address, 100000000000000000000]),
      createContractCall("ScaffoldAMM", "swap", [contractDai?.address, 10000000000000000000]),
      createContractCall("NadaiAMM", "swap", [contractUsdt?.address, 10000000000000000000]),
      createContractCall("StarknetAMM", "swap", [contractUsdt?.address, 10000000000000000000]),
    ]
  });


  // Manejo de eventos de botones
  const handleSwapScaffoldUSDT = async () => {
    if (!isTransactionPending && SwapAmmScaffoldUSDT) {
      try {
        setTransactionPending(true);
        const tx = async () => {
          const result = await SwapAmmScaffoldUSDT(); // Ejecutar la transacción
          return result as string; // Asegurar el resultado
        };
        const txHash = await transactor(tx); // Enviar transacción
        console.log("Scaffold - USDT Transaction Hash:", txHash); // Mostrar hash de la transacción
      } catch (error) {
        console.error("Scaffold - USDT Transaction Error:", error); // Manejar errores
      } finally {
        setTransactionPending(false); // Finalizar transacción
      }
    }
  };

  const handleSwapNadaiUSDT = async () => {
    if (!isTransactionPending && SwapAmmNadaiUsdt) {
      try {
        setTransactionPending(true);
        const tx = async () => {
          const result = await SwapAmmNadaiUsdt(); // Ejecutar la transacción
          return result as string; // Asegurar el resultado
        };
        const txHash = await transactor(tx); // Enviar transacción
        console.log("Nadai - USDT Transaction Hash:", txHash); // Mostrar hash de la transacción
      } catch (error) {
        console.error("Nadai - USDT Transaction Error:", error); // Manejar errores
      } finally {
        setTransactionPending(false); // Finalizar transacción
      }
    }
  };

  const handleMultiSwapScaffold = async () => {
    if (!isTransactionPending && MultiSwapAmmScaffold) {
      try {
        setTransactionPending(true);
        const tx = async () => {
          const result = await MultiSwapAmmScaffold(); return result as string; // Asegurar el resultado
        };
        const txHash = await transactor(tx); // Enviar transacción
        console.log("MultiSwap Scaffold - Transaction Hash:", txHash); // Mostrar hash de la transacción
      } catch (error) {
        console.error("MultiSwap Scaffold -  Transaction Error:", error); // Manejar errores
      } finally {
        setTransactionPending(false); // Finalizar transacción
      }
    }
  };

  const handleMultiSwapNadai = async () => {
    if (!isTransactionPending && MultiSwapAmmNadai) {
      try {
        setTransactionPending(true);
        const tx = async () => {
          const result = await MultiSwapAmmNadai(); // Ejecutar la transacción
          return result as string; // Asegurar el resultado
        };
        const txHash = await transactor(tx); // Enviar transacción
        console.log("MultiSwap Nadai - Transaction Hash:", txHash); // Mostrar hash de la transacción
      } catch (error) {
        console.error("MultiSwap Nadai -  Transaction Error:", error); // Manejar errores
      } finally {
        setTransactionPending(false); // Finalizar transacción
      }
    }
  };

  const handleMultiSwapScaffoldNadai = async () => {
    if (!isTransactionPending && MultiSwapAmmScaffoldALL) {
      try {
        setTransactionPending(true);
        const tx = async () => {
          const result = await MultiSwapAmmScaffoldALL();; // Ejecutar la transacción
          return result as string; // Asegurar el resultado
        };
        const txHash = await transactor(tx); // Enviar transacción
        console.log("MultiSwap Nadai - Transaction Hash:", txHash); // Mostrar hash de la transacción
      } catch (error) {
        console.error("MultiSwap Nadai -  Transaction Error:", error); // Manejar errores
      } finally {
        setTransactionPending(false); // Finalizar transacción
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

      {/* Swap Scaffold */}
      <div className="flex flex-wrap items-center justify-center gap-6">
        <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full max-w-md">
          <p className="text-lg font-semibold text-blue-900">Total Reserves Scaffold:</p>
          <p className="text-xl text-blue-900">
            {balanceReserveScaffold ? `${formatEther(Number((balanceReserveScaffold as any)[1]))} USDT / ${formatEther(Number((balanceReserveScaffold as any)[0]))} DAI` : "0 USDT / 0 DAI"}
          </p>
          <div className="mt-4 flex flex-col space-y-2">
            <button
              onClick={handleSwapScaffoldUSDT}
              disabled={isTransactionPending}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              {isTransactionPending ? 'Swap 10 USDT...' : 'Swap 10 USDT'}
            </button>

            <button
              onClick={handleMultiSwapScaffold}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              {isTransactionPending ? 'MultiSwap 10 USDT...' : 'MultiSwap 10 USDT'}
            </button>
          </div>
        </div>

        {/* Swap Nadai */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full max-w-md">
            <p className="text-lg font-semibold text-blue-900">Total Reserves Nadai:</p>
            <p className="text-xl text-blue-900">
              {balanceReserveNadai ? `${formatEther(Number((balanceReserveNadai as any)[1]))} USDT / ${formatEther(Number((balanceReserveNadai as any)[0]))} DAI` : "0 USDT / 0 DAI"}
            </p>
            <div className="mt-4 flex flex-col space-y-2">
              <button

                onClick={handleSwapNadaiUSDT}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
              >
                {isTransactionPending ? 'Swap 10 USDT...' : 'Swap 10 USDT'}
              </button>

              <button
                onClick={handleMultiSwapNadai}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
              >
                {isTransactionPending ? 'MultiSwap 10 USDT...' : 'MultiSwap 10 USDT'}
              </button>


            </div>
          </div>
        </div>
        <button
          onClick={handleMultiSwapScaffoldNadai}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
        >
          MultiSwap Choss AMM
        </button>

      </div>
    </div>
  );
};

export default Starknet;
