import { NextRequest } from "next/server";

import { container } from "@/infrastructure/container";

export const dynamic = "force-dynamic";

const HEARTBEAT_MS = 25_000;

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let closed = false;

      const send = (chunk: string) => {
        if (closed) return;

        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          closed = true;
        }
      };

      send("retry: 3000\n\n");

      const unsubscribe = container.chatEventBus.subscribe((event) => {
        send(`event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`);
      });

      const heartbeat = setInterval(() => send(": ping\n\n"), HEARTBEAT_MS);

      const close = () => {
        if (closed) return;
        closed = true;
        clearInterval(heartbeat);
        unsubscribe();

        try {
          controller.close();
        } catch {}
      };

      request.signal.addEventListener("abort", close);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
