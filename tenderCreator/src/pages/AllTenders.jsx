import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { TenderContext } from '../context/TenderContext';
import StatusBadge from '../components/StatusBadge';

const AllTenders = () => {
    const { tenders } = useContext(TenderContext);

    return (
        <div className="all-tenders">
            <h1>All Tenders</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Deadline</th>
                        <th>Status</th>
                        <th>Bidders</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tenders.map(tender => (
                        <tr key={tender.id}>
                            <td>{tender.id}</td>
                            <td>{tender.title}</td>
                            <td>{tender.deadline}</td>
                            <td><StatusBadge status={tender.status} /></td>
                            <td>{tender.bidders.length}</td>
                            <td>
                                <Link to={`/tender/${tender.id}`} className="btn btn-view">View</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AllTenders;