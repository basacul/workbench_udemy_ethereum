/**
 * web3JS Sample DAPP by http://acloudfan.com
 * Version: 102     May 20th, 2017
 * 
 * Application developed as part of the course on Ethereum Blockchain
 * All Rights Reserved - Please do not share. 
 * Updated versions of the code is available on the link below:
 * APP will be updated time to time so please check back
 * 
 * http://www.acloudfan.com
 * 
 * This DAPP is available on the following link .... to use it you would need MetaMask
 * http://TheDapps.com
 * 
 * Geth
 * =====
 * Application developed against Geth/ROPSTEN
 * 
 * TestRPC
 * =======
 * Some API NOT Supported in TestRPC
 * Etherscan.io links will not be supported for TestRPC
 * 
 * META MASK
 * =========
 * MetaMask will work - except some for some functions coded SYNCHRONOUSLY
 * You may change it to work with MetaMask
 * 
 */


// The sample code was compiled in Remix
// Bytecode / Interface generated by Remix was pasted here
var contract_abidefinition = '[{"constant":false,"inputs":[],"name":"getNum","outputs":[{"name":"n","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"n","type":"uint256"}],"name":"setNum","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"x","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"caller","type":"address"},{"indexed":true,"name":"oldNum","type":"bytes32"},{"indexed":true,"name":"newNum","type":"bytes32"}],"name":"NumberSetEvent","type":"event"}]';
var contract_bytecode = '0x6060604052341561000c57fe5b604051602080610168833981016040528080519060200190919050505b806000819055505b505b610126806100426000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806367e0badb146044578063cd16ecbf146067575bfe5b3415604b57fe5b60516084565b6040518082815260200191505060405180910390f35b3415606e57fe5b60826004808035906020019091905050608f565b005b600060005490505b90565b60006000549050816000819055506000546001026000191681600102600019163373ffffffffffffffffffffffffffffffffffffffff167f108fd0bf2253f6baf35f111ba80fb5369c2e004b88e36ac8486fcee0c87e61ce60405180905060405180910390a45b50505600a165627a7a72305820b86215323334042910c2707668d7cc3c3ec760d2f5962724042482293eba5f6b0029';

/**
 * true: Auto connects to the local node and retrieve all the accounts
 * that are set up in the local node. These accounts are used to set the ui
 * elements and get balances. 
 * USE THIS BOOLEAN IN FUNCTIONS!!
 */
var autoRetrieveFlag = true;

// Holds the accounts
var accounts;

// Holds the filter objects
var filterWatch;
var filterEventCounter;

// Holds the contract event object
var contractEvent;
var contractEventCounter = 0;

// Maintains the info on node type
var nodeType = 'geth';

/**
 * Listener for load
 */
window.addEventListener('load', function () {

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        window.web3 = new Web3(web3.currentProvider);
    } else {
        console.log('Injected web3 Not Found!!!')
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

        var provider = document.getElementById('provider_url').value;
        window.web3 = new Web3(new Web3.providers.HttpProvider(provider));
    }

    // Now you can start your app & access web3 freely:
    startApp()

})


/**
 * This method gets invoked when document is ready
 */
function startApp() {

    // If the app is reconnected we should reset the watch
    doFilterStopWatching();
    doContractEventWatchStop();

    // Set the connect status on the app
    if (web3 && web3.isConnected()) {
        setData('connect_status', 'Connected', false);

        // Gets the version data and populates the result UI
        setWeb3Version();

        if (autoRetrieveFlag) doGetAccounts();

    } else {
        setData('connect_status', 'Not Connected', true);
    }

    // no action to be taken if this flag is OFF  
    // during development for convinience you may set autoRetrieveFlag=true
    if (!autoRetrieveFlag) return;



    // doConnect();
    // // doGetAccounts();
    // doGetNodeStatus();

    // Compilation is available only for TestRPC
    // Geth 1.6 and above does not support compilation
    // MetaMask does not support compilation
    doGetCompilers();
}

/**
 * This method is called for connecting to the node
 * The Provider URL is provided in a Document element with the 
 * id = provider_url
 */


function doConnect() {

    // Get the provider URL
    var provider = document.getElementById('provider_url').value;
    var provider = document.getElementById('provider_url').value;
    window.web3 = new Web3(new Web3.providers.HttpProvider(provider));

    startApp();

}

/**
 * Get the version information for Web3
 */

function setWeb3Version() {

    var versionJson = {};

    // Asynchronous version
    web3.version.getNode(function (error, result) {
        if (error) setData('version_information', error, true);
        else {
            if (result.toLowerCase().includes('metamask')) {
                nodeType = 'metamask';
            } else if (result.toLowerCase().includes('testrpc')) {
                nodeType = 'testrpc';
            } else {
                nodeType = 'geth';
            }

            // synchronous method calls from the web3 api
            let output = {
                api: web3.version.api,
                ethereum: web3.version.ethereum,
                network: web3.version.network,
                node: `${nodeType} ${result}`
            };

            setData('version_information', JSON.stringify(output, null, 10), false);

            // set up UI elements based on the node type
            setUIBasedOnNodeType();
        }
    });
}



/**
 * Uses the web3.net status to check if the client is listening and peer count
 */

function doGetNodeStatus() {
    // Asynch version
    /**
     * This property is read only and says whether the node is actively listening 
     * for network connections or not
     * @returns Boolean true if client is actively listening for network connections, 
     * otherwise false
     */
    web3.net.getListening(function (error, result) {
        if (error) setData('get_peer_count', error, true);
        else {
            // Since connected lets get the count
            web3.net.getPeerCount(function (error, result) {
                if (error) {
                    setData('get_peer_count', error, true);
                } else {
                    setData('get_peer_count', 'Peer Count: ' + result, (result == 0));
                }
            });
        }
    });

    // Asynch version by Lucas
    web3.eth.getSyncing(function (error, result) {
        if (error) {
            setData("node_syncing_status", error, true);

        } else {
            if (result) {
                setData("node_syncing_status", JSON.stringify(result, null, 10), false);
            } else {
                setData("node_syncing_status", "UNKNOWN", false)
            }

        }
    });

    // Asynch version by Lucas
    web3.eth.getMining(function (error, result) {
        if (error) {
            setData("node_mining_status", error, true);
        } else {
            if (result) {
                setData("node_mining_status", "Node is mining", false);
            } else {
                setData("node_mining_status", "Node is not mining", false);
            }

        }
    })
}

/**
 * Gets the accounts under the node
 * 
 */

function doGetAccounts() {
    // This is the synch call for getting the accounts
    // var accounts = web3.eth.accounts

    // Asynchronous call to get the accounts
    // result = [Array of accounts]
    // MetaMask returns 1 account in the array - that is the currently selected account
    web3.eth.getAccounts(function (error, result) {
        if (error) {
            setData('accounts_count', error, true);
        } else {
            accounts = result;
            setData('accounts_count', result.length, false);
            // You need to have at least 1 account to proceed
            if (result.length == 0) {
                if (nodeType == 'metamask') {
                    alert('Unlock MetaMask *and* click \'Get Accounts\'');
                }
                return;
            }

            // Remove the list items that may already be there
            removeAllChildItems('accounts_list');
            // Add the accounts as list items
            for (var i = 0; i < result.length; i++) {
                addAccountsToList('accounts_list', i, result[i])
            }

            var coinbase = web3.eth.coinbase;
            // trim it so as to fit in the window/UI
            if (coinbase) coinbase = coinbase.substring(0, 25) + '...'
            setData('coinbase', coinbase, false);
            // set the default accounts
            var defaultAccount = web3.eth.defaultAccount;
            if (!defaultAccount) {
                web3.eth.defaultAccount = result[0];
                defaultAccount = '[Undef]' + result[0];
            }

            defaultAccount = defaultAccount.substring(0, 25) + '...';
            setData('defaultAccount', defaultAccount, false);
        }
        // Get the balances of all accounts doGetBalances
        doGetBalances(accounts)

        // This populates the SELECT boxes with the accounts
        addAccountsToSelects(accounts);
    });
}

/**
 * Get the balances of all accounts.
 */
function doGetBalances(accounts) {

    // Remove the balances if they already exist
    removeAllChildItems('account_balances_list');

    // Add the balances as the list items
    for (var i = 0; i < accounts.length; i++) {

        // var bal = web3.eth.getBalance(accounts[i]);
        web3.eth.getBalance(accounts[i], web3.eth.defaultBlock, function (error, result) {
            // Convert the balance to ethers
            var bal = web3.fromWei(result, 'ether').toFixed(2);
            addAccountBalancesToList('account_balances_list', i, bal);
        });
    }
}

/**
 * This gets invoked for sending the transaction
 */

function doSendTransaction() {

    var transactionObject = createTransactionObjectJson();

    web3.eth.sendTransaction(transactionObject, function (error, result) {

        if (error) {
            setData('send_transaction_error_or_result', error, true);
        } else {
            setData('send_transaction_error_or_result', result, false);
            // set the link to ether scan
            var etherscanLinkA = document.getElementById('etherscan_io_tx_link');
            etherscanLinkA.href = createEtherscanIoUrl('tx', result);
            etherscanLinkA.innerHTML = 'etherscan.io'
            //console.log(etherscanLinkA)
        }
    });
}

/**
 * Unlocks the account
 * UNLOCK/LOCK not supported in TestRPC
 * Ignored in MetaMask
 */

function doUnlockAccount() {

    setData('lock_unlock_result', '...', true);
    var account = document.getElementById('select_to_unlock_account').value;
    var password = document.getElementById('unlock_account_password').value;

    // synchronous flavor
    // web3.personal.unlockAccount(account, password, duration)
    // web3.personal.unlockAccount(account, password)


    web3.personal.unlockAccount(account, password, function (error, result) {

        // console.log(error,result)
        if (error) {
            setData('lock_unlock_result', error, true);
        } else {
            // Result = True if unlocked, else false
            var str = account.substring(0, 20) + '...Unlocked';
            if (result) {
                setData('lock_unlock_result', str, false);
            } else {
                // This does not get called - since and error is returned for incorrect password :-)
                str = 'Incorrect Password???';
                setData('lock_unlock_result', str, true);
            }


        }
    });
}

/**
 * Lock the account
 */
function doLockAccount() {



    setData('lock_unlock_result', '...', true);
    var account = document.getElementById('select_to_unlock_account').value;
    //Synchronous flavor
    //web3.personal.lockAccount(account)

    web3.personal.lockAccount(account, function (error, result) {

        console.log(error, result)
        if (error) {
            setData('lock_unlock_result', error, true);
        } else {
            var str = account.substring(0, 20) + '...Locked';
            setData('lock_unlock_result', str, false);
        }
    });
}

/**
 * Gets the list of compilers
 */
function doGetCompilers() {



    web3.eth.getCompilers(function (error, result) {
        if (error) {
            setData('list_of_compilers', error, true);
        } else {
            // result has an array of compilers
            if (result.length == 0)
                setData('list_of_compilers', 'No Compilers!!!', true);
            else
                setData('list_of_compilers', result, false);
        }
    });
}

/**
 * Starting geth 1.6 - Solidity compilation is not allowed from
 * web3 JSON/RPC
 */

function doCompileSolidityContract() {


    var source = document.getElementById('sourcecode').value;

    console.log(flattenSource(source));

    web3.eth.compile.solidity(source, function (error, result) {

        if (error) {
            console.log(error);
            setData('compilation_result', error, true);
        } else {
            // This is an issue seen only on windows - solc compile binary - ignore
            result = compileResultWindowsHack(result);
            console.log('Compilation Result=', JSON.stringify(result));
            var contract_1 = '';
            var code_1 = '';
            var abi_1 = '';
            for (var prop in result) {
                contract_1 = prop;
                code_1 = result[prop].code;
                if (!code_1) {
                    // Test RPC returns code in result.code
                    code_1 = result.code;
                }
                if (result[prop].info) {
                    abi_1 = result[prop].info.abiDefinition;
                } else {
                    // Test RPC does not have the contracts :) in result
                    abi_1 = result.info.abiDefinition;
                }
                break;
            }
            // Populate the UI elements
            setData('compilation_result', 'Contract#1: ' + contract_1, false);
            document.getElementById('compiled_bytecode').value = code_1;
            document.getElementById('compiled_abidefinition').value = JSON.stringify(abi_1);

        }
    });
}




/**
 * Deploys the contract - ASYNCH
 */

function doDeployContract() {
    // Reset the deployment results UI
    resetDeploymentResultUI();

    var abiDefinitionString = document.getElementById('compiled_abidefinition').value;
    var abiDefinition = JSON.parse(abiDefinitionString);

    var bytecode = document.getElementById('compiled_bytecode').value;

    // 1. Create the contract object
    var contract = web3.eth.contract(abiDefinition);

    // Get the estimated gas
    var gas = document.getElementById('deployment_estimatedgas').value;

    // 2. Create the params for deployment - all other params are optional, uses default
    var params = {
        from: web3.eth.coinbase,
        data: bytecode,
        gas: gas
    }

    // 3. This is where the contract gets deployed
    // Callback method gets called *2* 
    // First time : Result = Txn Hash
    // Second time: Result = Contract Address
    var constructor_param = 10;

    contract.new(constructor_param, params, function (error, result) {

        if (error) {
            setData('contracttransactionhash', 'Deployment Failed: ' + error, true);
        } else {
            console.log('RECV:', result)
            if (result.address) {
                document.getElementById('contractaddress').value = result.address;
                setEtherscanIoLink('contractaddress_link', 'address', result.address);
            } else {
                // gets set in the first call
                setData('contracttransactionhash', result.transactionHash, false);
                setEtherscanIoLink('contracttransactionhash_link', 'tx', result.transactionHash);
            }
        }
    });
}

/**
 * Deploys the contract - Synchronous
 * Function not in use from UI. Created to show how once can use the synch API
 * contract.new
 */

function doDeployContractSynchronous() {

    var abiDefinitionString = document.getElementById('compiled_abidefinition').value;
    var abiDefinition = JSON.parse(abiDefinitionString);

    var bytecode = document.getElementById('compiled_bytecode').value;

    // 1. Create the contract object
    var contract = web3.eth.contract(abiDefinition);

    // Get the estimated gas
    var gas = document.getElementById('deployment_estimatedgas').value;

    // 2. Create the params for deployment - all other params are optional, uses default
    var params = {
        from: web3.eth.coinbase,
        data: bytecode,
        gas: gas
    }

    var contractData = contract.new.getData(10, { 'data': bytecode });
    console.log('Contract Data=', contractData);
    // call send transaction and then call getTransactionReceipt
    params.data = contractData
    var transactionHash = web3.eth.sendTransaction(params)
    console.log('TxnHash=', transactionHash);
    web3.eth.getTransactionReceipt(transactionHash, function (error, result) {
        if (error) console.log('SENDTran Error=', error)
        else if (error) console.log('SENDTran Hash=', result);
    });

    return
}

// Utility method for creating the contract instance
function createContractInstance(addr) {
    var abiDefinitionString = document.getElementById('compiled_abidefinition').value;
    var abiDefinition = JSON.parse(abiDefinitionString);

    // Instance uses the definition to create the function

    var contract = web3.eth.contract(abiDefinition);

    // THIS IS AN EXAMPLE - How to create a deploy using the contract
    // var instance = contract.new(constructor_params, {from:coinbase, gas:10000})
    // Use the next for manual deployment using the data generated
    // var contractData = contract.new.getData(constructor_params, {from:coinbase, gas:10000});

    var address = addr;

    if (!address) address = document.getElementById('contractaddress').value;

    // Instance needs the address

    var instance = contract.at(address);

    return instance;
}

/**
 * This invokes the contract function
 * locally on the node with no state change propagation
 */
function doContractFunctionCall() {
    console.log("First");
    // This leads to the invocation of the method locally
    var instance = createContractInstance();

    var funcName = document.getElementById('contract_select_function').value;
    console.log("if");
    if (funcName === 'setNum') {
        console.log("if");
        var parameterValue = document.getElementById('setnum_parameter').value;

        // MetaMask does not allow synchronous call to 'call' for non-constant function
        // Change this to asynchronous :)
        var value = instance.setNum.call(parameterValue);

        setExecuteResultUI('Call', funcName, parameterValue, value, '', false);
    } else {
        console.log("else");
        instance.getNum.call({}, web3.eth.defaultBlock, function (error, result) {
            setExecuteResultUI('Call', funcName, '', result, '', false);
        });


    }
}

/**
 * send Transaction costs Gas. State changes are recorded on the chain.
 */
function doContractSendCall() {
    // creating the cntract instance
    var instance = createContractInstance();
    // read the ui elements
    var estimatedGas = document.getElementById('contract_execute_estimatedgas').value;
    var parameterValue = document.getElementById('setnum_parameter').value;
    var funcName = document.getElementById('contract_select_function').value;
    //value NOT used as the contract function needs to be modified with "payable" modifier
    //var value = document.getElementById('invocation_send_value_in_ether').value;
    //value = web3.toWei(value,'ether');

    // Create the transaction object
    var txnObject = {
        from: web3.eth.coinbase,
        gas: estimatedGas
    }

    if (funcName === 'setNum') {
        // setNum with sendTransaction
        instance.setNum.sendTransaction(parameterValue, txnObject, function (error, result) {

            console.log('RECVED>>', error, result);
            if (error) {
                setExecuteResultUI('Send Transaction:   ', funcName, '', error, '', true);
            } else {
                setExecuteResultUI('Send Transaction:   ', funcName, parameterValue, result, result, false);
            }
        });
    } else {
        // getNum with sendTransaction
        instance.getNum.sendTransaction(txnObject, function (error, result) {

            console.log('RECVED>>', error, result);
            if (error) {
                setExecuteResultUI('Send Transaction:   ', funcName, '', error, '', true);
            } else {
                setExecuteResultUI('Send Transaction:   ', funcName, '', result, result, false);
            }
        });
    }
}

/**
 * Starts the filter watch for events with options specified by the user
 */


function doFilterWatchStart() {
    //1. Stop the wtach if its already ON
    doFilterStopWatching();
    //2. Reset the UI
    setData('watch_event_count', '0', false);

    //3. Create the filter option
    var options = generateFilterOptions();
    console.log('FILTER Watch Options:', JSON.stringify(options));

    //4. Set the applied watch filter UI Input box
    document.getElementById('applied_watch_filter').value = JSON.stringify(options);

    //5. Create instance of the filter
    filterWatch = web3.eth.filter(options);

    //6. Now start watching
    filterWatch.watch(function (error, result) {
        if (error) {
            console.error('Filter Watch Error: ', error);
        } else {
            filterEventCounter++;
            // Update the UI for the counter
            setData('watch_event_count', filterEventCounter, false);

            // Updates the UI with received event
            addEventListItem('watch_events_list', result, 5);
        }
    });
}

/**
 * Stop watching for events
 */

function doFilterStopWatching() {

    // 1. Stop watching if watching iactive
    if (filterWatch) {
        filterWatch.stopWatching();
        filterWatch = undefined;
    }
    // 2. Reset the UI
    setData('watch_event_count', 'Not Watching', true);
    document.getElementById('applied_watch_filter').value = '';

    // 3. Remove all of the past events from the list
    clearList('watch_events_list');

    // 4. reset the counter
    filterEventCounter = 0;
}

/**
 * Get the logs for the specified filter
 * Testnet sample contract address: 
 */

function doFilterGetLogs() {

    // 1. Clear the list
    clearList('get_logs_list');

    // 2. Create the filter option
    var options = generateFilterOptions();
    console.log('FILTER Get Options:', JSON.stringify(options));

    // 3. Set the applied watch filter UI Input box
    document.getElementById('applied_log_filter').value = JSON.stringify(options);

    // 4. Create the instance of the filter
    var filterGet = web3.eth.filter(options);

    // 5. Invoke get on filter with the callback function
    filterGet.get(function (error, result) {
        if (error) {
            console.log('GET Error:', error);
            setData('get_log_count', error, true);
        } else {
            // result = array of events
            // Update UI with the data received as an array of events
            setData('get_log_count', result.length, false);
            for (var i = 0; i < result.length; i++) {
                //console.log("Event.watch="+JSON.stringify(result[i]))
                addEventListItem('get_logs_list', result[i], 50);
            }
        }
    });
}

/**
 * To start the event watching using the contract object
 */

function doContractEventWatchStart() {

    if (contractEvent) {
        doContractEventWatchStop();
    }

    // Reset the UI
    setData('watch_contract_instance_event_count', '0', false);

    contractEvent = createContractEventInstance();

    contractEvent.watch(function (error, result) {
        if (error) {
            console.error('Contract Event Error');
        } else {

            //    console.log("Event.watch="+JSON.stringify(result))
            // increment the count watch_instance_event_count
            contractEventCounter++;
            setData('watch_contract_instance_event_count', contractEventCounter, false);

            addEventListItem('watch_contract_events_list', result, 5);
        }
    });
}


/**
 * To stop the event watching using the contract object
 */

function doContractEventWatchStop() {

    if (contractEvent) {
        contractEvent.stopWatching();
        contractEvent = undefined;
    }
    contractEventCounter = 0;
    clearList('watch_contract_events_list');
    setData('watch_contract_instance_event_count', '---', true);
}

/**
 * Gets the logs for the specific contract instance
 */

function doContractEventGet() {

    clearList('get_contract_instance_logs_list');
    setData('get_contract_instance_log_count', '---', true);
    var event = createContractEventInstance();
    event.get(function (error, result) {
        if (error) {
            setData('get_contract_instance_log_count', error, true);
        } else {
            setData('get_contract_instance_log_count', result.length, false);
            for (var i = 0; i < result.length; i++) {
                addEventListItem('get_contract_instance_logs_list', result[i], 50);
            }
        }
    });
}

/**
 * Utility method for creating an instance of the event
 */
function createContractEventInstance() {
    var contractAddress = document.getElementById('contract_instance_address').value

    var contractInstance = createContractInstance(contractAddress);

    // geth the indexed data values JSON
    var indexedEventValues = document.getElementById('indexed_event_values').value
    indexedEventValues = JSON.parse(indexedEventValues)

    var additionalFilterOptions = document.getElementById('additional_filter_event_values').value;
    additionalFilterOptions = JSON.parse(additionalFilterOptions);

    return contractInstance.NumberSetEvent(indexedEventValues, additionalFilterOptions);
}