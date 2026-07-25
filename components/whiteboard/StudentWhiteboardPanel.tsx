"use client";

import { useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import WhiteboardCanvas, { type WhiteboardCanvasHandle } from "./WhiteboardCanvas";
import type { WhiteboardStroke } from "@/lib/types";

const COLORS = ["#4a2545", "#f5a623", "#2fb6a5", "#4fa8e0", "#e63946"];
const DEFAULT_WIDTH = 5;

type Point = { x: number; y: number };

export default function StudentWhiteboardPanel({
  studentId,
  initialStrokes,
}: {
  studentId: string;
  initialStrokes: WhiteboardStroke[];
}) {
  const canvasRef = useRef<WhiteboardCanvasHandle>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [color, setColor] = useState(COLORS[0]);
  const [canDraw, setCanDraw] = useState(false);

  useEffect(() => {
    canvasRef.current?.loadStrokes(initialStrokes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel(`whiteboard:${studentId}`);
    channelRef.current = channel;

    channel
      .on("broadcast", { event: "point" }, ({ payload }) => {
        if (payload.author !== "teacher") return;
        canvasRef.current?.drawRemotePoint(payload.phase, payload.x, payload.y, payload.color, payload.width);
      })
      .on("broadcast", { event: "permission" }, ({ payload }) => {
        setCanDraw(Boolean(payload.canStudentDraw));
      })
      .on("broadcast", { event: "clear" }, () => {
        canvasRef.current?.clearCanvas();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [studentId]);

  function handleLocalPoint(phase: "start" | "move" | "end", x: number, y: number) {
    channelRef.current?.send({
      type: "broadcast",
      event: "point",
      payload: { phase, x, y, color, width: DEFAULT_WIDTH, author: "student" },
    });
  }

  async function handleStrokeComplete(points: Point[]) {
    await fetch("/api/student/whiteboard-stroke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ points, color, width: DEFAULT_WIDTH }),
    });
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg border-2 border-plum/20">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-heading text-xl text-plum">Whiteboard</h2>
        <span className={`rounded-full px-3 py-1 text-xs font-heading font-bold text-white ${canDraw ? "bg-grass" : "bg-slate"}`}>
          {canDraw ? "You can draw!" : "Watching"}
        </span>
      </div>

      {canDraw && (
        <div className="mb-3 flex gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`h-7 w-7 rounded-full border-2 ${color === c ? "border-plum" : "border-transparent"}`}
              style={{ backgroundColor: c }}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>
      )}

      <WhiteboardCanvas
        ref={canvasRef}
        canDraw={canDraw}
        color={color}
        strokeWidth={DEFAULT_WIDTH}
        onLocalPoint={handleLocalPoint}
        onStrokeComplete={handleStrokeComplete}
      />
    </div>
  );
}
