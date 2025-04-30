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

    // Contract functions
    const contextValue = {
        account,

        // Registration functions
        registerBidder: async (orgName) => {
            if (!contract || !account) throw new Error("Contract not initialized");
            return await contract.methods.registerBidder(orgName).send({ from: account });
        },

        registerTenderCreator: async (orgName) => {
            if (!contract || !account) throw new Error("Contract not initialized");
            return await contract.methods.registerTenderCreator(orgName).send({ from: account });
        },

        // Tender creation and management
        createTender: async (title, rfp, startDate, endDate, tenderFee, registrationFee, phases) => {
            if (!contract || !account) throw new Error("Contract not initialized");
            
            console.log("Transaction parameters:", {
                title, rfp, startDate, endDate, tenderFee, registrationFee, phases
            });
            
            return await contract.methods.createTender(
                title, rfp, startDate, endDate, tenderFee, registrationFee, phases
            ).send({ from: account });
        },

        closeTender: async (tenderId) => {
            if (!contract || !account) throw new Error("Contract not initialized");
            return await contract.methods.closeTender(tenderId).send({ from: account });
        },

        cancelTender: async (tenderId) => {
            if (!contract || !account) throw new Error("Contract not initialized");
            return await contract.methods.cancelTender(tenderId).send({ from: account });
        },

        // Bidding functions
        placeBid: async (tenderId, bidDetails, amount, paymentAmount) => {
            if (!contract || !account || !web3) throw new Error("Contract not initialized");
            const value = web3.utils.toWei(paymentAmount.toString(), 'ether');
            return await contract.methods.placeBid(tenderId, bidDetails, amount).send({
                from: account,
                value: value
            });
        },

        approveBid: async (tenderId, bidId) => {
            if (!contract || !account) throw new Error("Contract not initialized");
            return await contract.methods.approveBid(tenderId, bidId).send({ from: account });
        },

        rejectBid: async (tenderId, bidId) => {
            if (!contract || !account) throw new Error("Contract not initialized");
            return await contract.methods.rejectBid(tenderId, bidId).send({ from: account });
        },

        setWinner: async (tenderId, bidId) => {
            if (!contract || !account) throw new Error("Contract not initialized");
            return await contract.methods.setWinner(tenderId, bidId).send({ from: account });
        },

        // Payment functions
        initiatePayment: async (tenderId, paymentAmount) => {
            if (!contract || !account || !web3) throw new Error("Contract not initialized");
            const value = web3.utils.toWei(paymentAmount.toString(), 'ether');
            return await contract.methods.initiatePayment(tenderId).send({
                from: account,
                value: value
            });
        },

        releasePayment: async (tenderId, phase, amount) => {
            if (!contract || !account) throw new Error("Contract not initialized");
            return await contract.methods.releasePayment(tenderId, phase, amount).send({ from: account });
        },

        withdrawFees: async () => {
            if (!contract || !account) throw new Error("Contract not initialized");
            return await contract.methods.withdrawFees().send({ from: account });
        },

        // Rating function
        rateBidder: async (bidderId, rating) => {
            if (!contract || !account) throw new Error("Contract not initialized");
            return await contract.methods.rateBidder(bidderId, rating).send({ from: account });
        },

        // View functions - these don't need transaction options
        getActiveTenders: async () => {
            if (!contract) throw new Error("Contract not initialized");
            return await contract.methods.getActiveTenders().call();
        },

        getTenderDetails: async (tenderId) => {
            if (!contract) throw new Error("Contract not initialized");
            return await contract.methods.getTenderDetails(tenderId).call();
        },

        getTenderBids: async (tenderId) => {
            if (!contract) throw new Error("Contract not initialized");
            return await contract.methods.getTenderBids(tenderId).call();
        },

        getBidDetails: async (tenderId, bidId) => {
            if (!contract) throw new Error("Contract not initialized");
            return await contract.methods.getBidDetails(tenderId, bidId).call();
        },

        getBidderRating: async (bidderId) => {
            if (!contract) throw new Error("Contract not initialized");
            return await contract.methods.getBidderRating(bidderId).call();
        },

        getBidderBids: async (bidderId) => {
            if (!contract) throw new Error("Contract not initialized");
            return await contract.methods.getBidderBids(bidderId).call();
        },

        getTenderCreatorTenders: async (tenderCreatorId) => {
            if (!contract) throw new Error("Contract not initialized");
            return await contract.methods.getTenderCreatorTenders(tenderCreatorId).call();
        },

        isTenderActive: async (tenderId) => {
            if (!contract) throw new Error("Contract not initialized");
            return await contract.methods.isTenderActive(tenderId).call();
        },

        // User ID lookups
        getBidderId: async (address) => {
            if (!contract) throw new Error("Contract not initialized");
            return await contract.methods.addressToBidderId(address).call();
        },

        getTenderCreatorId: async (address) => {
            if (!contract) throw new Error("Contract not initialized");
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