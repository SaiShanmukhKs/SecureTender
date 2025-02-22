import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const tendersData = {
  TND001: {
    name: "Road Construction",
    organization: "Govt. of Telangana",
    totalAmount: "₹5,00,00,000",
    startDate: "2025-03-01",
    endDate: "2026-03-01",
    phases: [
      { name: "Planning", deadline: "2025-04-01", amount: "₹50,00,000" },
      { name: "Execution", deadline: "2025-10-01", amount: "₹3,00,00,000" },
      { name: "Finalization", deadline: "2026-02-01", amount: "₹1,50,00,000" },
    ],
  },
  TND002: {
    name: "Bridge Renovation",
    organization: "NHAI",
    totalAmount: "₹8,00,00,000",
    startDate: "2025-05-01",
    endDate: "2026-05-01",
    phases: [
      { name: "Survey", deadline: "2025-06-01", amount: "₹80,00,000" },
      { name: "Construction", deadline: "2025-12-01", amount: "₹5,00,00,000" },
      { name: "Inspection", deadline: "2026-04-01", amount: "₹2,20,00,000" },
    ],
  },
};

const TenderWonDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const tender = tendersData[id];

  if (!tender) return <p className="p-6 text-red-500">Tender not found!</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">{tender.name} - Details</h2>
      <p>Client: {tender.organization}</p>
      <p>Total Amount: {tender.totalAmount}</p>
      <p>Start Date: {tender.startDate}</p>
      <p>End Date: {tender.endDate}</p>
      <h3 className="mt-4 text-lg font-semibold">Project Timeline</h3>
      <ul className="list-disc pl-5">
        {tender.phases.map((phase, index) => (
          <li key={index}>
            {phase.name} - Deadline: {phase.deadline}, Amount: {phase.amount}
          </li>
        ))}
      </ul>
      <Button className="mt-4" onClick={() => navigate(-1)}>Back</Button>
    </div>
  );
};

export default TenderWonDescription;
