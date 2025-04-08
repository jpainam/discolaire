"use client";

import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
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
import { Progress } from "@repo/ui/components/progress";
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
  AlertCircle,
  CheckCircle2,
  FileIcon,
  FileArchiveIcon as FileZip,
  Upload,
  XCircle,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
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
  const [ids, setIds] = useState<string[]>([]);
  const [entityType, setEntityType] = useState<string>("student");
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileResults, setFileResults] = useState<FileMatchResult[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [progress, setProgress] = useState(0);

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

    setIsProcessing(true);
    setFileResults([]);
    setProgress(0);

    try {
      const zip = new JSZip();
      const contents = await zip.loadAsync(zipFile);

      // Get all file entries (excluding directories)
      const fileEntries = Object.keys(contents.files).filter(
        (fileName) => !contents.files[fileName]?.dir
      );

      // Filter for image files (common image extensions)
      const imageFileEntries = fileEntries.filter((fileName) => {
        const ext = fileName.split(".").pop()?.toLowerCase();
        return [
          "jpg",
          "jpeg",
          "png",
          "gif",
          "bmp",
          "webp",
          "tiff",
          "svg",
        ].includes(ext ?? "");
      });

      // Process each file in the zip
      let processedCount = 0;

      const matchResults: Omit<FileMatchResult, "matched" | "matchedId">[] = [];
      const filePromises = imageFileEntries.map(async (fileName) => {
        // Get the file name without extension and path
        const baseName = fileName.split("/").pop()?.split(".")[0] ?? "";
        if (!contents.files[fileName]) return;
        // Get file data as blob
        const fileData = await contents.files[fileName].async("blob");
        matchResults.push({
          fileName,
          baseName,
          fileData,
        });

        // Update progress
        processedCount++;
        setProgress(
          Math.round((processedCount / imageFileEntries.length) * 100)
        );
        return baseName;
      });

      const baseNames = await Promise.all(filePromises);
      const results: FileMatchResult[] = [];
      matchIdsMutation.mutate(
        {
          entityType: entityType as "student" | "staff" | "contact",
          entityIds: baseNames.filter((b) => b !== undefined),
        },

        {
          onError: (error) => {
            toast.error(error.message);
          },
          onSuccess: (data) => {
            matchResults.map((result) => {
              // Check if there's a matching ID
              const found = data.find((d) => d.name === result.baseName);
              results.push({
                baseName: result.baseName,
                fileName: result.fileName,
                fileData: result.fileData,
                matched: !!found,
                matchedId: found ? found.id : undefined,
              });
            });
            setIds(data.map((item) => item.id));
            setFileResults(results);
            console.log(results);
          },
        }
      );
    } catch (error) {
      toast.error((error as Error).message);
      console.error("Error processing zip file:", error);
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setSubmitMessage("");

    try {
      // Create a FormData object to send files
      const formData = new FormData();

      // Add only matched files to the form data
      fileResults.forEach((result) => {
        if (result.matched) {
          formData.append(
            `id_${result.matchedId}`,
            result.fileData,
            result.fileName
          );
        }
      });

      // Add the list of IDs that were matched
      formData.append(
        "matchedIds",
        JSON.stringify(
          fileResults.filter((r) => r.matched).map((r) => r.matchedId)
        )
      );

      // Here you would replace with your actual API endpoint
      // const response = await fetch('/api/submit-images', {
      //   method: 'POST',
      //   body: formData
      // })

      // Simulate a successful response
      // if (response.ok) {
      setSubmitStatus("success");
      setSubmitMessage("Files successfully submitted to the backend!");
      // } else {
      //   throw new Error('Failed to submit files')
      // }
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage(
        "Failed to submit files to the backend. Please try again."
      );
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIds([]);
    setZipFile(null);
    setFileResults([]);
    setSubmitStatus("idle");
    setSubmitMessage("");
    setProgress(0);
  };

  const matchedCount = fileResults.filter((r) => r.matched).length;
  const unmatchedCount = fileResults.filter((r) => !r.matched).length;
  const { t } = useLocale();
  const trpc = useTRPC();
  const matchIdsMutation = useMutation(
    trpc.upload.matchedIds.mutationOptions()
  );

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
              disabled={!zipFile || isProcessing}
              className="w-full"
            >
              {isProcessing ? "Processing..." : "Match Files with IDs"}
              {!isProcessing && <Upload className="ml-2 h-4 w-4" />}
            </Button>

            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-center text-muted-foreground">
                  {progress}% complete
                </p>
              </div>
            )}

            {submitStatus !== "idle" && (
              <Alert
                variant={submitStatus === "success" ? "default" : "destructive"}
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>
                  {submitStatus === "success" ? "Success" : "Error"}
                </AlertTitle>
                <AlertDescription>{submitMessage}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {fileResults.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-green-50">
                    <CheckCircle2 className="mr-1 h-3 w-3 text-green-500" />
                    {matchedCount} Files Matched
                  </Badge>
                  <Badge variant="outline" className="bg-red-50">
                    <XCircle className="mr-1 h-3 w-3 text-red-500" />
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
                          className={`p-2 rounded-md flex items-center justify-between ${
                            result.matched ? "bg-green-50" : "bg-red-50"
                          }`}
                        >
                          <div className="flex items-center">
                            {result.matched ? (
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="mr-2 h-4 w-4 text-red-500" />
                            )}
                            <FileIcon className="mr-2 h-4 w-4" />
                            <span className="font-medium truncate max-w-[150px]">
                              {result.fileName}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {result.matched ? (
                              <span>
                                Matched with ID:{" "}
                                <strong>{result.matchedId}</strong>
                              </span>
                            ) : (
                              <span className="text-red-500">
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
        <Button variant="outline" onClick={resetForm}>
          Reset
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={
            fileResults.length === 0 || isSubmitting || matchedCount === 0
          }
        >
          {isSubmitting ? "Submitting..." : "Submit Matched Files"}
        </Button>
      </CardFooter>
    </Card>
  );
}
