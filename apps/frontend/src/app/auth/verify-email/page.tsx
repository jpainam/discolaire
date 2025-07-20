import { ArrowRight, CheckCircle, Home } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-4 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Email Verified!
          </CardTitle>
          <CardDescription className="mt-2 text-gray-600">
            Your email address has been successfully verified. You can now
            access all features of your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
              <p className="text-sm text-green-800">
                Your account is now fully activated and ready to use.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Button className="w-full" size="lg">
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              Continue Setup
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="pt-4 text-center">
            <p className="text-sm text-gray-500">
              Need help?{" "}
              <a
                href="#"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Contact Support
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
