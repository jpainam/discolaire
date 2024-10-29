import { Folder, MoreVertical, Star } from "lucide-react";

import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";

interface FolderData {
  name: string;
  size: string;
  files: number;
  isFavorite: boolean;
}

const folders: FolderData[] = [
  { name: "Personal Assets", size: "1.8 GB", files: 40, isFavorite: false },
  { name: "Data & Prints", size: "528 MB", files: 122, isFavorite: true },
  { name: "Raw Images", size: "8 GB", files: 900, isFavorite: false },
];

export function DocumentGrid() {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {folders.map((folder) => (
          <Card key={folder.name} className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {folder.name}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={
                    folder.isFavorite ? "text-yellow-400" : "text-gray-400"
                  }
                >
                  <Star className="h-4 w-4" />
                  <span className="sr-only">Favorite</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="rounded-md bg-gray-100 p-2">
                  <Folder className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    {folder.size} • {folder.files} files
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
