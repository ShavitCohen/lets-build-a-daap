import { Contract, ContractInterface, ethers, Signer } from "ethers";

const getProvider = () => {
  return new ethers.providers.Web3Provider((window as any).ethereum);
};

export const isMetamaskInstalled = () => {
  return !!(window as any).ethereum;
};

export const getSigner = async () => {
  const provider = getProvider();
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
};

export const isMetaMaskConnected = async () => {
  const provider = getProvider();
  const accounts = await provider.listAccounts();
  return accounts.length > 0;
};

export const getContract = async (
  address: string,
  abi: ContractInterface,
  signer: Signer
) => {
  return new Contract(address, abi, signer);
};
