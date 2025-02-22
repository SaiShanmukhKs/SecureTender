import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const tenders = [
  { id: "TND001", status: "Open", details: "Construction of a bridge", lastDate: "2025-03-15" },
  { id: "TND002", status: "Closed", details: "Supply of office furniture", lastDate: "2025-02-10" },
  { id: "TND003", status: "Open", details: "Road maintenance", lastDate: "2025-04-01" },
];
 function TenderList() {
  const navigate = useNavigate();
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Details</TableHead>
          <TableHead>Last Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tenders.map((tender) => (
          <TableRow key={tender.id} onClick={() => navigate(`/Tenders/${tender.id}`)} className="cursor-pointer hover:bg-gray-100">
            <TableCell>{tender.id}</TableCell>
            <TableCell>{tender.status}</TableCell>
            <TableCell>{tender.details}</TableCell>
            <TableCell>{tender.lastDate}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default TenderList;
