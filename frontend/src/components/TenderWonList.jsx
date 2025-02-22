import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const tendersData = [
  { id: "TND001", name: "Road Construction", organization: "Govt. of Telangana", totalAmount: "₹5,00,00,000" },
  { id: "TND002", name: "Bridge Renovation", organization: "NHAI", totalAmount: "₹8,00,00,000" },
];

const TendersWonList = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tenders Won</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tendersData.map((tender) => (
          <Card key={tender.id} className="p-4 cursor-pointer" onClick={() => navigate(`/TendersWon/${tender.id}`)}>
            <CardContent>
              <h2 className="text-xl font-semibold">{tender.name}</h2>
              <p className="text-gray-600">{tender.organization}</p>
              <p className="text-gray-800 font-medium">Amount: {tender.totalAmount}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TendersWonList;
