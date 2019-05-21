# Coding exercise

The Interact.sol contract was discussed in one of the past lectures. Use web3 for creating a DAPP. Here are the steps you will need to follow:

1. Deploy the contract : Transaction Hash 0x9486c5db66e82ce12dfdc435ea2e9fe71b6ef1397cbf468d673f99ddfcdb044c
2. Copy the address 0xd3587ad56599685d3865b5069254d37dcd6e2837 & ABI Definition into a JSON/Text file
   ```json
    [{"constant":false,"inputs":[],"name":"getNum","outputs":[{"name":"n","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"n","type":"uint256"}],"name":"setNum","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"x","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"caller","type":"address"},{"indexed":true,"name":"oldNum","type":"bytes32"},{"indexed":true,"name":"newNum","type":"bytes32"}],"name":"NumberSetEvent","type":"event"}]
   ```
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

For this assignment I will simply use the contract at address 0xd3587ad56599685d3865b5069254d37dcd6e2837 in the Rinkeby test network instead of deploying the contract.

ABI Definition of the contract with address 0xd3587ad56599685d3865b5069254d37dcd6e2837.
```json
[{"constant":false,"inputs":[],"name":"getNum","outputs":[{"name":"n","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"n","type":"uint256"}],"name":"setNum","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"x","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"caller","type":"address"},{"indexed":true,"name":"oldNum","type":"bytes32"},{"indexed":true,"name":"newNum","type":"bytes32"}],"name":"NumberSetEvent","type":"event"}]
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