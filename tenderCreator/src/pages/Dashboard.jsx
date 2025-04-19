import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { TenderContext } from '../context/TenderContext';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';

const Dashboard = () => {
    const { tenders } = useContext(TenderContext);

    const openTenders = tenders.filter(tender => tender.status === "Open").length;
    const awardedTenders = tenders.filter(tender => tender.status === "Awarded").length;

    return (
        <div className="dashboard">
            <h1>Tender Management Dashboard</h1>
            <div className="dashboard-stats">
                <StatCard
                    title="Open Tenders"
                    value={openTenders}
                    linkText="View All"
                    linkTo="/all-tenders"
                />
                <StatCard
                    title="Awarded Tenders"
                    value={awardedTenders}
                    linkText="View All"
                    linkTo="/awarded-tenders"
                />
                <StatCard
                    title="Total Tenders"
                    value={tenders.length}
                    linkText="Create New"
                    linkTo="/create"
                />
            </div>

            <div className="recent-tenders">
                <h2>Recent Tenders</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Deadline</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tenders.slice(0, 5).map(tender => (
                            <tr key={tender.id}>
                                <td>{tender.id}</td>
                                <td>{tender.title}</td>
                                <td>{tender.deadline}</td>
                                <td><StatusBadge status={tender.status} /></td>
                                <td>
                                    <Link to={`/tender/${tender.id}`} className="btn btn-view">View</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;