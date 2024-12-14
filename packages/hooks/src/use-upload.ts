import { useState } from "react";

import { env } from "../env";

interface UploadState {
  file: File;
  isPending: boolean;
  error: unknown;
  data: { id: string; url: string } | null;
}
export const useUpload = () => {
  const [isPending, setIsPending] = useState(false);
  const [data, setData] = useState<UploadState[]>([]);
  const [error, setError] = useState(null);

  const updateFileState = (index: number, newState: Partial<UploadState>) => {
    setData((prevUploads) => {
      const updatedUploads = [...prevUploads];
      updatedUploads[index] = {
        ...updatedUploads[index],
        ...newState,
      } as UploadState;
      return updatedUploads;
    });
  };

  const clearUploadedFiles = () => {
    setData([]);
  };

  const onUpload = async (
    inputs: File | File[],
    metadata?: { destination: string; bucket?: string },
  ) => {
    const files = Array.isArray(inputs) ? inputs : [inputs];
    const initialUploads = files.map((file) => ({
      file,
      isPending: false,
      isComplete: false,
      error: null,
      data: null,
    }));

    setData(initialUploads);
    setIsPending(true);
    setError(null);

    await Promise.all(
      files.map(async (file, index) => {
        updateFileState(index, { isPending: true });
        try {
          const response = await fetch(
            env.NEXT_PUBLIC_BASE_URL + "/api/upload",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                filename: file.name,
                destination: metadata?.destination,
                bucket: metadata?.bucket,
                contentType: file.type,
              }),
            },
          );
          if (response.ok) {
            const {
              url,
              fields,
            }: {
              url: string;
              fields: Record<string, string>;
            } = (await response.json()) as {
              url: string;
              fields: Record<string, string>;
            };
            const formData = new FormData();
            Object.entries(fields).forEach(([key, value]) => {
              formData.append(key, value);
            });
            formData.append("file", file);

            const uploadResponse = await fetch(url, {
              method: "POST",
              body: formData,
            });
            if (uploadResponse.ok) {
              const uploadedData = {
                id: fields.key ?? "",
                url,
              };
              updateFileState(index, { isPending: false, data: uploadedData });
            } else {
              const e = await uploadResponse.json();
              updateFileState(index, { error: e });
            }
          } else {
            const e = await response.json();
            updateFileState(index, { error: e });
          }
        } catch (err) {
          updateFileState(index, { error: err });
        } finally {
          updateFileState(index, { isPending: false });
        }
      }),
    );

    setIsPending(false);
  };

  const unstable_onUpload = async (
    input: File,
    metadata?: { destination: string; bucket?: string; key?: string },
  ): Promise<UploadState> => {
    const file = input;

    console.log(`Uploading file`, file.name);
    const response = await fetch(env.NEXT_PUBLIC_BASE_URL + "/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename: file.name,
        destination: metadata?.destination,
        bucket: metadata?.bucket,
        key: metadata?.key,
        contentType: file.type,
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to upload file ${await response.json()}`);
    }
    const {
      url,
      fields,
    }: {
      url: string;
      fields: Record<string, string>;
    } = (await response.json()) as {
      url: string;
      fields: Record<string, string>;
    };
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("file", file);

    const uploadResponse = await fetch(url, {
      method: "POST",
      body: formData,
    });
    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload file ${await uploadResponse.json()}`);
    }
    const uploadedData = {
      id: fields.key ?? "",
      url,
    };
    return {
      file,
      isPending: false,
      data: uploadedData,
      error: null,
    };
  };

  return {
    onUpload,
    unstable_onUpload,
    isPending,
    data,
    error,
    isError: !!error,
    clearUploadedFiles,
  };
};
