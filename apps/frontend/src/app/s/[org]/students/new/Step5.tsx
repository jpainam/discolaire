"use client";

import { Check } from "lucide-react";

import { Badge } from "@repo/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Separator } from "@repo/ui/components/separator";

export function Step5() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Check className="h-5 w-5" />
          Review & Submit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Student Information</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Name:</strong> {"First Name"} {"Last Name"}
              </p>
              <p>
                <strong>Date of Birth:</strong> {"YYYY-MM-DD"}
              </p>
              <p>
                <strong>Gender:</strong> {"MALE"}
              </p>
              <p>
                <strong>Nationality:</strong> {"Country Name"}
              </p>
              <p>
                <strong>Grade Level:</strong> {"Siexieme"}
              </p>
              <p>
                <strong>Section:</strong> {"Section Name"}
              </p>
              <p>
                <strong>Status:</strong> {"Active"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Phone:</strong> {"+1234567890"}
              </p>
              <p>
                <strong>Email:</strong> {"email"}
              </p>
              <p>
                <strong>Address:</strong> {"residence"}
              </p>
              <p>
                <strong>City:</strong> {"Ville"}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Parents/Guardians (3)</h3>
          {[1, 2, 3].length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[1, 2, 3].map((parent) => (
                <div key={parent} className="rounded-lg border bg-gray-50 p-3">
                  <p className="font-medium">Mr Dupont Pierre</p>
                  <p className="text-muted-foreground text-sm">Pere adoptif</p>
                  <p className="text-muted-foreground text-sm">Phone 1</p>
                  <p className="text-muted-foreground text-sm">Email</p>
                  {/* {parent.emergencyContact && ( */}
                  <Badge variant="secondary" className="mt-1 text-xs">
                    Emergency Contact
                  </Badge>
                  {/* )} */}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No parents/guardians added yet.</p>
          )}
        </div>

        {/* {studentData.observation && (
          <>
            <Separator />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Additional Notes</h3>
              <p className="text-sm">{studentData.observation}</p>
            </div>
          </>
        )} */}
      </CardContent>
    </Card>
  );
}
