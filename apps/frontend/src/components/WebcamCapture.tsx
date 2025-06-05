/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { useEffect, useRef, useState } from "react";

interface WebcamCaptureProps {
  onUpload: (uploadedUrl: string) => void;
}

// TODO https://developer.chrome.com/blog/play-request-was-interrupted
export default function WebcamCapture({ onUpload }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // When component mounts, ask for camera and stream it into <video>
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
          setStreaming(true);
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
        setError("Could not access webcam. Please allow camera permission.");
      }
    }
    void startCamera();
    const refValue = videoRef.current;
    // Cleanup: stop all tracks on unmount
    return () => {
      if (refValue?.srcObject) {
        (refValue.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  // When “Capture” is clicked: draw to canvas, convert to blob, and upload.
  const handleCapture = () => {
    if (!streaming || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Match canvas size to video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          setError("Failed to capture image.");
          return;
        }

        // Build FormData
        const formData = new FormData();
        formData.append("file", blob, "profile.jpg");

        try {
          const res = await fetch("/api/upload-photo", {
            method: "POST",
            body: formData,
          });
          if (!res.ok) {
            throw new Error(`Upload failed: ${res.statusText}`);
          }
          const data = await res.json();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          onUpload(data.url); // e.g. returned URL or file name
        } catch (uploadErr) {
          console.error(uploadErr);
          setError("Upload failed. Check console for details.");
        }
      },
      "image/jpeg",
      0.9,
    );
  };

  return (
    <div style={{ textAlign: "center" }}>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Hidden canvas to grab frame */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Video stream */}
      <div>
        <video
          ref={videoRef}
          style={{
            border: "1px solid #ccc",
            width: 320,
            height: 240,
            backgroundColor: "#000",
          }}
          muted
        />
      </div>

      <button
        onClick={handleCapture}
        style={{
          marginTop: "0.5rem",
          padding: "0.5rem 1rem",
          fontSize: "1rem",
        }}
      >
        Capture Photo
      </button>
    </div>
  );
}
