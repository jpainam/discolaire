import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { ArrowRight, CheckCircle, Home } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Email Verified!
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Your email address has been successfully verified. You can now
            access all features of your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-800">
                Your account is now fully activated and ready to use.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Button className="w-full" size="lg">
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              Continue Setup
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-500">
              Need help?{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-800 underline"
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
