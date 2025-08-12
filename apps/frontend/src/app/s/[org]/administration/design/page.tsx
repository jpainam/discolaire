import {
  AlertTriangle,
  BellRing,
  Calendar,
  Check,
  CreditCard,
  FileWarning,
  HelpCircle,
  Info,
  ShieldAlert,
  Wallet,
  X,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";

import { CardStats } from "~/components/administration/CardStats";
import { BusinessMetrics } from "./business-metrics";
import List01 from "./list-01";
import List02 from "./list-02";
import List03 from "./list-03";

export default function Page() {
  return (
    <div className="grid gap-4 p-4">
      <CardStats />
      <BusinessMetrics />
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 dark:border-[#1F1F23] dark:bg-[#0F0F12]">
            <h2 className="mb-4 flex items-center gap-2 text-left text-lg font-bold text-gray-900 dark:text-white">
              <Wallet className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-50" />
              Accounts
            </h2>
            <div className="flex-1">
              <List01 className="h-full" />
            </div>
          </div>
          <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 dark:border-[#1F1F23] dark:bg-[#0F0F12]">
            <h2 className="mb-4 flex items-center gap-2 text-left text-lg font-bold text-gray-900 dark:text-white">
              <CreditCard className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-50" />
              Recent Transactions
            </h2>
            <div className="flex-1">
              <List02 className="h-full" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-start rounded-xl border border-gray-200 bg-white p-6 dark:border-[#1F1F23] dark:bg-[#0F0F12]">
          <h2 className="mb-4 flex items-center gap-2 text-left text-lg font-bold text-gray-900 dark:text-white">
            <Calendar className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-50" />
            Upcoming Events
          </h2>
          <List03 />
        </div>
      </div>
      <div className="w-[450px] space-y-4">
        <Alert
          className={cn(
            "border-green-500/50 bg-green-500/10 text-green-600",
            "dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400",
          )}
        >
          <Check className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Your payment has been successfully processed.
          </AlertDescription>
        </Alert>

        <Alert
          className={cn(
            "border-blue-500/50 bg-blue-500/10 text-blue-600",
            "dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400",
          )}
        >
          <Info className="h-4 w-4" />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            Your trial period will end in 7 days.
          </AlertDescription>
        </Alert>

        <Alert
          className={cn(
            "border-amber-500/50 bg-amber-500/10 text-amber-600",
            "dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400",
          )}
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Attention needed</AlertTitle>
          <AlertDescription>
            Please complete your profile to access all features.
          </AlertDescription>
        </Alert>
      </div>
      <div className="w-[450px] space-y-4">
        <Alert className="relative pr-10">
          <Info className="h-4 w-4" />
          <AlertTitle>Information Alert</AlertTitle>
          <AlertDescription>
            This alert can be dismissed using the close button.
          </AlertDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 h-7 w-7 p-0 opacity-70 hover:opacity-100"
            onClick={() =>
              alert(
                "Close button clicked! In a real app, this would dismiss the alert.",
              )
            }
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Close</span>
          </Button>
        </Alert>

        <Alert variant="destructive" className="relative pr-10">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning Alert</AlertTitle>
          <AlertDescription>
            This warning alert can also be dismissed.
          </AlertDescription>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive-foreground/70 hover:text-destructive-foreground absolute top-1 right-1 h-7 w-7 p-0"
            onClick={() =>
              alert(
                "Close button clicked! In a real app, this would dismiss the alert.",
              )
            }
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Close</span>
          </Button>
        </Alert>
      </div>
      <div className="w-[450px] space-y-2">
        <Alert className="px-3 py-2">
          <Info className="h-3.5 w-3.5" />
          <AlertTitle className="text-sm leading-none">
            Your trial ends in 7 days
          </AlertTitle>
        </Alert>

        <Alert variant="destructive" className="px-3 py-2">
          <AlertTriangle className="h-3.5 w-3.5" />
          <AlertTitle className="text-sm leading-none">
            Disk space almost full
          </AlertTitle>
        </Alert>

        <Alert className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center">
            <Check className="h-3.5 w-3.5" />
            <AlertTitle className="text-sm leading-none">
              Profile updated
            </AlertTitle>
          </div>
          <Badge variant="outline" className="ml-2 h-5 text-xs">
            New
          </Badge>
        </Alert>
      </div>
      <div className="w-[450px] space-y-4">
        <Alert>
          <FileWarning className="h-4 w-4" />
          <AlertTitle>Update Available</AlertTitle>
          <AlertDescription>
            <p className="mb-3">
              A new software update is available. Update now for the latest
              features and security improvements.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" className="h-8">
                Update Now
              </Button>
              <Button size="sm" variant="outline" className="h-8">
                Later
              </Button>
            </div>
          </AlertDescription>
        </Alert>

        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Security Alert</AlertTitle>
          <AlertDescription>
            <p className="mb-3">
              Multiple login attempts detected from an unknown device. Verify
              it's you or secure your account.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="destructive" className="h-8">
                Secure Account
              </Button>
              <Button size="sm" variant="outline" className="h-8">
                It's Me
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
      <Alert className="w-[450px]">
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app using the cli.
        </AlertDescription>
      </Alert>
      <Alert className="w-[450px]">
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app using the cli.
        </AlertDescription>
      </Alert>
      <div className="w-[450px] space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Default Alert</AlertTitle>
          <AlertDescription>
            This is the default alert style with neutral styling.
          </AlertDescription>
        </Alert>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Destructive Alert</AlertTitle>
          <AlertDescription>
            This alert uses a more attention-grabbing destructive style for
            warnings and errors.
          </AlertDescription>
        </Alert>
      </div>
      <div className="w-[450px] space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            General information that is neutral in nature.
          </AlertDescription>
        </Alert>

        <Alert>
          <HelpCircle className="h-4 w-4" />
          <AlertTitle>Tip</AlertTitle>
          <AlertDescription>
            Helpful advice and tips for better experience.
          </AlertDescription>
        </Alert>

        <Alert>
          <Check className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Operation completed successfully.</AlertDescription>
        </Alert>

        <Alert>
          <BellRing className="h-4 w-4" />
          <AlertTitle>Notification</AlertTitle>
          <AlertDescription>
            You have 3 unread messages in your inbox.
          </AlertDescription>
        </Alert>

        <Alert variant="destructive">
          <X className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Something went wrong. Please try again.
          </AlertDescription>
        </Alert>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Your session is about to expire in 5 minutes.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
