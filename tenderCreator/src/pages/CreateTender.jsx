import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TenderContext } from '../context/TenderContext';

const CreateTender = () => {
    const { addTender } = useContext(TenderContext);
    const navigate = useNavigate();
    const [tender, setTender] = useState({
        title: "",
        description: "",
        deadline: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTender({
            ...tender,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addTender(tender);
        navigate("/all-tenders");
    };

    return (
        <div className="create-tender">
            <h1>Create New Tender</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Tender Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={tender.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={tender.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="deadline">Submission Deadline</label>
                    <input
                        type="date"
                        id="deadline"
                        name="deadline"
                        value={tender.deadline}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">Create Tender</button>
            </form>
        </div>
    );
};

export default CreateTender;