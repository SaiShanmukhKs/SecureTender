import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BidsList = ({ bids }) => {
  return (
    <Card className="w-full bg-gray-50 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">📜 Bids Placed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 overflow-y-auto border rounded-lg p-2 bg-white">
          {bids.length === 0 ? (
            <p className="text-gray-500">No bids placed yet.</p>
          ) : (
            <ul className="space-y-3">
              {bids.map((bid, index) => (
                <li key={index} className="p-2 border rounded-lg bg-gray-100">
                  <p><strong> Tender:</strong> {bid.tenderTitle} ({bid.tenderId})</p>
                  <p><strong> Amount:</strong> ${bid.amount}</p>
                  <p><strong> Submitted:</strong> {bid.bidDate}</p>
                  <p><strong> Timeline:</strong> {bid.timeline}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BidsList;