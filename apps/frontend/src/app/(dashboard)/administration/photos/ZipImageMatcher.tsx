"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Label } from "@repo/ui/components/label";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Separator } from "@repo/ui/components/separator";
import { useMutation } from "@tanstack/react-query";
import JSZip from "jszip";
import {
  CheckCircle2,
  FileIcon,
  FileArchiveIcon as FileZip,
  Upload,
  XCircle,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";

interface FileMatchResult {
  fileName: string;
  baseName: string;
  matched: boolean;
  matchedId?: string;
  fileData: Blob;
}

export function ZipImageMatcher() {
  const trpc = useTRPC();
  const matchIdsMutation = useMutation(
    trpc.upload.matchedIds.mutationOptions()
  );
  const [ids, setIds] = useState<string[]>([]);
  const [entityType, setEntityType] = useState<string>("student");
  const [zipFile, setZipFile] = useState<File | null>(null);

  const [fileResults, setFileResults] = useState<FileMatchResult[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (!file) return;
      if (file.type === "application/zip" || file.name.endsWith(".zip")) {
        setZipFile(file);
      } else {
        toast.error("Please upload a zip file");
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/zip": [".zip"],
    },
    maxFiles: 1,
  });

  const processZipFile = async () => {
    if (!zipFile) return;
    toast.loading("Processing zip file...", { id: 0 });
    setFileResults([]);

    try {
      const zip = await JSZip.loadAsync(zipFile);
      const imageFileEntries = Object.entries(zip.files)
        .filter(([_, entry]) => !entry.dir)
        .filter(([name]) =>
          /\.(jpg|jpeg|png|gif|bmp|webp|tiff|svg)$/i.test(name)
        );

      const results: FileMatchResult[] = [];

      const baseNames = await Promise.all(
        imageFileEntries.map(async ([fileName, entry]) => {
          const baseName = fileName.split("/").pop()?.split(".")[0] ?? "";
          const fileData = await entry.async("blob");
          results.push({
            fileName,
            baseName,
            fileData,
            matched: false,
          });
          return baseName;
        })
      );

      matchIdsMutation.mutate(
        {
          entityType: entityType as "student" | "staff" | "contact",
          entityIds: baseNames,
        },
        {
          onSuccess: (data) => {
            const updated = results.map((file) => {
              const match = data.find((d) => d.name === file.baseName);
              return {
                ...file,
                matched: !!match,
                matchedId: match ? match.id : undefined,
              };
            });
            setFileResults(updated);
            setIds(data.map((d) => d.id));
          },
          onError: (error) => {
            toast.error(error.message);
          },
        }
      );
    } catch (error) {
      console.error("Error processing zip file:", error);
      toast.error((error as Error).message);
    } finally {
      toast.dismiss(0);
    }
  };

  const router = useRouter();
  const handleSubmit = async () => {
    toast.loading("Submitting files...", { id: 0 });
    const formData = new FormData();
    const matchedFiles = fileResults.filter((result) => result.matched);
    matchedFiles.forEach((result) => {
      formData.append(
        `id_${result.matchedId}`,
        result.fileData,
        result.fileName
      );
    });

    formData.append(
      "matchedIds",
      JSON.stringify(matchedFiles.map((r) => r.matchedId))
    );
    formData.append("entityType", entityType);

    try {
      //Here you would replace with your actual API endpoint
      const response = await fetch("/api/photos", {
        method: "POST",
        body: formData,
      });
      // Simulate a successful response
      if (response.ok) {
        toast.success("Files submitted successfully!", { id: 0 });
        router.push(`/administration/photos/${entityType}`);
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      toast.error((error as Error).message, { id: 0 });
      console.error("Submission error:", error);
    } finally {
      toast.dismiss(0);
    }
  };

  const resetForm = () => {
    setIds([]);
    setZipFile(null);
    setFileResults([]);
  };

  const matchedCount = fileResults.filter((r) => r.matched).length;
  const unmatchedCount = fileResults.filter((r) => !r.matched).length;
  const { t } = useLocale();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Image ID Matcher</CardTitle>
        <CardDescription>
          Upload a zip file containing images and match them with your list of
          IDs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Inputs */}

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="ids">
                List of IDs (one per line, or comma/space separated)
              </Label>
              <Select
                onValueChange={(val) => setEntityType(val)}
                defaultValue="student"
              >
                <SelectTrigger id="ids" className="w-full">
                  <SelectValue placeholder="Pour" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">{t("students")}</SelectItem>
                  <SelectItem value="staff">{t("staffs")}</SelectItem>
                  <SelectItem value="contact">{t("parents")}</SelectItem>
                </SelectContent>
              </Select>
              {ids.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {ids.length} IDs detected
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Upload Zip File</Label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25"
                } ${zipFile ? "bg-primary/5" : ""}`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-2">
                  <FileZip className="h-10 w-10 text-muted-foreground" />
                  {zipFile ? (
                    <div>
                      <p className="font-medium">{zipFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(zipFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  ) : isDragActive ? (
                    <p>Drop the zip file here...</p>
                  ) : (
                    <div>
                      <p className="font-medium">
                        Drag & drop a zip file here, or click to select
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Only .zip files are accepted
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button
              size={"sm"}
              onClick={processZipFile}
              disabled={!zipFile || matchIdsMutation.isPending}
              className="w-full"
            >
              {matchIdsMutation.isPending
                ? "Processing..."
                : "Match Files with IDs"}
              {!matchIdsMutation.isPending && (
                <Upload className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {fileResults.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="bg-green-50 dark:bg-green-900"
                  >
                    <CheckCircle2 className="mr-1 h-3 w-3 text-green-500 dark:text-green-50" />
                    {matchedCount} Files Matched
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-red-50 dark:bg-red-900"
                  >
                    <XCircle className="mr-1 h-3 w-3 text-red-500 dark:text-red-50" />
                    {unmatchedCount} Files Unmatched
                  </Badge>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">Match Results:</h3>
                  <ScrollArea className="h-[350px] rounded-md border p-2">
                    <div className="space-y-2">
                      {fileResults.map((result, index) => (
                        <div
                          key={index}
                          className={`p-1 rounded-md flex items-center justify-between ${
                            result.matched
                              ? "bg-green-50 dark:bg-green-900"
                              : "bg-red-50 dark:bg-red-900"
                          }`}
                        >
                          <div className="flex items-center">
                            {result.matched ? (
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 dark:text-green-50" />
                            ) : (
                              <XCircle className="mr-2 h-4 w-4 text-red-500 dark:text-red-50" />
                            )}
                            <FileIcon className="mr-2 h-4 w-4" />
                            <span className="font-medium text-xs truncate max-w-[150px]">
                              {result.fileName}
                            </span>
                          </div>
                          <div className="text-sm ">
                            {result.matched ? (
                              <span>
                                Matched with ID:{" "}
                                <strong>{result.matchedId}</strong>
                              </span>
                            ) : (
                              <span className="text-red-500 dark:text-red-50">
                                No matching ID
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground p-8">
                  <FileZip className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
                  <p>
                    Upload a zip file and click "Match Files with IDs" to see
                    the results here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button size={"sm"} variant="outline" onClick={resetForm}>
          Reset
        </Button>
        <Button
          size={"sm"}
          isLoading={matchIdsMutation.isPending}
          onClick={handleSubmit}
          disabled={
            fileResults.length === 0 ||
            matchIdsMutation.isPending ||
            matchedCount === 0
          }
        >
          {matchIdsMutation.isPending
            ? "Submitting..."
            : "Submit Matched Files"}
        </Button>
      </CardFooter>
    </Card>
  );
}
