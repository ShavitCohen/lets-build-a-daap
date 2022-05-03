import React, { FC, useEffect, useRef, useState } from "react";
import { Contract, ethers, Signer } from "ethers";

export interface TheGameProps {
  contract: Contract;
  signer: Signer;
}

export const TheGame: FC<TheGameProps> = ({ contract, signer }) => {
  const winnerInputRef = useRef();
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [gameBalance, setGameBalance] = useState<string>("0 ETH");
  const [numberOfPlayers, setNumberOfPlayers] = useState<number>(0);

  const handleSendMoneyToTheWinner = async () => {
    try {
      const winner = (
        document.querySelector("#winnerAddressInput") as HTMLInputElement
      ).value;
      await contract.sendMoneyToTheWinner(winner);
      alert("the game is over");
    } catch (ex) {
      alert((ex as any).error.message);
    }
  };

  useEffect(() => {
    const getDataFromContract = async () => {
      //Get game amount
      const amount = (await contract.gameBalance()).toString();
      setGameBalance(ethers.utils.formatUnits(amount, "ether"));

      // Is the user is the owner
      const owner = await contract.owner();
      const myAddress = await signer.getAddress();
      setIsOwner(owner === myAddress);

      //get number of players
      const theNumberOfPlayers = (
        await contract.getNumberOfPlayers()
      ).toString();
      setNumberOfPlayers(Number(theNumberOfPlayers));
    };

    getDataFromContract();

    contract.on("NewPlayer", async (playerAddress, msg) => {
      await getDataFromContract();
      console.log(msg);
    });
  }, []);

  const handleRegisterAsAPlayer = async () => {
    try {
      await contract?.registerToTheGame({
        value: ethers.utils.parseEther("0.01"),
      });
    } catch (ex) {
      alert((ex as any).error.message);
    }
  };

  return (
    <div>
      <div>Game balance:</div>
      <div>
        <strong> {gameBalance} ETH</strong>
      </div>
      <br />
      <br />
      <div>Number of Registered Players:</div>
      <div>
        <strong>{numberOfPlayers}</strong>
      </div>
      <br />
      <br />
      {isOwner && (
        <div>
          <button onClick={handleSendMoneyToTheWinner}>
            Send money to the winner
          </button>
          <input type="text" id="winnerAddressInput" />
        </div>
      )}

      {!isOwner && (
        <div>
          <button onClick={handleRegisterAsAPlayer}>
            Register as a player
          </button>
        </div>
      )}
    </div>
  );
};
