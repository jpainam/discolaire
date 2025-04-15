"use client";

import { Globe, Lock } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Label } from "@repo/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Switch } from "@repo/ui/components/switch";
import { UserAppearance } from "./UserAppearance";

export default function Page() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [autoLogout, setAutoLogout] = useState("30");
  const [language, setLanguage] = useState("english");
  const [timeZone, setTimeZone] = useState("UTC");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [firstDayOfWeek, setFirstDayOfWeek] = useState("sunday");

  useEffect(() => {
    console.log("Current settings:", {
      twoFactorEnabled,
      autoLogout,
      language,
      timeZone,
      dateFormat,
      firstDayOfWeek,
    });
  }, [
    twoFactorEnabled,
    autoLogout,
    language,
    timeZone,
    dateFormat,
    firstDayOfWeek,
  ]);

  return (
    <div className="container mx-auto p-4">
      <div className="space-y-8">
        <UserAppearance />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Account & Security
            </CardTitle>
            <CardDescription>
              Manage your account security settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-y-0">
              <div className="space-y-0.5">
                <Label htmlFor="two-factor">
                  Two-Factor Authentication (2FA)
                </Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account.
                </p>
              </div>
              <Switch
                id="two-factor"
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
              />
            </div>

            <div className="space-y-2">
              <Label>Login Devices / Sessions</Label>
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      Current Device - Chrome on Windows
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Last active: Just now
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Current
                  </Button>
                </div>
              </div>
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mobile App - iOS</p>
                    <p className="text-sm text-muted-foreground">
                      Last active: 2 hours ago
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Revoke
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="auto-logout">Auto-Logout Timer</Label>
              <Select value={autoLogout} onValueChange={setAutoLogout}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeout duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Language & Region
            </CardTitle>
            <CardDescription>
              Set your language and regional preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="language">Preferred Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="german">German</SelectItem>
                  <SelectItem value="chinese">Chinese</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Time Zone</Label>
              <Select value={timeZone} onValueChange={setTimeZone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">
                    UTC (Coordinated Universal Time)
                  </SelectItem>
                  <SelectItem value="EST">
                    EST (Eastern Standard Time)
                  </SelectItem>
                  <SelectItem value="CST">
                    CST (Central Standard Time)
                  </SelectItem>
                  <SelectItem value="PST">
                    PST (Pacific Standard Time)
                  </SelectItem>
                  <SelectItem value="GMT">GMT (Greenwich Mean Time)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-format">Date Format</Label>
              <RadioGroup
                value={dateFormat}
                onValueChange={setDateFormat}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="MM/DD/YYYY" id="date-mdy" />
                  <Label htmlFor="date-mdy">MM/DD/YYYY</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="DD/MM/YYYY" id="date-dmy" />
                  <Label htmlFor="date-dmy">DD/MM/YYYY</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="first-day">First Day of Week</Label>
              <RadioGroup
                value={firstDayOfWeek}
                onValueChange={setFirstDayOfWeek}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sunday" id="day-sunday" />
                  <Label htmlFor="day-sunday">Sunday</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monday" id="day-monday" />
                  <Label htmlFor="day-monday">Monday</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
