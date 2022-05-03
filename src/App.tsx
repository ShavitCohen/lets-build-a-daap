import React, { useEffect, useState } from "react";
import { Contract, Signer } from "ethers";
import pokerManagerABI from "./contracts/poeker-manager-abi.json";

import "./App.css";
import { getContract } from "./utils";
import { UserLogin } from "./components/UserLogin";
import { TheGame } from "./components/TheGame";

const CONTRACT_ADDRESS = "0xF2F285CdB717c1FD35ABc2a259DA2edd45a6f700"; //Renkaby network

function App() {
  const [signer, setSigner] = useState<Signer>();
  const [contract, setContract] = useState<Contract>();

  useEffect(() => {
    (async () => {
      if (!signer) return;
      const theContract = await getContract(
        CONTRACT_ADDRESS,
        pokerManagerABI,
        signer
      );
      setContract(theContract);
    })();
  }, [signer]);

  const handleOnSignerReady = (theSigner: Signer) => {
    setSigner(theSigner);
  };

  return (
    <div className="App">
      <h1>Welcome to Poker</h1>
      <UserLogin onSignerReady={handleOnSignerReady} />
      <br />
      <br />
      {signer && contract && <TheGame signer={signer} contract={contract} />}
    </div>
  );
}

export default App;
