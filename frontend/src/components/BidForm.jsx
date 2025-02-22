import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

function BidForm() {
  const [bid, setBid] = useState({
    companyName: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    tin: "",
    tenderId: "",
    tenderTitle: "",
    bidDate: "",
    amount: "",
    timeline: "",
    paymentTerms: "",
    proposal: "",
    compliance: false,
    bidSecurity: null,
    pastExperience: "",
    agreeTerms: false,
    confirmInfo: false,
    digitalSignature: "",
  });

  const handleChange = (e) => {
    setBid({ ...bid, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setBid({ ...bid, [e.target.name]: e.target.checked });
  };

  const handleFileChange = (e) => {
    setBid({ ...bid, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(bid);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <Card className="max-w-4xl w-full bg-white shadow-xl rounded-xl p-6">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-semibold">
            📝 Bid Submission Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Bidder Information */}
            <section className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-3">🏢 Bidder Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Company Name</Label>
                  <Input name="companyName" value={bid.companyName} onChange={handleChange} required />
                </div>
                <div>
                  <Label>Bidder’s Full Name</Label>
                  <Input name="fullName" value={bid.fullName} onChange={handleChange} required />
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input name="email" type="email" value={bid.email} onChange={handleChange} required />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input name="phone" type="tel" value={bid.phone} onChange={handleChange} required />
                </div>
                <div className="col-span-2">
                  <Label>Company Address</Label>
                  <Textarea name="address" value={bid.address} onChange={handleChange} required />
                </div>
                <div className="col-span-2">
                  <Label>Tax Identification Number (TIN) / Business Registration Number</Label>
                  <Input name="tin" value={bid.tin} onChange={handleChange} required />
                </div>
              </div>
            </section>

            {/* Section 2: Tender Details */}
            <section className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-3">📄 Tender Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tender ID</Label>
                  <Input name="tenderId" value={bid.tenderId} onChange={handleChange} required />
                </div>
                <div>
                  <Label>Tender Title</Label>
                  <Input name="tenderTitle" value={bid.tenderTitle} onChange={handleChange} required />
                </div>
                <div className="col-span-2">
                  <Label>Bid Submission Date</Label>
                  <Input name="bidDate" type="date" value={bid.bidDate} onChange={handleChange} required />
                </div>
              </div>
            </section>

            {/* Section 3: Bid Details */}
            <section className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-3">💰 Bid Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Bid Amount</Label>
                  <Input name="amount" type="number" value={bid.amount} onChange={handleChange} required />
                </div>
                <div>
                  <Label>Delivery Timeline</Label>
                  <Input name="timeline" value={bid.timeline} onChange={handleChange} required />
                </div>
                <div className="col-span-2">
                  <Label>Payment Terms</Label>
                  <Textarea name="paymentTerms" value={bid.paymentTerms} onChange={handleChange} required />
                </div>
              </div>
            </section>

            {/* Section 4: Technical Proposal */}
            <section className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-3">🛠 Technical Proposal</h2>
              <div>
                <Label>Proposed Solution</Label>
                <Textarea name="proposal" value={bid.proposal} onChange={handleChange} required />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Checkbox name="compliance" checked={bid.compliance} onCheckedChange={handleCheckboxChange} />
                <Label>Compliance with Tender Requirements</Label>
              </div>
              <div className="mt-3">
                <Label>Upload Technical Documents</Label>
                <Input name="technicalDocs" type="file" onChange={handleFileChange} />
              </div>
            </section>

            {/* Terms & Declaration */}
            <section className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-3">⚖️ Terms & Declaration</h2>
              <div className="flex items-center gap-2">
                <Checkbox name="confirmInfo" checked={bid.confirmInfo} onCheckedChange={handleCheckboxChange} />
                <Label>I confirm that all information provided is accurate.</Label>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Checkbox name="agreeTerms" checked={bid.agreeTerms} onCheckedChange={handleCheckboxChange} />
                <Label>I agree to the terms and conditions of the tender process.</Label>
              </div>
              <div className="mt-3">
                <Label>Digital Signature / Authorized Representative</Label>
                <Input name="digitalSignature" value={bid.digitalSignature} onChange={handleChange} required />
              </div>
            </section>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-2">
              🚀 Submit Bid
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default BidForm;
