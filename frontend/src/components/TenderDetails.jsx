import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const tenders = {
  TND001: {
    id: "TND001",
    title: "Construction of a New Bridge",
    description: "Build a 500m bridge using high-strength concrete.",
    budget: "$5,000,000",
    lastDate: "2025-03-15",
  },
  TND002: {
    id: "TND002",
    title: "Supply of Office Furniture",
    description: "Supply and installation of ergonomic desks and chairs.",
    budget: "$200,000",
    lastDate: "2025-02-10",
  },
};

function TenderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tender = tenders[id];

  if (!tender) return <p className="text-center text-red-500">Tender not found.</p>;

  return (
    <div className="p-6 bg-white shadow-lg max-w-2xl mx-auto rounded">
      <h1 className="text-2xl font-bold">{tender.title}</h1>
      <p>{tender.description}</p>
      <p><strong>Budget:</strong> {tender.budget}</p>
      <p><strong>Last Date:</strong> {tender.lastDate}</p>

      <Button className="mt-4 bg-blue-600 text-white" onClick={() => navigate(`/BidFormSub/${id}`)}>
        📝 Bid Now
      </Button>
    </div>
  );
}

export default TenderDetails;
