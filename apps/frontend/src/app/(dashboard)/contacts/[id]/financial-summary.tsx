"use client";

import {
  AlertTriangle,
  CreditCard,
  FileText,
  Send,
  TrendingUp,
  Wallet,
} from "lucide-react";

import type { ParentContact } from "./parent-data";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface FinancialSummaryProps {
  parent: ParentContact;
}

export function FinancialSummary({ parent }: FinancialSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-CM", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wallet className="text-primary h-5 w-5" />
            Financial Summary
          </CardTitle>
          {parent.financialContact && (
            <Badge variant="outline" className="gap-1">
              <CreditCard className="h-3 w-3" />
              Billing Contact
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Outstanding Balance */}
        <div
          className={`mb-4 rounded-lg border p-4 ${
            parent.outstandingBalance > 0
              ? "border-destructive/30 bg-destructive/5"
              : "border-success/30 bg-success/5"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {parent.outstandingBalance > 0 ? (
                <AlertTriangle className="text-destructive h-5 w-5" />
              ) : (
                <TrendingUp className="text-success h-5 w-5" />
              )}
              <div>
                <p className="text-muted-foreground text-sm">
                  Outstanding Balance
                </p>
                <p
                  className={`text-xl font-bold ${
                    parent.outstandingBalance > 0
                      ? "text-destructive"
                      : "text-success"
                  }`}
                >
                  {formatCurrency(parent.outstandingBalance)}
                </p>
              </div>
            </div>
            {parent.outstandingBalance > 0 && (
              <Button size="sm" className="gap-1">
                <Send className="h-3 w-3" />
                Send Reminder
              </Button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <p className="text-foreground text-2xl font-bold">3</p>
            <p className="text-muted-foreground text-xs">Active Invoices</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <p className="text-foreground text-2xl font-bold">12</p>
            <p className="text-muted-foreground text-xs">Payments Made</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1 bg-transparent"
          >
            <FileText className="h-4 w-4" />
            View Invoices
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1 bg-transparent"
          >
            <CreditCard className="h-4 w-4" />
            Payment History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
