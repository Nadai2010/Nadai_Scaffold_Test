"use client"

import React from 'react';
import { NextPage } from 'next';
import { useState } from 'react';
import { useAccount } from '@starknet-react/core';
import { Address } from '~~/components/scaffold-stark';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import { useScaffoldWriteContract } from '~~/hooks/scaffold-stark/useScaffoldWriteContract';
import { Address as AddressType } from '@starknet-react/chains';
import { useTransactor } from '~~/hooks/scaffold-stark/useTransactor';
import { getAllContracts } from '~~/utils/scaffold-stark/contractsData';

// Importa las imágenes de los logos
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

  // Leer datos de contratos
  const { data: balanceDAI } = useScaffoldReadContract({
    contractName: 'DAI',
    functionName: 'balanceOf',
    args: [connectedAddress ?? ''],
    watch: true,
  });

  const { data: balanceUSDT } = useScaffoldReadContract({
    contractName: 'USDT',
    functionName: 'balanceOf',
    args: [connectedAddress ?? ''],
    watch: true,
  });

  const { data: balanceSTRK } = useScaffoldReadContract({
    contractName: 'STRK',
    functionName: 'balanceOf',
    args: [connectedAddress ?? ''],
    watch: true,
  });

  const { data: balanceNAI } = useScaffoldReadContract({
    contractName: "NAI",
    functionName: 'balanceOf',
    args: [connectedAddress ?? ''],
    watch: true,
  });

  // Faucet
  const { writeAsync: faucetUSDT } = useScaffoldWriteContract({
    contractName: 'USDT',
    functionName: 'faucet',
    args: [connectedAddress, 100000000000000000000],
  });

  const { writeAsync: faucetDAI } = useScaffoldWriteContract({
    contractName: 'DAI',
    functionName: 'faucet',
    args: [connectedAddress, 100000000000000000000],
  });

  const { writeAsync: faucetSTRK } = useScaffoldWriteContract({
    contractName: 'STRK',
    functionName: 'faucet',
    args: [connectedAddress, 100000000000000000000],
  });

  const { writeAsync: faucetNAI } = useScaffoldWriteContract({
    contractName: 'NAI',
    functionName: 'faucet',
    args: [connectedAddress, 100000000000000000000],
  });

  // Manejo de eventos de botones
  const handleFaucetUSDT = async () => {
    if (!isTransactionPending && faucetUSDT) {
      try {
        setTransactionPending(true); // Inicia la transacción
        const result = await faucetUSDT();
        console.log('USDT Transaction Hash:', result);
        setTransactionPending(false); // Finaliza la transacción
      } catch (error) {
        console.error('USDT Transaction Error:', error);
      } finally {
        setTransactionPending(false); // Finaliza la transacción
      }
    }
  };

  const handleFaucetDAI = async () => {
    if (!isTransactionPending && faucetDAI) {
      try {
        setTransactionPending(true); // Inicia la transacción
        const result = await faucetDAI();
        console.log('DAI Transaction Hash:', result);
      } catch (error) {
        console.error('DAI Transaction Error:', error);
      } finally {
        setTransactionPending(false); // Finaliza la transacción
      }
    }
  };

  const handleFaucetSTRK = async () => {
    if (!isTransactionPending && faucetSTRK) {
      try {
        setTransactionPending(true); // Inicia la transacción
        const result = await faucetSTRK();
        console.log('STRK Transaction Hash:', result);
        setTransactionPending(false);
      } catch (error) {
        console.error('STRK Transaction Error:', error);
      } finally {
        setTransactionPending(false); // Finaliza la transacción
      }
    }
  };

  const handleFaucetNAI = async () => {
    if (!isTransactionPending && faucetNAI) {
      try {
        setTransactionPending(true); // Inicia la transacción
        const result = await faucetNAI();
        console.log('STRK Transaction Hash:', result);
      } catch (error) {
        console.error('STRK Transaction Error:', error);
      } finally {
        setTransactionPending(false); // Finaliza la transacción
      }
    }
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="text-center mb-8">
        <p className="text-3xl font-semibold">Token Portfolio</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">

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
            {/* Dirección del contrato a la izquierda */}
            <p className="text-xl text-blue-900">
              <Address address={usdtContractAddress as AddressType} />
            </p>
            {/* Botón a la derecha */}
            <button
              onClick={handleFaucetUSDT}
              disabled={isTransactionPending}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              {isTransactionPending ? 'Minting...' : 'Mint USDT'}
            </button>
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
            {/* Dirección del contrato a la izquierda */}
            <p className="text-xl text-blue-900">
              <Address address={daiContractAddress as AddressType} />
            </p>
            {/* Botón a la derecha */}
            <button
              onClick={handleFaucetDAI}
              disabled={isTransactionPending}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              {isTransactionPending ? 'Minting...' : 'Mint DAI'}
            </button>
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
            {/* Dirección del contrato a la izquierda */}
            <p className="text-xl text-blue-900">
              <Address address={strkContractAddress as AddressType} />
            </p>
            {/* Botón a la derecha */}
            <button
              onClick={handleFaucetSTRK}
              disabled={isTransactionPending}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              {isTransactionPending ? 'Minting...' : 'Mint STRK'}
            </button>
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
            {/* Dirección del contrato a la izquierda */}
            <p className="text-xl text-blue-900">
              <Address address={naiContractAddress as AddressType} />
            </p>
            {/* Botón a la derecha */}
            <button
              onClick={handleFaucetNAI}
              disabled={isTransactionPending}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              {isTransactionPending ? 'Minting...' : 'Mint NAI'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Starknet;
