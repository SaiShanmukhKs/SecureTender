/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import { ABI, ADDRESS } from '../contract/Solidity'

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

        // Registration functions
        registerBidder: async (orgName) => {
            const txOptions = await getTxOptions();
            return await contract.methods.registerBidder(orgName).send(txOptions);
        },

        registerTenderCreator: async (orgName) => {
            const txOptions = await getTxOptions();
            return await contract.methods.registerTenderCreator(orgName).send(txOptions);
        },

        // Tender creation and management
        createTender: async (title, rfp, startDate, endDate, tenderFee, registrationFee, phases) => {
            const txOptions = await getTxOptions();
            return await contract.methods.createTender(
                title, rfp, startDate, endDate, tenderFee, registrationFee, phases
            ).send(txOptions);
        },

        closeTender: async (tenderId) => {
            const txOptions = await getTxOptions();
            return await contract.methods.closeTender(tenderId).send(txOptions);
        },

        cancelTender: async (tenderId) => {
            const txOptions = await getTxOptions();
            return await contract.methods.cancelTender(tenderId).send(txOptions);
        },

        // Bidding functions
        placeBid: async (tenderId, bidDetails, amount) => {
            const value = web3.utils.toWei(amount.toString(), 'ether');
            const txOptions = await getTxOptions();
            console.log("Placing bid with value:", value);
            console.log("Transaction options:", txOptions);
            console.log("Bid details:", bidDetails);
            console.log("Tender ID:", tenderId);
            return await contract.methods.placeBid(tenderId, bidDetails, value).send(txOptions);
        },
        
        awardTender: async(bidId, winnerAddress) => {
            const txOptions = await getTxOptions();
            return await contract.methods.setWinner(bidId, winnerAddress).send(txOptions);

        },

        getBidsForTender: async (tenderId) => {
            const txOptions = await getTxOptions();
            return await contract.methods.getBidsForTender(tenderId).call(txOptions);
        },

        approveBid: async (tenderId, bidId) => {
            const txOptions = await getTxOptions();
            return await contract.methods.approveBid(tenderId, bidId).send(txOptions);
        },

        rejectBid: async (tenderId, bidId) => {
            const txOptions = await getTxOptions();
            return await contract.methods.rejectBid(tenderId, bidId).send(txOptions);
        },

        setWinner: async (tenderId, bidId) => {
            const txOptions = await getTxOptions();
            return await contract.methods.setWinner(tenderId, bidId).send(txOptions);
        },

        // Payment functions
        initiatePayment: async (tenderId, paymentAmount) => {
            const value = web3.utils.toWei(paymentAmount.toString(), 'ether');
            const txOptions = await getTxOptions();
            return await contract.methods.initiatePayment(tenderId).send({
                ...txOptions,
                value: value
            });
        },

        releasePayment: async (tenderId, phase, amount) => {
            const txOptions = await getTxOptions();
            return await contract.methods.releasePayment(tenderId, phase, amount).send(txOptions);
        },

        withdrawFees: async () => {
            const txOptions = await getTxOptions();
            return await contract.methods.withdrawFees().send(txOptions);
        },

        // Rating function
        rateBidder: async (bidderId, rating) => {
            const txOptions = await getTxOptions();
            return await contract.methods.rateBidder(bidderId, rating).send(txOptions);
        },

        // View functions
        getActiveTenders: async () => {
            console.log("Fetching active tenders...");
            return await contract.methods.getActiveTenders().call();
        },

        getAwardedTenders: async (address) => {
            return await contract.methods.getAwardedTenders(address).call();
        },

        getTenderDetails: async (tenderId) => {
            return await contract.methods.getTenderDetails(tenderId).call();
        },

        getTenderBids: async (tenderId) => {
            return await contract.methods.getTenderBids(tenderId).call();
        },

        getBidDetails: async (tenderId, bidId) => {
            return await contract.methods.getBidDetails(tenderId, bidId).call();
        },

        getBidderRating: async (bidderId) => {
            return await contract.methods.getBidderRating(bidderId).call();
        },

        getBidsByBidder: async (bidderAddress) => {
            return await contract.methods.getBidsByBidder(bidderAddress).call();
        },

        getTendersByCreator: async (tenderCreatorId) => {
            return await contract.methods.getTendersByCreator(tenderCreatorId).call();
        },

        isTenderActive: async (tenderId) => {
            return await contract.methods.isTenderActive(tenderId).call();
        },

        // User ID lookups
        getBidderId: async (address) => {
            return await contract.methods.addressToBidderId(address).call();
        },

        getTenderCreatorId: async (address) => {
            return await contract.methods.addressToTenderCreatorId(address).call();
        },

        // Web3 utilities
        toWei: (amount) => {
            if (!web3 || !amount) return "0";
            try {
                return web3.utils.toWei(amount.toString(), 'ether');
            } catch (error) {
                console.error("Error converting to Wei:", error);
                return "0";
            }
        },
        fromWei: (amount) => {
            if (!web3 || !amount) return "0";
            try {
                return web3.utils.fromWei(amount.toString(), 'ether');
            } catch (error) {
                console.error("Error converting from Wei:", error);
                return "0";
            }
        },
    };

    return (
        <BlockchainTenderingContext.Provider value={contextValue}>
            {children}
        </BlockchainTenderingContext.Provider>
    );
};