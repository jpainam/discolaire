"use client";

import { useState } from "react";
import { Edit2, Save, StickyNote } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";

interface NotesCardProps {
  notes: string;
}

export function NotesCard({ notes }: NotesCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState(notes);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <StickyNote className="text-primary h-5 w-5" />
            Internal Notes
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => {
              if (isEditing) {
                // Save logic would go here
              }
              setIsEditing(!isEditing);
            }}
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            ) : (
              <>
                <Edit2 className="h-4 w-4" />
                Edit
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={editedNotes}
            onChange={(e) => setEditedNotes(e.target.value)}
            className="min-h-[120px] resize-none"
            placeholder="Add notes about this contact..."
          />
        ) : (
          <div className="bg-secondary/50 min-h-[100px] rounded-lg p-3">
            <p className="text-foreground text-sm whitespace-pre-wrap">
              {notes || "No notes added yet."}
            </p>
          </div>
        )}
        <p className="text-muted-foreground mt-2 text-xs">
          Only visible to staff members
        </p>
      </CardContent>
    </Card>
  );
}
