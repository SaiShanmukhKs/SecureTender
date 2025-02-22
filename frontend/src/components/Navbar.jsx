import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Tenders from "@/pages/Tenders";

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();


  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-lg">
      <h1 className="text-xl font-semibold">Bidder Dashboard</h1>
      <div className="space-x-4">
      <Button variant="ghost" className="text-white" onClick={() => navigate("/bidderHome")}>
          Home
        </Button>
        <Button variant="ghost" className="text-white" onClick={() => navigate("/Tenders")}>
          View Open Tenders
        </Button>
        <Button variant="ghost" className="text-white" onClick={() => navigate("/TendersWon")}>
          Tenders Won
        </Button>
        
        <Button variant="destructive" onClick={onLogout}>Logout</Button>
      </div>
    </nav>
  );
};

export default Navbar;
