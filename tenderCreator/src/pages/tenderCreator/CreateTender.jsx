import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TenderContext } from '../../context/TenderContext';
import { useBlockchainTendering } from '../../context/ContractContext';

const CreateTender = () => {
    const { addTender } = useContext(TenderContext);
    const { createTender, toWei } = useBlockchainTendering();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [tender, setTender] = useState({
        title: "",
        rfp: "",
        startDate: "",
        endDate: "",
        tenderFee: "",
        registrationFee: "",
        moneyDispersalPhases: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTender({
            ...tender,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Convert date inputs to timestamps
            const startTimestamp = Math.floor(new Date(tender.startDate).getTime() / 1000);
            const endTimestamp = Math.floor(new Date(tender.endDate).getTime() / 1000);

            // Validate dates
            if (startTimestamp >= endTimestamp) {
                throw new Error("End date must be after start date");
            }

            // Convert fees to Wei
            const tenderFeeWei = toWei(tender.tenderFee);
            const registrationFeeWei = toWei(tender.registrationFee);

            console.log("Creating tender with parameters:", {
                title: tender.title,
                rfp: tender.rfp,
                startDate: startTimestamp,
                endDate: endTimestamp,
                tenderFee: tenderFeeWei,
                registrationFee: registrationFeeWei,
                phases: parseInt(tender.moneyDispersalPhases)
            });

            // Call the blockchain function
            const result = await createTender(
                tender.title,
                tender.rfp,
                startTimestamp,
                endTimestamp,
                tenderFeeWei,
                registrationFeeWei,
                parseInt(tender.moneyDispersalPhases)
            );

            console.log("Transaction result:", result);

            // Add to local context if needed
            // addTender({
            //     ...tender,
            //     startDate: startTimestamp,
            //     endDate: endTimestamp
            // });

            navigate("/all-tenders");
        } catch (error) {
            console.error("Error creating tender:", error);
            setError(error.message || "Failed to create tender");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="create-tender max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Create New Tender</h1>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                    <p>{error}</p>
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-group">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Tender Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={tender.title}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="rfp" className="block text-sm font-medium text-gray-700">Request for Proposal (RFP)</label>
                    <textarea
                        id="rfp"
                        name="rfp"
                        value={tender.rfp}
                        onChange={handleChange}
                        required
                        rows="6"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input
                            type="datetime-local"
                            id="startDate"
                            name="startDate"
                            value={tender.startDate}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                        <input
                            type="datetime-local"
                            id="endDate"
                            name="endDate"
                            value={tender.endDate}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                        <label htmlFor="tenderFee" className="block text-sm font-medium text-gray-700">Tender Fee (ETH)</label>
                        <input
                            type="number"
                            id="tenderFee"
                            name="tenderFee"
                            value={tender.tenderFee}
                            onChange={handleChange}
                            required
                            step="0.000000000000000001"
                            min="0"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <p className="mt-1 text-sm text-gray-500">Fee required to place a bid</p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="registrationFee" className="block text-sm font-medium text-gray-700">Registration Fee (ETH)</label>
                        <input
                            type="number"
                            id="registrationFee"
                            name="registrationFee"
                            value={tender.registrationFee}
                            onChange={handleChange}
                            required
                            step="0.000000000000000001"
                            min="0"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <p className="mt-1 text-sm text-gray-500">Fee required to register for the tender</p>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="moneyDispersalPhases" className="block text-sm font-medium text-gray-700">Money Dispersal Phases</label>
                    <input
                        type="number"
                        id="moneyDispersalPhases"
                        name="moneyDispersalPhases"
                        value={tender.moneyDispersalPhases}
                        onChange={handleChange}
                        required
                        min="1"
                        max="10"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">Number of phases in which payment will be released to the winner</p>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                    {isSubmitting ? 'Creating...' : 'Create Tender'}
                </button>
            </form>
        </div>
    );
};

export default CreateTender;