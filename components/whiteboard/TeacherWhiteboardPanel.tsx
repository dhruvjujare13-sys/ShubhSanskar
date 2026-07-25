"use client";

import { useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import WhiteboardCanvas, { type WhiteboardCanvasHandle } from "./WhiteboardCanvas";
import type { WhiteboardStroke } from "@/lib/types";

const COLORS = ["#4a2545", "#f5a623", "#2fb6a5", "#4fa8e0", "#e63946"];
const WIDTHS = [2, 5, 10];
const ERASER_COLOR = "#ffffff";

type Point = { x: number; y: number };

export default function TeacherWhiteboardPanel({
  studentId,
  initialStrokes,
}: {
  studentId: string;
  initialStrokes: WhiteboardStroke[];
}) {
  const canvasRef = useRef<WhiteboardCanvasHandle>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [color, setColor] = useState(COLORS[0]);
  const [strokeWidth, setStrokeWidth] = useState(WIDTHS[1]);
  const [erasing, setErasing] = useState(false);
  const [canStudentDraw, setCanStudentDraw] = useState(false);

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
        if (payload.author !== "student") return;
        canvasRef.current?.drawRemotePoint(payload.phase, payload.x, payload.y, payload.color, payload.width);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [studentId]);

  function broadcastPermission(next: boolean) {
    setCanStudentDraw(next);
    channelRef.current?.send({
      type: "broadcast",
      event: "permission",
      payload: { canStudentDraw: next },
    });
  }

  function handleLocalPoint(phase: "start" | "move" | "end", x: number, y: number) {
    channelRef.current?.send({
      type: "broadcast",
      event: "point",
      payload: { phase, x, y, color: erasing ? ERASER_COLOR : color, width: erasing ? 20 : strokeWidth, author: "teacher" },
    });
  }

  async function handleStrokeComplete(points: Point[]) {
    const supabase = createClient();
    await supabase.from("whiteboard_strokes").insert({
      student_id: studentId,
      author: "teacher",
      points,
      color: erasing ? ERASER_COLOR : color,
      width: erasing ? 20 : strokeWidth,
    });
  }

  async function handleClear() {
    const supabase = createClient();
    await supabase.from("whiteboard_strokes").delete().eq("student_id", studentId);
    canvasRef.current?.clearCanvas();
    channelRef.current?.send({ type: "broadcast", event: "clear", payload: {} });
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg border-2 border-plum/20">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-xl text-plum">Whiteboard</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => broadcastPermission(!canStudentDraw)}
            className={`rounded-full px-4 py-1.5 text-sm font-heading font-bold text-white ${
              canStudentDraw ? "bg-grass" : "bg-slate"
            }`}
          >
            {canStudentDraw ? "Student can draw" : "Let student draw"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="rounded-full border-2 border-plum px-4 py-1.5 text-sm font-heading font-bold text-plum hover:bg-plum hover:text-white"
          >
            Clear board
          </button>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setColor(c);
                setErasing(false);
              }}
              className={`h-7 w-7 rounded-full border-2 ${color === c && !erasing ? "border-plum" : "border-transparent"}`}
              style={{ backgroundColor: c }}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>
        <div className="flex gap-1.5">
          {WIDTHS.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setStrokeWidth(w)}
              className={`rounded-lg border-2 px-2 py-1 text-xs font-semibold ${
                strokeWidth === w ? "border-plum bg-plum/10" : "border-plum/20"
              }`}
            >
              {w}px
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setErasing((v) => !v)}
          className={`rounded-lg border-2 px-3 py-1 text-xs font-semibold ${
            erasing ? "border-plum bg-plum text-white" : "border-plum/20 text-plum"
          }`}
        >
          Eraser
        </button>
      </div>

      <WhiteboardCanvas
        ref={canvasRef}
        canDraw
        color={erasing ? ERASER_COLOR : color}
        strokeWidth={erasing ? 20 : strokeWidth}
        onLocalPoint={handleLocalPoint}
        onStrokeComplete={handleStrokeComplete}
      />
    </div>
  );
}
