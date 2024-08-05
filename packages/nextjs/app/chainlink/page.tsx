"use client";

import type { NextPage } from "next";
import { useAccount } from "@starknet-react/core";

import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { getAllContracts } from "~~/utils/scaffold-stark/contractsData";

import strkLogo from "/public/logo-starknet.svg";
import btcLogo from "/public/logo-btc.png";
import linklogo from "/public/logo-link.png";
import { useScaffoldContract } from "~~/hooks/scaffold-stark/useScaffoldContract";
import { BlockNumber } from "starknet";

// Función para formatear valores en unidades menores a un formato decimal
// Función para formatear valores en unidades menores a un formato decimal y con sufijo "USD"
function formatUSD(value: string, decimals: number) {
  const intValue = parseFloat(value) / 10 ** decimals; // Convertir el valor a decimal
  return (
    intValue.toLocaleString("en-US", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }) + " USD"
  ); // Formato de localización para mostrar hasta tres decimales y añadir "USD" al final
}

const Starknet: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const contractsData = getAllContracts(); // Obtén los contratos desde la configuración

  // Obtener contratos
  const { data: ChainlinkBTC } = useScaffoldContract({
    contractName: "ChainlinkBTC",
  });

  const { data: ChainlinkLINK } = useScaffoldContract({
    contractName: "ChainlinkLINK",
  });

  const { data: ChainlinkSTRK } = useScaffoldContract({
    contractName: "ChainlinkSTRK",
  });

  // Leer datos de contratos
  const { data: priceBTC } = useScaffoldReadContract({
    contractName: "ChainlinkBTC",
    functionName: "latest_answer",
    watch: true,
    blockIdentifier: "pending" as BlockNumber,
  });

  const { data: priceLINK } = useScaffoldReadContract({
    contractName: "ChainlinkLINK",
    functionName: "latest_answer",
    watch: true,
    blockIdentifier: "pending" as BlockNumber,
  });

  const { data: priceSTRK } = useScaffoldReadContract({
    contractName: "ChainlinkSTRK",
    functionName: "latest_answer",
    watch: true,
    blockIdentifier: "pending" as BlockNumber,
  });

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="text-center mb-8">
        <p className="text-3xl font-semibold">Chainlink Price Feed</p>
      </div>

      {/* Balances */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-8">
        {/* BTC */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-blue-900">
              <img src={btcLogo.src} alt="NAI Icon" className="w-8 h-8" />
              <p className="font-medium">BTC</p>
            </div>
            <p className="text-xl text-blue-900">
              {priceBTC !== undefined
                ? formatUSD(priceBTC.toString(), 11)
                : "0.000 USD"}
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
              {priceSTRK !== undefined
                ? formatUSD(priceSTRK.toString(), 8)
                : "0.000 USD"}
            </p>
          </div>
          <div className="flex items-center justify-between mt-2"></div>
        </div>

        {/* LORDS */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-blue-900">
              <img src={linklogo.src} alt="LINK Icon" className="w-8 h-8" />
              <p className="font-medium">LINK</p>
            </div>
            <p className="text-xl text-blue-900">
              {priceLINK !== undefined
                ? formatUSD(priceLINK.toString(), 8)
                : "0.000 USD"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Starknet;
