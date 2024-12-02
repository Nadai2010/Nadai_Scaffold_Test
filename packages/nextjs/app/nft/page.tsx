"use client";

import React, { useState, useEffect } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import {
  createContractCall,
  useScaffoldMultiWriteContract,
} from "~~/hooks/scaffold-stark/useScaffoldMultiWriteContract";
import { connected } from "process";
import { useAccount } from "@starknet-react/core";

interface JsonData {
  name: string;
  description: string;
  image: string;
  attributes: { trait_type: string; value: string }[];
}

const Home = () => {
  const { address: connectedAddress } = useAccount();
  const [isTransactionPending, setTransactionPending] = useState(false);
  const [transferAddress, setTransferAddress] = useState<string>("");
  const [transferAddress2, setTransferAddress2] = useState<string>("");
  const [transferAddress3, setTransferAddress3] = useState<string>("");
  const [transferAddress4, setTransferAddress4] = useState<string>("");
  const [transferAddress5, setTransferAddress5] = useState<string>("");
  const [transferAddress6, setTransferAddress6] = useState<string>("");
  const [jsonData1, setJsonData1] = useState<JsonData | null>(null);
  const [jsonData2, setJsonData2] = useState<JsonData | null>(null);
  const [jsonData3, setJsonData3] = useState<JsonData | null>(null);
  const [jsonData4, setJsonData4] = useState<JsonData | null>(null);
  const [jsonData5, setJsonData5] = useState<JsonData | null>(null);
  const [jsonData6, setJsonData6] = useState<JsonData | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Hooks para leer datos del contrato para cada NFT
  const { data: nft1 } = useScaffoldReadContract({
    contractName: "ScaffoldNFT",
    functionName: "token_uri",
    args: [1],
    watch: true,
  });

  const { data: nft2 } = useScaffoldReadContract({
    contractName: "ScaffoldNFT",
    functionName: "token_uri",
    args: [2],
    watch: true,
  });

  const { data: nft3 } = useScaffoldReadContract({
    contractName: "ScaffoldNFT",
    functionName: "token_uri",
    args: [3],
    watch: true,
  });

  const { data: nft4 } = useScaffoldReadContract({
    contractName: "ScaffoldNFT",
    functionName: "token_uri",
    args: [4],
    watch: true,
  });

  const { data: nft5 } = useScaffoldReadContract({
    contractName: "ScaffoldNFT",
    functionName: "token_uri",
    args: [5],
    watch: true,
  });

  const { data: nft6 } = useScaffoldReadContract({
    contractName: "ScaffoldNFT",
    functionName: "token_uri",
    args: [6],
    watch: true,
  });

  const { sendAsync: mintnft1 } = useScaffoldMultiWriteContract({
    calls: [createContractCall("ScaffoldNFT", "mint", [connectedAddress, 1])],
  });

  const { sendAsync: mintnft2 } = useScaffoldMultiWriteContract({
    calls: [createContractCall("ScaffoldNFT", "mint", [connectedAddress, 2])],
  });

  const { sendAsync: mintnft3 } = useScaffoldMultiWriteContract({
    calls: [createContractCall("ScaffoldNFT", "mint", [connectedAddress, 3])],
  });

  const { sendAsync: mintnft4 } = useScaffoldMultiWriteContract({
    calls: [createContractCall("ScaffoldNFT", "mint", [connectedAddress, 4])],
  });

  const { sendAsync: mintnft5 } = useScaffoldMultiWriteContract({
    calls: [createContractCall("ScaffoldNFT", "mint", [connectedAddress, 5])],
  });

  const { sendAsync: mintnft6 } = useScaffoldMultiWriteContract({
    calls: [createContractCall("ScaffoldNFT", "mint", [connectedAddress, 6])],
  });

  const { sendAsync: transfer1 } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("ScaffoldNFT", "transferFrom", [
        connectedAddress,
        transferAddress,
        1, // Cambia el tokenId de acuerdo al NFT
      ]),
    ],
  });

  const { sendAsync: transfer2 } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("ScaffoldNFT", "transferFrom", [
        connectedAddress,
        transferAddress2,
        2, // Cambia el tokenId de acuerdo al NFT
      ]),
    ],
  });

  const { sendAsync: transfer3 } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("ScaffoldNFT", "transferFrom", [
        connectedAddress,
        transferAddress3,
        3, // Cambia el tokenId de acuerdo al NFT
      ]),
    ],
  });

  const { sendAsync: transfer4 } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("ScaffoldNFT", "transferFrom", [
        connectedAddress,
        transferAddress4,
        4, // Cambia el tokenId de acuerdo al NFT
      ]),
    ],
  });

  const { sendAsync: transfer5 } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("ScaffoldNFT", "transferFrom", [
        connectedAddress,
        transferAddress5,
        5, // Cambia el tokenId de acuerdo al NFT
      ]),
    ],
  });

  const { sendAsync: transfer6 } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("ScaffoldNFT", "transferFrom", [
        connectedAddress,
        transferAddress6,
        6, // Cambia el tokenId de acuerdo al NFT
      ]),
    ],
  });

  // Función para manejar el hover en la imagen
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Efectos para obtener datos de cada NFT
  useEffect(() => {
    const fetchNFTData = async (
      nft: any,
      setJsonData: React.Dispatch<React.SetStateAction<JsonData | null>>,
    ) => {
      if (nft) {
        try {
          const cidString = nft as string;
          const response = await fetch(cidString);
          if (!response.ok) throw new Error("Failed to fetch");
          const data: JsonData = await response.json();
          setJsonData(data);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchNFTData(nft1, setJsonData1);
    fetchNFTData(nft2, setJsonData2);
    fetchNFTData(nft3, setJsonData3);
    fetchNFTData(nft4, setJsonData4);
    fetchNFTData(nft5, setJsonData5);
    fetchNFTData(nft6, setJsonData6);
  }, [nft1, nft2, nft3, nft4, nft5, nft6]);

  const handleMintNft1 = async () => {
    if (!isTransactionPending && mintnft1) {
      try {
        setTransactionPending(true);
        const result = await mintnft1();
        console.log("Stake - Transaction Hash:", result);
        setTransactionPending(false);
      } catch (error) {
        console.error("Stake - Transaction Hash:", error);
        setTransactionPending(false);
      }
    }
  };

  const handleMintNft2 = async () => {
    if (!isTransactionPending && mintnft2) {
      try {
        setTransactionPending(true);
        const result = await mintnft2();
        console.log("Stake - Transaction Hash:", result);
        setTransactionPending(false);
      } catch (error) {
        console.error("Stake - Transaction Hash:", error);
        setTransactionPending(false);
      }
    }
  };

  const handleMintNft3 = async () => {
    if (!isTransactionPending && mintnft3) {
      try {
        setTransactionPending(true);
        const result = await mintnft3();
        console.log("Stake - Transaction Hash:", result);
        setTransactionPending(false);
      } catch (error) {
        console.error("Stake - Transaction Hash:", error);
        setTransactionPending(false);
      }
    }
  };

  const handleMintNft4 = async () => {
    if (!isTransactionPending && mintnft4) {
      try {
        setTransactionPending(true);
        const result = await mintnft4();
        console.log("Stake - Transaction Hash:", result);
        setTransactionPending(false);
      } catch (error) {
        console.error("Stake - Transaction Hash:", error);
        setTransactionPending(false);
      }
    }
  };

  const handleMintNft5 = async () => {
    if (!isTransactionPending && mintnft5) {
      try {
        setTransactionPending(true);
        const result = await mintnft5();
        console.log("Stake - Transaction Hash:", result);
        setTransactionPending(false);
      } catch (error) {
        console.error("Stake - Transaction Hash:", error);
        setTransactionPending(false);
      }
    }
  };

  const handleMintNft6 = async () => {
    if (!isTransactionPending && mintnft6) {
      try {
        setTransactionPending(true);
        const result = await mintnft6();
        console.log("Stake - Transaction Hash:", result);
        setTransactionPending(false);
      } catch (error) {
        console.error("Stake - Transaction Hash:", error);
        setTransactionPending(false);
      }
    }
  };

  const handleTransfer1 = async () => {
    if (!isTransactionPending && transfer1) {
      try {
        setTransactionPending(true);
        const result = await transfer1();
        console.log("Transfer - Transaction Hash:", result);
        setTransactionPending(false);
      } catch (error) {
        console.error("Transfer - Transaction Hash:", error);
        setTransactionPending(false);
      }
    }
  };

  const handleTransfer2 = async () => {
    if (!isTransactionPending && transfer2) {
      try {
        setTransactionPending(true);
        const result = await transfer2();
        console.log("Transfer - Transaction Hash:", result);
        setTransactionPending(false);
      } catch (error) {
        console.error("Transfer - Transaction Hash:", error);
        setTransactionPending(false);
      }
    }
  };

  const handleTransfer3 = async () => {
    if (!isTransactionPending && transfer3) {
      try {
        setTransactionPending(true);
        const result = await transfer3();
        console.log("Transfer - Transaction Hash:", result);
        setTransactionPending(false);
      } catch (error) {
        console.error("Transfer - Transaction Hash:", error);
        setTransactionPending(false);
      }
    }
  };

  const handleTransfer4 = async () => {
    if (!isTransactionPending && transfer4) {
      try {
        setTransactionPending(true);
        const result = await transfer4();
        console.log("Transfer - Transaction Hash:", result);
        setTransactionPending(false);
      } catch (error) {
        console.error("Transfer - Transaction Hash:", error);
        setTransactionPending(false);
      }
    }
  };

  const handleTransfer5 = async () => {
    if (!isTransactionPending && transfer5) {
      try {
        setTransactionPending(true);
        const result = await transfer5();
        console.log("Transfer - Transaction Hash:", result);
        setTransactionPending(false);
      } catch (error) {
        console.error("Transfer - Transaction Hash:", error);
        setTransactionPending(false);
      }
    }
  };

  const handleTransfer6 = async () => {
    if (!isTransactionPending && transfer6) {
      try {
        setTransactionPending(true);
        const result = await transfer6();
        console.log("Transfer - Transaction Hash:", result);
        setTransactionPending(false);
      } catch (error) {
        console.error("Transfer - Transaction Hash:", error);
        setTransactionPending(false);
      }
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="container mx-auto mt-1">
        <div className="text-center mb-20">
          <p className="text-4xl font-bold text-white">Speedrun Stark</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 justify-center mb-10">
          {/* NFT 1 */}
          <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-600 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">
              {jsonData1?.name || "Not minted..."}
            </h2>
            <p className="text-lg mb-4 text-center">
              {jsonData1?.description || "Loading description..."}
            </p>
            <div className="flex justify-center mb-4 py-6">
              <button
                onClick={handleMintNft1}
                className="bg-red-900 text-white py-2 px-3 rounded-md text-sm shadow-md"
                style={{ minWidth: "100px" }}
              >
                Mint
              </button>
            </div>
            <div className="flex justify-center mb-4 py-5">
              <img
                src={jsonData1?.image || "/placeholder.jpg"}
                alt="NFT"
                className="w-full max-w-xs rounded-lg shadow-md"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            </div>
            <div className="mb-4 py-6">
              <ul className="list-none p-0 flex flex-wrap justify-center">
                {jsonData1?.attributes.map((attr, i) => (
                  <li key={i} className="m-1">
                    <button className="px-4 py-2 text-xs bg-blue-800 text-white rounded-lg shadow-md hover:bg-blue-400 transition">
                      {attr.trait_type}: {attr.value}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <input
              type="text"
              placeholder="Recipient Address"
              className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700 w-full max-w-xs focus:outline-none focus:border-blue-500"
              value={transferAddress}
              onChange={(e) => setTransferAddress(e.target.value)}
            />
            <button
              onClick={handleTransfer1}
              className="bg-green-700 text-white py-2 px-4 rounded-md text-sm shadow-md w-full max-w-xs mt-4"
            >
              Transfer
            </button>
          </div>
          {/* NFT 2 */}
          <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-600 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">
              {jsonData2?.name || "Not minted..."}
            </h2>
            <p className="text-lg mb-4 text-center">
              {jsonData2?.description || "Loading description..."}
            </p>
            <div className="flex justify-center mb-4 ">
              <button
                onClick={handleMintNft2}
                className="bg-red-900 text-white py-2 px-3 rounded-md text-sm shadow-md"
                style={{ minWidth: "100px" }}
              >
                Mint
              </button>
            </div>
            <div className="flex justify-center mb-4 py-10">
              <img
                src={jsonData2?.image || "/placeholder.jpg"}
                alt="NFT"
                className="w-full max-w-xs rounded-lg shadow-md"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            </div>
            <div className="mb-4">
              <ul className="list-none p-0 flex flex-wrap justify-center">
                {jsonData2?.attributes.map((attr, i) => (
                  <li key={i} className="m-1">
                    <button className="px-4 py-2 text-xs bg-blue-800 text-white rounded-lg shadow-md hover:bg-blue-400 transition">
                      {attr.trait_type}: {attr.value}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <input
              type="text"
              placeholder="Recipient Address"
              className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700 w-full max-w-xs focus:outline-none focus:border-blue-500 mt-5"
              value={transferAddress2}
              onChange={(e) => setTransferAddress2(e.target.value)}
            />
            <button
              onClick={handleTransfer2}
              className="bg-green-700 text-white py-2 px-4 rounded-md text-sm shadow-md w-full max-w-xs mt-4"
            >
              Transfer
            </button>
          </div>
          {/* NFT 3 */}
          <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-600 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">
              {jsonData3?.name || "Not minted..."}
            </h2>
            <p className="text-lg mb-4 text-center">
              {jsonData3?.description || "Loading description..."}
            </p>
            <div className="flex justify-center mb-4 py-6">
              <button
                onClick={handleMintNft3}
                className="bg-red-900 text-white py-2 px-3 rounded-md text-sm shadow-md"
                style={{ minWidth: "100px" }}
              >
                Mint
              </button>
            </div>
            <div className="flex justify-center mb-4 py-5">
              <img
                src={jsonData3?.image || "/placeholder.jpg"}
                alt="NFT"
                className="w-full max-w-xs rounded-lg shadow-md"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            </div>
            <div className="mb-4 py-3">
              <ul className="list-none p-0 flex flex-wrap justify-center">
                {jsonData3?.attributes.map((attr, i) => (
                  <li key={i} className="m-1">
                    <button className="px-4 py-2 text-xs bg-blue-800 text-white rounded-lg shadow-md hover:bg-blue-400 transition">
                      {attr.trait_type}: {attr.value}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <input
              type="text"
              placeholder="Recipient Address"
              className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700 w-full max-w-xs focus:outline-none focus:border-blue-500 mt-3"
              value={transferAddress3}
              onChange={(e) => setTransferAddress3(e.target.value)}
            />
            <button
              onClick={handleTransfer3}
              className="bg-green-700 text-white py-2 px-4 rounded-md text-sm shadow-md w-full max-w-xs mt-4"
            >
              Transfer
            </button>
          </div>
          {/* NFT 4 */}
          <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-600 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">
              {jsonData4?.name || "Not minted..."}
            </h2>
            <p className="text-lg mb-4 text-center">
              {jsonData4?.description || "Loading description..."}
            </p>
            <div className="flex justify-center mb-4 py-6">
              <button
                onClick={handleMintNft4}
                className="bg-red-900 text-white py-2 px-3 rounded-md text-sm shadow-md"
                style={{ minWidth: "100px" }}
              >
                Mint
              </button>
            </div>
            <div className="flex justify-center mb-4 py-5">
              <img
                src={jsonData4?.image || "/placeholder.jpg"}
                alt="NFT"
                className="w-full max-w-xs rounded-lg shadow-md"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            </div>
            <div className="mb-4 py-3">
              <ul className="list-none p-0 flex flex-wrap justify-center">
                {jsonData4?.attributes.map((attr, i) => (
                  <li key={i} className="m-1">
                    <button className="px-4 py-2 text-xs bg-blue-800 text-white rounded-lg shadow-md hover:bg-blue-400 transition">
                      {attr.trait_type}: {attr.value}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <input
              type="text"
              placeholder="Recipient Address"
              className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700 w-full max-w-xs focus:outline-none focus:border-blue-500 mt-3"
              value={transferAddress2}
              onChange={(e) => setTransferAddress4(e.target.value)}
            />
            <button
              onClick={handleTransfer4}
              className="bg-green-700 text-white py-2 px-4 rounded-md text-sm shadow-md w-full max-w-xs mt-4"
            >
              Transfer
            </button>
          </div>
          {/* NFT 5 */}
          <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-600 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">
              {jsonData5?.name || "Not minted..."}
            </h2>
            <p className="text-lg mb-4 text-center">
              {jsonData5?.description || "Loading description..."}
            </p>
            <div className="flex justify-center mb-4 py-5">
              <button
                onClick={handleMintNft5}
                className="bg-red-900 text-white py-2 px-3 rounded-md text-sm shadow-md"
                style={{ minWidth: "100px" }}
              >
                Mint
              </button>
            </div>
            <div className="flex justify-center mb-4 ">
              <img
                src={jsonData5?.image || "/placeholder.jpg"}
                alt="NFT"
                className="w-full max-w-xs rounded-lg shadow-md"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            </div>
            <div className="mb-4">
              <ul className="list-none p-0 flex flex-wrap justify-center">
                {jsonData5?.attributes.map((attr, i) => (
                  <li key={i} className="m-1">
                    <button className="px-4 py-2 text-xs bg-blue-800 text-white rounded-lg shadow-md hover:bg-blue-400 transition">
                      {attr.trait_type}: {attr.value}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <input
              type="text"
              placeholder="Recipient Address"
              className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700 w-full max-w-xs focus:outline-none focus:border-blue-500 mt-3"
              value={transferAddress2}
              onChange={(e) => setTransferAddress5(e.target.value)}
            />
            <button
              onClick={handleTransfer5}
              className="bg-green-700 text-white py-2 px-4 rounded-md text-sm shadow-md w-full max-w-xs mt-4"
            >
              Transfer
            </button>
          </div>
          {/* NFT 6 */}
          <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-600 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">
              {jsonData6?.name || "Not minted..."}
            </h2>
            <p className="text-lg mb-4 text-center">
              {jsonData6?.description || "Loading description..."}
            </p>
            <div className="flex justify-center mb-4 py-5">
              <button
                onClick={handleMintNft6}
                className="bg-red-900 text-white py-2 px-3 rounded-md text-sm shadow-md"
                style={{ minWidth: "100px" }}
              >
                Mint
              </button>
            </div>
            <div className="flex justify-center mb-4 ">
              <img
                src={jsonData6?.image || "/placeholder.jpg"}
                alt="NFT"
                className="w-full max-w-xs rounded-lg shadow-md"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            </div>
            <div className="mb-4 py-3">
              <ul className="list-none p-0 flex flex-wrap justify-center">
                {jsonData6?.attributes.map((attr, i) => (
                  <li key={i} className="m-1">
                    <button className="px-4 py-2 text-xs bg-blue-800 text-white rounded-lg shadow-md hover:bg-blue-400 transition">
                      {attr.trait_type}: {attr.value}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <input
              type="text"
              placeholder="Recipient Address"
              className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700 w-full max-w-xs focus:outline-none focus:border-blue-500 mt-3"
              value={transferAddress2}
              onChange={(e) => setTransferAddress6(e.target.value)}
            />
            <button
              onClick={handleTransfer6}
              className="bg-green-700 text-white py-2 px-4 rounded-md text-sm shadow-md w-full max-w-xs mt-4"
            >
              Transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
function setTransactionPending(arg0: boolean) {
  throw new Error("Function not implemented.");
}
