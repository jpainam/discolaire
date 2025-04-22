"use client";

import type React from "react";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import {
  BellIcon as BrandTelegram,
  ExternalLink,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
  Plus,
} from "lucide-react";
import { useState } from "react";

interface Channel {
  id: string;
  name: string;
  type: "whatsapp" | "sms" | "email" | "telegram" | "other";
  icon: React.ReactNode;
  url: string;
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

export function CommunicationChannelList() {
  const [channels, setChannels] = useState<Channel[]>([
    {
      id: "1",
      name: "Marketing Team",
      type: "whatsapp",
      icon: <MessageSquare className="h-5 w-5 text-green-500" />,
      url: "https://web.whatsapp.com/",
      unreadCount: 3,
      lastMessage: "When is the next meeting?",
      lastMessageTime: "10:30 AM",
    },
    {
      id: "2",
      name: "Customer Support",
      type: "sms",
      icon: <Phone className="h-5 w-5 text-blue-500" />,
      url: "https://messages.google.com/",
      unreadCount: 0,
      lastMessage: "Issue resolved. Thank you!",
      lastMessageTime: "Yesterday",
    },
    {
      id: "3",
      name: "Project Updates",
      type: "email",
      icon: <Mail className="h-5 w-5 text-purple-500" />,
      url: "https://mail.google.com/",
      unreadCount: 5,
      lastMessage: "New design files attached",
      lastMessageTime: "2 days ago",
    },
  ]);

  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelType, setNewChannelType] =
    useState<Channel["type"]>("whatsapp");
  const [newChannelUrl, setNewChannelUrl] = useState("");
  const [isAddChannelOpen, setIsAddChannelOpen] = useState(false);

  const handleAddChannel = () => {
    if (!newChannelName.trim() || !newChannelUrl.trim()) return;

    const newChannel: Channel = {
      id: `${channels.length + 1}`,
      name: newChannelName,
      type: newChannelType,
      icon: getChannelIcon(newChannelType),
      url: newChannelUrl,
      unreadCount: 0,
    };

    setChannels([...channels, newChannel]);
    setNewChannelName("");
    setNewChannelType("whatsapp");
    setNewChannelUrl("");
    setIsAddChannelOpen(false);
  };

  const handleChannelClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const getChannelIcon = (type: Channel["type"]) => {
    switch (type) {
      case "whatsapp":
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case "sms":
        return <Phone className="h-5 w-5 text-blue-500" />;
      case "email":
        return <Mail className="h-5 w-5 text-purple-500" />;
      case "telegram":
        return <BrandTelegram className="h-5 w-5 text-blue-400" />;
      default:
        return <MessageCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Channels</h2>
        <Dialog open={isAddChannelOpen} onOpenChange={setIsAddChannelOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Channel
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Channel</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="channel-name">Channel Name</Label>
                <Input
                  id="channel-name"
                  placeholder="Enter channel name"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="channel-type">Channel Type</Label>
                <Select
                  value={newChannelType}
                  onValueChange={(value) =>
                    setNewChannelType(value as Channel["type"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select channel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="telegram">Telegram</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="channel-url">Channel URL</Label>
                <Input
                  id="channel-url"
                  placeholder="https://example.com"
                  value={newChannelUrl}
                  onChange={(e) => setNewChannelUrl(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAddChannelOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddChannel}>Add Channel</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {channels.map((channel) => (
          <Card
            key={channel.id}
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => handleChannelClick(channel.url)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {channel.icon}
                  <CardTitle>{channel.name}</CardTitle>
                </div>
                {channel.unreadCount > 0 && (
                  <div className="bg-primary text-primary-foreground text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                    {channel.unreadCount}
                  </div>
                )}
              </div>
              <CardDescription className="flex items-center gap-1 text-xs">
                <ExternalLink className="h-3 w-3" />
                <span className="truncate">{channel.url}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {channel.lastMessage && (
                <p className="text-sm truncate">{channel.lastMessage}</p>
              )}
            </CardContent>
            {channel.lastMessageTime && (
              <CardFooter className="pt-0">
                <p className="text-xs text-muted-foreground">
                  {channel.lastMessageTime}
                </p>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
