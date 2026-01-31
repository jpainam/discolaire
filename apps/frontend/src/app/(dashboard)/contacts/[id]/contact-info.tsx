"use client";

import {
  Clock,
  Copy,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import type { ParentContact } from "./parent-data";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface ContactInfoProps {
  parent: ParentContact;
}

export function ContactInfo({ parent }: ContactInfoProps) {
  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Phone className="text-primary h-5 w-5" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Emails */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Mail className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground text-sm font-medium">
              Email Addresses
            </span>
          </div>
          <div className="space-y-2 pl-6">
            <div className="group flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate font-medium">
                  {parent.primaryEmail}
                </p>
                <Badge variant="outline" className="mt-1 text-xs">
                  Primary
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => copyToClipboard(parent.primaryEmail)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            {parent.secondaryEmail && (
              <div className="group flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate">
                    {parent.secondaryEmail}
                  </p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    Secondary
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => copyToClipboard(parent.secondaryEmail)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Phone Numbers */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Phone className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground text-sm font-medium">
              Phone Numbers
            </span>
          </div>
          <div className="space-y-2 pl-6">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-foreground font-medium">{parent.phone1}</p>
                <Badge variant="outline" className="mt-1 text-xs">
                  Primary
                </Badge>
              </div>
              <Button variant="outline" size="sm">
                <Phone className="mr-1 h-3 w-3" />
                Call
              </Button>
            </div>
            {parent.phone2 && (
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-foreground">{parent.phone2}</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    Secondary
                  </Badge>
                </div>
                <Button variant="outline" size="sm">
                  <Phone className="mr-1 h-3 w-3" />
                  Call
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* WhatsApp */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <MessageCircle className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground text-sm font-medium">
              WhatsApp
            </span>
          </div>
          <div className="pl-6">
            <div className="flex items-center justify-between gap-2">
              <p className="text-foreground font-medium">{parent.whatsapp}</p>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 bg-transparent"
              >
                <ExternalLink className="h-3 w-3" />
                Open
              </Button>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <MapPin className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground text-sm font-medium">
              Addresses
            </span>
          </div>
          <div className="space-y-3 pl-6">
            <div>
              <Badge variant="outline" className="mb-1 text-xs">
                Home
              </Badge>
              <p className="text-foreground text-sm">{parent.homeAddress}</p>
            </div>
            <div>
              <Badge variant="outline" className="mb-1 text-xs">
                Work
              </Badge>
              <p className="text-foreground text-sm">{parent.workAddress}</p>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="border-border border-t pt-3">
          <div className="mb-3 flex items-center gap-2">
            <Clock className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground text-sm font-medium">
              Contact Preferences
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-muted-foreground text-xs">Preferred Method</p>
              <p className="text-foreground font-medium">
                {parent.preferredContactMethod}
              </p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-muted-foreground text-xs">Best Time</p>
              <p className="text-foreground text-sm font-medium">
                {parent.preferredContactTime}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
