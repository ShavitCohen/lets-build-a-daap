import { Signer } from "ethers";
import React, { FC, useEffect, useState } from "react";
import { getSigner, isMetaMaskConnected, isMetamaskInstalled } from "../utils";

export interface UserLoginProps {
  onSignerReady: (signer: Signer) => void;
}

export const UserLogin: FC<UserLoginProps> = ({ onSignerReady }) => {
  const [hasMetamask, setHasMetamask] = useState<boolean>(false);
  const [metamaskConnected, setMetamaskConnected] = useState<boolean>(false);
  const [userAddress, setUserAddress] = useState<string>("");
  useEffect(() => {
    (async () => {
      const isMetamaskExtensionExists = isMetamaskInstalled();
      if (!isMetamaskExtensionExists) return;

      setHasMetamask(isMetamaskExtensionExists);
      const isConnected = await isMetaMaskConnected();
      if (!isConnected) return;
      setMetamaskConnected(isConnected);
      const signer = await getSigner();
      setUserAddress(await signer.getAddress());
      onSignerReady(signer);
    })();
  }, []);
  
  return (
    <div>
      {!hasMetamask && <div>You must install Metamask</div>}
      {hasMetamask && !metamaskConnected && (
        <div>
          <button>Connect your Metamask account</button>
        </div>
      )}
      {userAddress && <div>{userAddress}</div>}
    </div>
  );
};
