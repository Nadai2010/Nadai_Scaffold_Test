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

// Función para formatear valores en wei a ether
function formatEther(weiValue: number) {
  const etherValue = weiValue / 1e18;
  return etherValue.toFixed(1);
}


const Starknet: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const transactor = useTransactor();

  // Obtener contratos
  const { data: NadaiAMM } = useScaffoldContract({ contractName: "NadaiAMM" });
  const { data: ScaffoldAMM } = useScaffoldContract({ contractName: "ScaffoldAMM" });
  const { data: contractDai } = useScaffoldContract({ contractName: "DAI" });
  const { data: contractUsdt } = useScaffoldContract({ contractName: "USDT" });

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

  const { data: balanceReserveScaffold } = useScaffoldReadContract({
    contractName: "ScaffoldAMM",
    functionName: "get_reserves"
  });

  const { data: balanceReserveNadai } = useScaffoldReadContract({
    contractName: "NadaiAMM",
    functionName: "get_reserves"
  });


  // Swap 10 USDT for X DAI
  const { write: SwapAmmScaffoldUSDT } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("USDT", "approve", [ScaffoldAMM?.address, 100000000000000000000]),
      createContractCall("ScaffoldAMM", "swap", [contractUsdt?.address, 10000000000000000000]),
    ]
  });

  const { write: SwapAmmNadaiUsdt } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("USDT", "approve", [NadaiAMM?.address, 100000000000000000000]),
      createContractCall("NadaiAMM", "swap", [contractUsdt?.address, 10000000000000000000]),
    ]
  });

  const { write: MultiSwapAmmNadai } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("DAI", "approve", [NadaiAMM?.address, 100000000000000000000]),
      createContractCall("USDT", "approve", [NadaiAMM?.address, 100000000000000000000]),
      createContractCall("NadaiAMM", "swap", [contractDai?.address, 10000000000000000000]),
      createContractCall("NadaiAMM", "swap", [contractUsdt?.address, 20000000000000000000]),
      createContractCall("NadaiAMM", "swap", [contractDai?.address, 10000000000000000000]),
      createContractCall("NadaiAMM", "swap", [contractUsdt?.address, 20000000000000000000]),
    ]
  });

  const { write: MultiSwapAmmScaffold } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("DAI", "approve", [ScaffoldAMM?.address, 100000000000000000000]),
      createContractCall("USDT", "approve", [ScaffoldAMM?.address, 100000000000000000000]),
      createContractCall("ScaffoldAMM", "swap", [contractDai?.address, 10000000000000000000]),
      createContractCall("ScaffoldAMM", "swap", [contractUsdt?.address, 20000000000000000000]),
      createContractCall("ScaffoldAMM", "swap", [contractDai?.address, 10000000000000000000]),
      createContractCall("ScaffoldAMM", "swap", [contractUsdt?.address, 20000000000000000000]),
    ]
  });

  const { write: MultiSwapAmmScaffoldNadai } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("DAI", "approve", [ScaffoldAMM?.address, 100000000000000000000]),
      createContractCall("USDT", "approve", [ScaffoldAMM?.address, 100000000000000000000]),
      createContractCall("DAI", "approve", [NadaiAMM?.address, 100000000000000000000]),
      createContractCall("USDT", "approve", [NadaiAMM?.address, 100000000000000000000]),
      createContractCall("ScaffoldAMM", "swap", [contractDai?.address, 10000000000000000000]),
      createContractCall("ScaffoldAMM", "swap", [contractUsdt?.address, 20000000000000000000]),
      createContractCall("ScaffoldAMM", "swap", [contractDai?.address, 10000000000000000000]),
      createContractCall("ScaffoldAMM", "swap", [contractUsdt?.address, 20000000000000000000]),
      createContractCall("NadaiAMM", "swap", [contractDai?.address, 10000000000000000000]),
      createContractCall("NadaiAMM", "swap", [contractUsdt?.address, 20000000000000000000]),
      createContractCall("NadaiAMM", "swap", [contractDai?.address, 10000000000000000000]),
      createContractCall("NadaiAMM", "swap", [contractUsdt?.address, 20000000000000000000]),
    ]
  });


 // Estados para controlar el estado de la transacción
 const [isTransactionPending, setTransactionPending] = useState(false);


  // Manejo de eventos de botones
  const handleSwapNadaiUSDT = async () => {
    if (!isTransactionPending && SwapAmmNadaiUsdt) {
      try {
        setTransactionPending(true);
        const tx = async () => {
          const result = await SwapAmmNadaiUsdt(); // Ejecutar la transacción
          return result as unknown as string; // Asegurar el resultado
        };
        const txHash = await transactor(tx); // Enviar transacción
        console.log("USDT Transaction Hash:", txHash); // Mostrar hash de la transacción
      } catch (error) {
        console.error("USDT Transaction Error:", error); // Manejar errores
      } finally {
        setTransactionPending(false); // Finalizar transacción
      }
    }
  };

  const handleSwapScaffoldUSDT = () => {
    if (SwapAmmScaffoldUSDT) {
      SwapAmmScaffoldUSDT();
    }
  };

  const handleMultiSwapNadai = () => {
    if (MultiSwapAmmNadai) {
      MultiSwapAmmNadai();
    }
  };

  const handleMultiSwapScaffold = () => {
    if (MultiSwapAmmScaffold) {
      MultiSwapAmmScaffold();
    }
  };

  const handleMultiSwapScaffoldNadai = () => {
    if (MultiSwapAmmScaffoldNadai) {
      MultiSwapAmmScaffoldNadai();
    }
  };


  
  return (
    <div className="flex flex-col items-center pt-10 space-y-6">
      <div className="flex items-center space-x-4">
        <p className="font-medium">Connected Address:</p>
        <Address address={connectedAddress as AddressType} />
      </div>

      <div className="flex space-x-6">
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <p className="text-lg font-semibold text-blue-900">USDT Balance</p>
          <p className="text-xl text-blue-900">
            {balanceUSDT ? `${formatEther(Number(balanceUSDT))} USDT` : "0 USDT"}
          </p>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <p className="text-lg font-semibold text-blue-900">DAI Balance</p>
          <p className="text-xl text-blue-900">
            {balanceDAI ? `${formatEther(Number(balanceDAI))} DAI` : "0 DAI"}
          </p>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <p className="text-lg font-semibold text-blue-900">STARK Balance</p>
          <p className="text-xl text-blue-900">
            {balanceSTRK ? `${formatEther(Number(balanceSTRK))} STRK` : "0 STRK"}
          </p>
        </div>
      </div>

      <div className="flex space-x-6">
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <p className="text-lg font-semibold text-blue-900">Reserves Scaffold:</p>
          <p className="text-xl text-blue-900">
            {balanceReserveScaffold ? `${formatEther(Number((balanceReserveScaffold as any)[1]))} USDT / ${formatEther(Number((balanceReserveScaffold as any)[0]))} DAI` : "0 USDT / 0 DAI"}
          </p>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <p className="text-lg font-semibold text-blue-900">Reserves Nadai:</p>
          <p className="text-xl text-blue-900">
            {balanceReserveNadai ? `${formatEther(Number((balanceReserveNadai as any)[1]))} USDT / ${formatEther(Number((balanceReserveNadai as any)[0]))} DAI` : "0 USDT / 0 DAI"}
          </p>
        </div>
      </div>


      <div className="grid grid-cols-2 gap-4 mt-8 w-full max-w-md">
        

        <button
          onClick={handleSwapScaffoldUSDT}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
        >
          Swap 10 USDT Fee only 1% - Scaffold
        </button>


        <button
          onClick={handleSwapNadaiUSDT}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
        >
          Swap 10 USDT Fee only 10% - Nadai
        </button>


        <button
          onClick={handleMultiSwapScaffold}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
        >
          MultiSwap Fee only 1% - Scaffold
        </button>

        <button
          onClick={handleMultiSwapNadai}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
        >
          MultiSwap Fee only 10% - Nadai
        </button>

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
