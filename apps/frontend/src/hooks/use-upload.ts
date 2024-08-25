import { useState } from "react";

interface UploadState {
  file: File;
  isPending: boolean;
  error: any;
  data: { id: string; url: string } | null;
}
const useUpload = () => {
  const [isPending, setIsPending] = useState(false);
  const [data, setData] = useState<UploadState[]>([]);
  const [error, setError] = useState(null);

  const updateFileState = (index: number, newState: Partial<UploadState>) => {
    setData((prevUploads) => {
      const updatedUploads = [...prevUploads];
      updatedUploads[index] = { ...updatedUploads[index], ...newState };
      return updatedUploads;
    });
  };

  const onUpload = async (
    inputs: File | File[],
    metadata?: { dest?: string }
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
            process.env.NEXT_PUBLIC_BASE_URL + "/api/upload",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                filename: file.name,
                dest: metadata?.dest,
                contentType: file.type,
              }),
            }
          );
          if (response.ok) {
            const { url, fields } = await response.json();
            const formData = new FormData();
            Object.entries(fields).forEach(([key, value]) => {
              formData.append(key, value as any);
            });
            formData.append("file", file);

            const uploadResponse = await fetch(url, {
              method: "POST",
              body: formData,
            });
            if (uploadResponse.ok) {
              const uploadedData = await {
                id: fields["key"],
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
      })
    );

    setIsPending(false);
  };

  return { onUpload, isPending, data, error, isError: !!error };
};

export default useUpload;
