"use client";

import { Alert, AlertDescription } from "@repo/ui/components/alert";
import { Button } from "@repo/ui/components/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { AlertTriangle, Check, Copy, Key } from "lucide-react";
import { useState } from "react";
import { authClient } from "~/auth/client";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
export function CreateAuthApiKey() {
  const { t } = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  const { openModal } = useModal();

  const createApiKey = async () => {
    setIsLoading(true);
    const { data: apiKey, error } = await authClient.apiKey.create({
      name: "Discolaire API Key",
      //expiresIn: 60 * 60 * 24 * 7, // Omit for never expiring key
      prefix: "disc",
    });
    if (!error) {
      openModal({
        title: t("Error creating API key"),
        view: <ShowApiKey apiKey={apiKey.key} />,
      });
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  };
  return (
    <Button
      isLoading={isLoading}
      onClick={async () => {
        await createApiKey();
      }}
      size={"sm"}
    >
      {t("Create api key")}
    </Button>
  );
}

function ShowApiKey({ apiKey }: { apiKey: string }) {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        //closeModal();
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  //const { closeModal } = useModal();
  return (
    <div>
      <div className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Your API Key
          </DialogTitle>
          <DialogDescription>
            Copy your API key and store it securely. You won't be able to see it
            again.
          </DialogDescription>
        </DialogHeader>

        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Important:</strong> This API key will only be shown once.
            Make sure to copy and store it securely before closing this dialog.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="api-key"
              value={apiKey}
              readOnly
              className="font-mono text-sm"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              className="shrink-0 bg-transparent"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">Copy API key</span>
            </Button>
          </div>
          {copied && (
            <p className="text-sm text-green-600 flex items-center gap-1">
              <Check className="h-3 w-3" />
              Copied to clipboard!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
