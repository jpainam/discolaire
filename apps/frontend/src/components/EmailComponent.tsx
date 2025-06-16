"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "~/auth/client";

interface EmailVerificationProps {
  email: string;
  isVerified: boolean;
}

export default function EmailVerification({
  email,
  isVerified,
}: EmailVerificationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const sendVerificationEmail = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await authClient.sendVerificationEmail({ email });
      if (error) {
        toast.error(error.message);
        return;
      }
      console.log("Verification email status:", data);
      setVerificationSent(true);
      toast.message("Verification email sent", {
        description:
          "Please check your inbox and follow the link to verify your email.",
      });

      setIsLoading(false);
    } catch (error) {
      console.log("Using mock verification flow");
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to send verification email",
      );
    }
  };

  return (
    <div className="flex items-center gap-2 py-1">
      <div className="flex-1 flex items-center gap-2">
        <span className="font-medium">{email}</span>
        {!isVerified && !verificationSent && (
          <Badge variant="outline" className="gap-1.5 ">
            <span
              className="size-1.5 rounded-full bg-red-500 "
              aria-hidden="true"
            ></span>
            Not verified
          </Badge>
        )}
        {!isVerified && verificationSent && (
          <Badge
            variant="outline"
            className="text-xs font-normal text-blue-500 border-blue-200 bg-blue-50"
          >
            <AlertCircle className="h-3 w-3 mr-1" />
            Verification sent
          </Badge>
        )}
        {isVerified && (
          <Badge
            variant="outline"
            className="text-xs font-normal text-emerald-500 border-emerald-200 bg-emerald-50"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )}
      </div>
      {!isVerified && !verificationSent && (
        <Button
          variant="link"
          size="sm"
          onClick={sendVerificationEmail}
          disabled={isLoading}
          className="text-xs h-7"
        >
          {isLoading ? "Sending..." : "Verify email"}
        </Button>
      )}
      {!isVerified && verificationSent && (
        <Button
          variant="ghost"
          size="sm"
          onClick={sendVerificationEmail}
          disabled={isLoading}
          className="text-xs h-7"
        >
          Resend
        </Button>
      )}
    </div>
  );
}
