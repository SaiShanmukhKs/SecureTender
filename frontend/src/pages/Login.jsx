import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

function Login() {
  return (
    <Tabs defaultValue="bidder" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="bidder">Bidder Login</TabsTrigger>
        <TabsTrigger value="tender-owner">Tender Owner Login</TabsTrigger>
      </TabsList>
      
      {/* Bidder Login */}
      <TabsContent value="bidder">
        <Card>
          <CardHeader>
            <CardTitle>Bidder Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the bidder portal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="bidder-email">Email</Label>
              <Input id="bidder-email" type="email" placeholder="Enter your email" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="bidder-password">Password</Label>
              <Input id="bidder-password" type="password" placeholder="Enter your password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Login</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      {/* Tender Owner Login */}
      <TabsContent value="tender-owner">
        <Card>
          <CardHeader>
            <CardTitle>Tender Owner Login</CardTitle>
            <CardDescription>
              Enter your credentials to manage tenders.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="owner-email">Email</Label>
              <Input id="owner-email" type="email" placeholder="Enter your email" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="owner-password">Password</Label>
              <Input id="owner-password" type="password" placeholder="Enter your password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Login</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
export default Login;