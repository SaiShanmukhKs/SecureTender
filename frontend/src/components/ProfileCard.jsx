import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProfileCard = ({ bidder }) => {
  return (
    <Card className="w-full bg-gray-50 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">👤 Bidder Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong> Name:</strong> {bidder.fullName}</p>
        <p><strong> Company:</strong> {bidder.companyName}</p>
        <p><strong> Email:</strong> {bidder.email}</p>
        <p><strong> Phone:</strong> {bidder.phone}</p>
        <p><strong> Rating:</strong> {bidder.rating} / 5</p>
        <p><strong> Address:</strong> {bidder.address}</p>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;