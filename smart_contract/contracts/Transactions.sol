//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

contract Transactions{
    uint256 transcationCounter;
    event Transfer(address from,address reciever,uint amount,string message , uint256 timestamp, string keyword);

    struct TransferStruct{
        address sender;
        address reciever;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

     TransferStruct[] transactions;

     function addToBlockchain(address payable reciever, uint amount,string memory message,string memory keyword) public{
          transcationCounter+=1;
          transactions.push(TransferStruct(msg.sender,reciever,amount,message,block.timestamp,keyword));
     }
     function getAllTranscations() public view returns (TransferStruct[] memory){
          return transactions;
     }
     function getTransactionCount() public view returns(uint256){
          return transcationCounter;
     }
}
