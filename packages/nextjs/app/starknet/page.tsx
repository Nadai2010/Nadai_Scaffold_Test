"use client"
import type { NextPage } from "next";
import { useScaffoldContract } from "~~/hooks/scaffold-stark/useScaffoldContract";
import { createContractCall, useScaffoldMultiWriteContract } from "~~/hooks/scaffold-stark/useScaffoldMultiWriteContract";

import { Address } from "~~/components/scaffold-stark";
import { useAccount } from "@starknet-react/core";
import { Address as AddressType } from "@starknet-react/chains";

const Starknet: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const { data: ConstantProductAmm } = useScaffoldContract({
    contractName: "ConstantProductAmm",
  });

  const { data: contractDai } = useScaffoldContract({
    contractName: "DAI",
  });

  const { data: contractUsdt } = useScaffoldContract({
    contractName: "USDT",
  });

  const { write: MultiApprove } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall("DAI", "approve", [ConstantProductAmm?.address, 1 * 10 * 18]),
      createContractCall("USDT", "approve", [ConstantProductAmm?.address, 1 * 10 * 18]),
      createContractCall("ConstantProductAmm", "add_liquidity", [1 * 10 * 18, 1 * 10 * 18]),
    ]
  });



  const handleApproveAndAddLiquidity = () => {
    if (MultiApprove) {
      MultiApprove();
    }
  };

  return (
    <>
      <div className="flex items-center flex-col pt-10">
        <h1 className="text-4xl font-bold mb-4">Starknet</h1>
        <div className="flex justify-center items-center space-x-2">
          <p className="my-2 font-medium">Connected Address:</p>
          <Address address={connectedAddress as AddressType} />
        </div>
        <button
          onClick={handleApproveAndAddLiquidity}
          className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
        >
          Approve and Add Liquidity
        </button>
        {/* Add more UI elements as needed */}
      </div>
    </>
  );
};

export default Starknet;
