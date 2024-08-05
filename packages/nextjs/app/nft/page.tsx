"use client";

import React, { useState, useEffect } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";

interface JsonData {
  name: string;
  description: string;
  image: string;
  attributes: { trait_type: string; value: string }[];
}

const Home = () => {
  // Estados para los seis NFTs
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

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="container mx-auto mt-10 px-4">
        <div className="text-center mb-20">
          <p className="text-4xl font-bold text-white">Speedrun Stark</p>
        </div>
        <div className="flex flex-col items-center mb-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* NFT 1 */}
            <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-600 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">
                {jsonData1?.name || "Loading..."}
              </h2>
              <p className="text-lg mb-4">
                {jsonData1?.description || "Loading description..."}
              </p>
              <div className="mb-4">
                <ul className="list-none p-0 flex flex-wrap justify-center">
                  {jsonData1?.attributes.map((attr, i) => (
                    <li key={i} className="m-2">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
                        {attr.trait_type}: {attr.value}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center mb-4">
                <img
                  src={jsonData1?.image || "/placeholder.jpg"}
                  alt="NFT"
                  className="w-full max-w-xs rounded-lg shadow-md"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
              </div>
            </div>
            {/* NFT 2 */}
            <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-600 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">
                {jsonData2?.name || "Loading..."}
              </h2>
              <p className="text-lg mb-4">
                {jsonData2?.description || "Loading description..."}
              </p>
              <div className="mb-4">
                <ul className="list-none p-0 flex flex-wrap justify-center">
                  {jsonData2?.attributes.map((attr, i) => (
                    <li key={i} className="m-2">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
                        {attr.trait_type}: {attr.value}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center mb-4">
                <img
                  src={jsonData2?.image || "/placeholder.jpg"}
                  alt="NFT"
                  className="w-full max-w-xs rounded-lg shadow-md"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
              </div>
            </div>
            {/* NFT 3 */}
            <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-600 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">
                {jsonData3?.name || "Loading..."}
              </h2>
              <p className="text-lg mb-4">
                {jsonData3?.description || "Loading description..."}
              </p>
              <div className="mb-4">
                <ul className="list-none p-0 flex flex-wrap justify-center">
                  {jsonData3?.attributes.map((attr, i) => (
                    <li key={i} className="m-2">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
                        {attr.trait_type}: {attr.value}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center mb-4">
                <img
                  src={jsonData3?.image || "/placeholder.jpg"}
                  alt="NFT"
                  className="w-full max-w-xs rounded-lg shadow-md"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
              </div>
            </div>
            {/* NFT 4 */}
            <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-600 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">
                {jsonData4?.name || "Loading..."}
              </h2>
              <p className="text-lg mb-4">
                {jsonData4?.description || "Loading description..."}
              </p>
              <div className="mb-4">
                <ul className="list-none p-0 flex flex-wrap justify-center">
                  {jsonData4?.attributes.map((attr, i) => (
                    <li key={i} className="m-2">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
                        {attr.trait_type}: {attr.value}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center mb-4">
                <img
                  src={jsonData4?.image || "/placeholder.jpg"}
                  alt="NFT"
                  className="w-full max-w-xs rounded-lg shadow-md"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
              </div>
            </div>
            {/* NFT 5 */}
            <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-600 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">
                {jsonData5?.name || "Loading..."}
              </h2>
              <p className="text-lg mb-4">
                {jsonData5?.description || "Loading description..."}
              </p>
              <div className="mb-4">
                <ul className="list-none p-0 flex flex-wrap justify-center">
                  {jsonData5?.attributes.map((attr, i) => (
                    <li key={i} className="m-2">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
                        {attr.trait_type}: {attr.value}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center mb-4">
                <img
                  src={jsonData5?.image || "/placeholder.jpg"}
                  alt="NFT"
                  className="w-full max-w-xs rounded-lg shadow-md"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
              </div>
            </div>
            {/* NFT 6 */}
            <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-600 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">
                {jsonData6?.name || "Loading..."}
              </h2>
              <p className="text-lg mb-4">
                {jsonData6?.description || "Loading description..."}
              </p>
              <div className="mb-4">
                <ul className="list-none p-0 flex flex-wrap justify-center">
                  {jsonData6?.attributes.map((attr, i) => (
                    <li key={i} className="m-2">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
                        {attr.trait_type}: {attr.value}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center mb-4">
                <img
                  src={jsonData6?.image || "/placeholder.jpg"}
                  alt="NFT"
                  className="w-full max-w-xs rounded-lg shadow-md"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
