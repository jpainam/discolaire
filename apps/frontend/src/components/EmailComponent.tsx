"use client";

import { useState } from "react";
import { CheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { authClient } from "~/auth/client";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

interface EmailVerificationProps {
  email: string;
  isVerified: boolean;
}

export default function EmailVerification({
  email,
  isVerified,
}: EmailVerificationProps) {
  const [isLoading, setIsLoading] = useState(false);

  const t = useTranslations();
  const [verificationSent, setVerificationSent] = useState(false);

  const sendVerificationEmail = async () => {
    try {
      setIsLoading(true);
      const { error } = await authClient.sendVerificationEmail({ email });

      if (error) {
        toast.error(error.message);
        setIsLoading(false);
        return;
      }

      setVerificationSent(true);
      toast.message(t("Verification email sent"), {
        description: t(
          "Please check your inbox and follow the link to verify your email",
        ),
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
      <div className="flex flex-1 items-center gap-2">
        <span className="font-medium">{email}</span>
        {!isVerified && !verificationSent && (
          <Badge variant="outline" className="gap-1.5">
            <span
              className="size-1.5 rounded-full bg-red-500"
              aria-hidden="true"
            ></span>
            Not verified
          </Badge>
        )}
        {!isVerified && verificationSent && (
          <Badge variant="outline" className="gap-1.5">
            <CheckIcon className="bg-amber-500" size={12} aria-hidden="true" />
            Verification sent
          </Badge>
          // <Badge
          //   variant="outline"
          //   className="text-xs font-normal text-blue-500 border-blue-200 bg-blue-50"
          // >
          //   <AlertCircle className="h-3 w-3 mr-1" />
          //   Verification sent
          // </Badge>
        )}
        {isVerified && (
          <Badge variant="outline" className="gap-1">
            <CheckIcon
              className="text-emerald-500"
              size={12}
              aria-hidden="true"
            />
            {t("Verified")}
          </Badge>
          // <Badge
          //   variant="outline"
          //   className="text-xs font-normal text-emerald-500 border-emerald-200 bg-emerald-50"
          // >
          //   <CheckCircle className="h-3 w-3 mr-1" />
          //Verified
          // </Badge>
        )}
      </div>
      {!isVerified && !verificationSent && (
        <Button
          variant="link"
          size="sm"
          onClick={sendVerificationEmail}
          disabled={isLoading}
          className="h-7 text-xs"
        >
          {isLoading ? "Sending..." : t("Verify email")}
        </Button>
      )}
      {!isVerified && verificationSent && (
        <Button
          variant="ghost"
          size="sm"
          onClick={sendVerificationEmail}
          disabled={isLoading}
          className="h-7 text-xs"
        >
          Resend
        </Button>
      )}
    </div>
  );
}
