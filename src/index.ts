import './styles.css';
import { ethers } from 'ethers';

function getEth() {
  const eth = window.ethereum;
  if (!eth) {
    throw new Error('No ethereum found. Get metamask');
  }
  return eth;
}

async function hasAccounts() {
  const ethereum = getEth();
  const accounts = (await ethereum.request({
    method: 'eth_accounts',
  })) as string[];
  return accounts && accounts.length;
}

async function requestAccounts() {
  const ethereum = getEth();
  const accounts = (await ethereum.request({
    method: 'eth_requestAccounts',
  })) as string[];
  return accounts && accounts.length;
}

async function getContractWithSanityChecks(
  contract: string | undefined,
): Promise<string> {
  if (!contract) {
    throw new Error('Missing contract address');
  }

  if (!(await hasAccounts()) && !(await requestAccounts())) {
    throw new Error('No accounts available');
  }

  return contract;
}
