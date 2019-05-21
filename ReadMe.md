# Coding exercise

The Interact.sol contract was discussed in one of the past lectures. Use web3 for creating a DAPP. Here are the steps you will need to follow:

1. Deploy the contract 
2. Copy the address & ABI Definition into a JSON/Text file
3. Use your favorite Javascript library to create a Web Front End (UI) for your Contract  
    There is no hard and fast rule(s) for completing this part .... you as Front End developer decide how you would like to proceed :-)  
    1. Decide on tools that you would use for creating the Single page application  
        * Javascript Libraries
        * Framework e.g., Angular, JQuery, 
        * Tools e.g., Yoeman webapp generator as explained in lectures in this section
    2. Add the file created in #2 to the UI project. For contract interactions you would need to use the content in this file
    3. Use appropriate web3 API to Read the account information from provider (geth/MetaMask) & display it on the front end
    4. Provide a way for the user to interact. E.g., you may create a text box where the user can put in some message.
    5. Start the contract event watch - display the events received.  
        * Create a UI component that will  show messages in a friendly way
        * Start an event listener using the web3 events API

For this assignment I will simply use the contract at address 0x1F20E0a14121276220Dc049696590fCbfa0621E0 in the Rinkeby test network instead of deploying the contract.

ABI Definition of the contract with address 0x1F20E0a14121276220Dc049696590fCbfa0621E0.
```json
[{"constant":false,"inputs":[{"name":"yourName","type":"bytes32"}],"name":"interact","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"currentName","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"fromAddres","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"lastUpdatedMinutes","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"name","type":"bytes32"},{"indexed":true,"name":"addr","type":"address"},{"indexed":true,"name":"timeUpdated","type":"uint256"}],"name":"Interaction","type":"event"}]
```

```solidity
pragma solidity ^0.5.8;

/**
 * Part of a course on Blockchain
 **/
contract InteractionChannel {

  bytes32 name;
  uint    lastUpdate;
  address lastAddress;

  event Interaction(bytes32 indexed name, address  indexed addr, uint indexed timeUpdated);


  function  currentName() public constant  returns(bytes32){
    return name;
  }

  function  lastUpdatedMinutes() public constant  returns(uint){
    return ((now - lastUpdate)/60);
  }

  function  fromAddres() public constant returns(address){
    return lastAddress;
  }

  function interact(bytes32 yourName) public {
    name = yourName;
    lastAddress = msg.sender;
    lastUpdate = now;
    emit Interaction(name,lastAddress,lastUpdate);
  }

}
```