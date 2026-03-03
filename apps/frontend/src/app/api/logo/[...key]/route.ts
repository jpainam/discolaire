import type { NextRequest } from "next/server";
import type { Readable } from "node:stream";
import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

import { env } from "~/env";
import { s3client } from "~/lib/s3-client";

export const runtime = "nodejs";

const DEFAULT_CACHE_CONTROL =
  "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800";

function toWebStream(stream: Readable): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      stream.on("data", (chunk) => controller.enqueue(chunk));
      stream.on("end", () => controller.close());
      stream.on("error", (err) => controller.error(err));
    },
    cancel() {
      stream.destroy();
    },
  });
}

function normalizeKey(parts: string[]) {
  const raw = parts.join("/");
  return raw.replace(/^\/+/, "");
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ key: string[] }> },
) {
  const { key: keyParts } = await ctx.params;
  const key = normalizeKey(keyParts);

  if (!key) return new Response("Missing key", { status: 400 });

  const bucket = env.S3_IMAGE_BUCKET_NAME;
  if (!bucket) return new Response("Missing bucket", { status: 500 });

  try {
    let head;
    try {
      head = await s3client.send(
        new HeadObjectCommand({ Bucket: bucket, Key: key }),
      );
    } catch {
      return new Response("Not found", { status: 404 });
    }

    const obj = await s3client.send(
      new GetObjectCommand({ Bucket: bucket, Key: key }),
    );
    const body = obj.Body;

    if (!body) return new Response("Not found", { status: 404 });

    const nodeStream = body as unknown as Readable;

    return new Response(toWebStream(nodeStream), {
      status: 200,
      headers: {
        "Content-Type": head.ContentType ?? "application/octet-stream",
        "Cache-Control": DEFAULT_CACHE_CONTROL,
        ...(head.ETag ? { ETag: head.ETag } : {}),
        ...(head.ContentLength
          ? { "Content-Length": String(head.ContentLength) }
          : {}),
      },
    });
  } catch (err) {
    console.error(err);
    return new Response("File fetch error", { status: 500 });
  }
}
