"use client";
import { Button } from "@repo/ui/components/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "~/auth/client";
import { useRouter } from "~/hooks/use-router";

export function DeleteAuthApiKey({ apiKeyId }: { apiKeyId: string }) {
  const deleteAction = async () => {
    toast.loading("Deleting API key...", { id: 0 });
    const { error } = await authClient.apiKey.delete({
      keyId: apiKeyId,
    });
    if (error) {
      toast.error(error.message, { id: 0 });
    } else {
      // Optionally, you can trigger a refresh or show a success message
      toast.success("API key deleted successfully", { id: 0 });
      router.refresh();
    }
  };
  const router = useRouter();

  return (
    <Button
      onClick={async () => {
        await deleteAction();
      }}
      size={"icon"}
      variant={"ghost"}
    >
      <Trash2 className="size-4" />
    </Button>
  );
}
