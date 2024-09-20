import { CheckCircle } from "lucide-react";

import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Password Reset Successful
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Your password has been successfully reset. You can now log in with
            your new password.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full">Go to Login</Button>
          <Button variant="outline" className="w-full">
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
