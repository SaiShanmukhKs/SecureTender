/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import { ABI, ADDRESS } from '../contract/Solidity'
import { jwtDecode } from 'jwt-decode';

// Create the context
const BlockchainTenderingContext = createContext(null);

// Flag to prevent multiple connection attempts
let connectingInProgress = false;

// Custom hook to use the context
export const useBlockchainTendering = () => {
    const context = useContext(BlockchainTenderingContext);
    if (!context) {
        throw new Error('useBlockchainTendering must be used within a BlockchainTenderingProvider');
    }
    return context;
};

// Provider component
export const BlockchainTenderingProvider = ({ children }) => {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);

    // Initialize Web3 and contract
    useEffect(() => {

        const token = localStorage.getItem('userData');
        if (!token) {
            console.error("No user data found in localStorage. Please log in.");
        }
        const decodedToken = token ? jwtDecode(token) : null;
        const address = decodedToken ? decodedToken.userResponse.address : null;

        const initWeb3 = async () => {
            if (connectingInProgress) {
                console.log("Connection already in progress. Please wait.");
                return;
            }

            connectingInProgress = true;

            if (window.ethereum) {
                try {
                    // Request account access
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const web3Instance = new Web3(window.ethereum);
                    const contractInstance = new web3Instance.eth.Contract(ABI, ADDRESS);
                    console.log("Contract instance:", contractInstance);

                    // Get the current account
                    const accounts = await web3Instance.eth.getAccounts();

                    setWeb3(web3Instance);
                    setContract(contractInstance);
                    if (accounts.includes(address)) {
                        console.log("Using address from token:", address);
                        setAccount(address);
                    }
                    setAccount(accounts[0]);

                    // Listen for account changes
                    window.ethereum.on('accountsChanged', (accounts) => {
                        setAccount(accounts[0]);
                    });
                } catch (error) {
                    console.error("Failed to initialize Web3:", error);
                } finally {
                    connectingInProgress = false;
                }
            } else {
                console.error("Please install MetaMask!");
                connectingInProgress = false;
            }
        };

        initWeb3();

        // Cleanup function
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', (accounts) => {
                    setAccount(accounts[0]);
                });
            }
        };
    }, []);

    // Helper function to get gas price and create transaction options
    const getTxOptions = async () => {
        if (!web3 || !account) return { from: account };

        try {
            const gasPrice = await web3.eth.getGasPrice();
            return {
                from: account,
                gasPrice: gasPrice,
                type: '0x0' // Force legacy transaction format
            };
        } catch (error) {
            console.error("Error getting gas price:", error);
            return { from: account, type: '0x0' };
        }
    };

    // Contract functions
    const contextValue = {
        account,
        web3,
        contract,

        // Tender creation and management
        createTender: async (title, rfp, startDate, endDate, tenderFee, registrationFee, phases) => {
            const txOptions = await getTxOptions();
            return await contract.methods.createTender(
                title, rfp, startDate, endDate, tenderFee, registrationFee, phases
            ).send(txOptions);
        },

        updateStatus: async (tenderId, newStatus) => {
            const txOptions = await getTxOptions();
            return await contract.methods.updateStatus(tenderId, newStatus).send(txOptions);
        },

        // Award tender function (added)
        awardTender: async (tenderId, winnerAddress) => {
            const txOptions = await getTxOptions();
            return await contract.methods.setWinner(tenderId, winnerAddress).send(txOptions);
        },

        // Bidding functions
        placeBid: async (tenderId, detailsFile, amount, registrationFeeInEther) => {
            const value = web3.utils.toWei(registrationFeeInEther.toString(), 'ether');
            const bidAmount = web3.utils.toWei(amount.toString(), 'ether');
            const txOptions = await getTxOptions();
            console.log("Placing bid with registration fee:", value);
            console.log("Bid amount:", bidAmount);
            console.log("Transaction options:", txOptions);
            return await contract.methods.placeBid(tenderId, detailsFile, bidAmount).send({
                ...txOptions,
                value: value
            });
        },

        setBidStatus: async (bidId, status) => {
            const txOptions = await getTxOptions();
            // status should be 0 (Pending), 1 (Accepted), or 2 (Rejected)
            return await contract.methods.setBidStatus(bidId, status).send(txOptions);
        },

        // Winner selection and fund management
        setWinner: async (tenderId, winnerAddress, winningBidAmountInEther) => {
            const value = web3.utils.toWei(winningBidAmountInEther.toString(), 'ether');
            const txOptions = await getTxOptions();
            console.log("Setting winner with fund deposit:", value);
            return await contract.methods.setWinner(tenderId, winnerAddress).send({
                ...txOptions,
                value: value
            });
        },

        // Fund dispersal functions
        disperseFunds: async (tenderId) => {
            const txOptions = await getTxOptions();
            return await contract.methods.disperseFunds(tenderId).send(txOptions);
        },

        // Phase-wise payment function (added for better phase management)
        payPhase: async (tenderId, phaseIndex, amount) => {
            const txOptions = await getTxOptions();
            // This assumes your contract has a payPhase function
            // If not, you'll need to implement it in your smart contract
            return await contract.methods.payPhase(tenderId, phaseIndex).send({
                ...txOptions,
                value: amount
            });
        },

        // Transaction logging
        logTransactionPublic: async (transactionInput) => {
            const txOptions = await getTxOptions();
            return await contract.methods.logTransactionPublic(transactionInput).send(txOptions);
        },

        // View functions - Tender related
        getActiveTenders: async () => {
            console.log("Fetching active tenders...");
            return await contract.methods.getActiveTenders().call();
        },

        getAwardedTenders: async (tenderCreatorAddress) => {
            return await contract.methods.getAwardedTenders(tenderCreatorAddress).call();
        },

        getTenderDetails: async (tenderId) => {
            return await contract.methods.getTenderDetails(tenderId).call();
        },

        getTendersByCreator: async (creatorAddress) => {
            return await contract.methods.getTendersByCreator(creatorAddress).call();
        },

        // View functions - Bid related
        getBidsForTender: async (tenderId) => {
            return await contract.methods.getBidsForTender(tenderId).call();
        },

        getBidsByBidder: async (bidderAddress) => {
            return await contract.methods.getBidsByBidder(bidderAddress).call();
        },

        // View functions - Transaction related
        getTransactionsForTender: async (tenderId) => {
            return await contract.methods.getTransactionsForTender(tenderId).call();
        },

        // View functions - Phase and payment related
        getRemainingPhases: async (tenderId) => {
            return await contract.methods.getRemainingPhases(tenderId).call();
        },

        getPhaseInfo: async (tenderId) => {
            return await contract.methods.getPhaseInfo(tenderId).call();
        },

        canDisperseFunds: async (tenderId) => {
            return await contract.methods.canDisperseFunds(tenderId).call();
        },

        // View functions - Fee related
        getRegistrationFeesCollected: async (tenderId) => {
            return await contract.methods.getRegistrationFeesCollected(tenderId).call();
        },

        getRegistrationFee: async (tenderId) => {
            return await contract.methods.getRegistrationFee(tenderId).call();
        },

        // View functions - Contract state
        getTenderCount: async () => {
            return await contract.methods.tenderCount().call();
        },

        getBidCount: async () => {
            return await contract.methods.bidCount().call();
        },

        getTxCount: async () => {
            return await contract.methods.txCount().call();
        },

        // Direct mappings access (if needed)
        getTender: async (tenderId) => {
            return await contract.methods.tenders(tenderId).call();
        },

        getBid: async (bidId) => {
            return await contract.methods.bids(bidId).call();
        },

        getTransaction: async (txId) => {
            return await contract.methods.transactions(txId).call();
        },

        // Web3 utilities
        toWei: (amount, unit = 'ether') => {
            if (!web3 || !amount) return "0";
            try {
                return web3.utils.toWei(amount.toString(), unit);
            } catch (error) {
                console.error("Error converting to Wei:", error);
                return "0";
            }
        },

        fromWei: (amount, unit = 'ether') => {
            if (!web3 || !amount) return "0";
            try {
                return web3.utils.fromWei(amount.toString(), unit);
            } catch (error) {
                console.error("Error converting from Wei:", error);
                return "0";
            }
        },

        // Helper functions for status conversion
        getBidStatusString: (status) => {
            const statuses = ['Pending', 'Accepted', 'Rejected'];
            return statuses[status] || 'Unknown';
        },

        getTenderStatusString: (status) => {
            const statuses = ['Closed', 'Open', 'Cancelled'];
            return statuses[status] || 'Unknown';
        },

        // Contract balance
        getContractBalance: async () => {
            if (!web3) return "0";
            try {
                const balance = await web3.eth.getBalance(ADDRESS);
                return web3.utils.fromWei(balance, 'ether');
            } catch (error) {
                console.error("Error getting contract balance:", error);
                return "0";
            }
        },

        // Account balance
        getAccountBalance: async (address = account) => {
            if (!web3 || !address) return "0";
            try {
                const balance = await web3.eth.getBalance(address);
                return web3.utils.fromWei(balance, 'ether');
            } catch (error) {
                console.error("Error getting account balance:", error);
                return "0";
            }
        }
    };

    return (
        <BlockchainTenderingContext.Provider value={contextValue}>
            {children}
        </BlockchainTenderingContext.Provider>
    );
};