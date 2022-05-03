pragma solidity ^0.8.7;
//SPDX-License-Identifier: MIT

contract PokerManager{
    address public owner;
    uint constant MAX_PLAYERS = 5;    
    address[] public playersArr;
    uint256 public gameBalance;
    mapping(address => bool) players;
 
   event NewPlayer(address indexed sender, string message);

    constructor() {         
        owner = msg.sender;
    }

    function registerToTheGame() payable public{      
        require(playersArr.length < 5, "The game is full");
        require(msg.value == 10000000000000000, "Wrong amount, amount should be 0.01 Ether");
        require(msg.sender != owner, "The owner can't register to a game");
        require(players[msg.sender] == false,"You are already signed in");

        gameBalance += msg.value;
        players[msg.sender] = true;
        playersArr.push(msg.sender);       

        emit NewPlayer(msg.sender,"New Player");
    }

    function sendMoneyToTheWinner(address payable destAddr) public{        
        require(msg.sender == owner, "Only owner can touch the money");      
        require(players[destAddr] != true, "Only one of the players can get the money");   
        require(playersArr.length == MAX_PLAYERS, "Number of players is not enough to send the money");   
        
        destAddr.transfer(gameBalance);

        address payable addr = payable(address(owner));
        selfdestruct(addr);
    }

    function getNumberOfPlayers() public view returns (uint256) {
        return playersArr.length;
    }
 
}










