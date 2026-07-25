"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import type { WhiteboardStroke } from "@/lib/types";

export type WhiteboardCanvasHandle = {
  drawRemotePoint: (phase: "start" | "move" | "end", x: number, y: number, color: string, width: number) => void;
  clearCanvas: () => void;
  loadStrokes: (strokes: WhiteboardStroke[]) => void;
};

type Point = { x: number; y: number };

const WhiteboardCanvas = forwardRef<
  WhiteboardCanvasHandle,
  {
    canDraw: boolean;
    color: string;
    strokeWidth: number;
    onLocalPoint: (phase: "start" | "move" | "end", x: number, y: number) => void;
    onStrokeComplete: (points: Point[]) => void;
  }
>(function WhiteboardCanvas({ canDraw, color, strokeWidth, onLocalPoint, onStrokeComplete }, ref) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const currentStrokeRef = useRef<Point[]>([]);
  const remoteDrawingRef = useRef(false);
  const lastRemotePointRef = useRef<Point | null>(null);

  function ctx() {
    return canvasRef.current?.getContext("2d") ?? null;
  }

  function toPixels(p: Point) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    return { x: p.x * canvas.width, y: p.y * canvas.height };
  }

  function drawSegment(from: Point, to: Point, strokeColor: string, lineWidth: number) {
    const c = ctx();
    if (!c) return;
    const a = toPixels(from);
    const b = toPixels(to);
    c.strokeStyle = strokeColor;
    c.lineWidth = lineWidth;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.beginPath();
    c.moveTo(a.x, a.y);
    c.lineTo(b.x, b.y);
    c.stroke();
  }

  function toNormalized(clientX: number, clientY: number): Point {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height,
    };
  }

  useImperativeHandle(ref, () => ({
    drawRemotePoint(phase, x, y, strokeColor, lineWidth) {
      const point = { x, y };
      if (phase === "start") {
        remoteDrawingRef.current = true;
        lastRemotePointRef.current = point;
        return;
      }
      if (phase === "end") {
        remoteDrawingRef.current = false;
        lastRemotePointRef.current = null;
        return;
      }
      if (remoteDrawingRef.current && lastRemotePointRef.current) {
        drawSegment(lastRemotePointRef.current, point, strokeColor, lineWidth);
      }
      lastRemotePointRef.current = point;
    },
    clearCanvas() {
      const canvas = canvasRef.current;
      const c = ctx();
      if (canvas && c) c.clearRect(0, 0, canvas.width, canvas.height);
    },
    loadStrokes(strokes) {
      for (const stroke of strokes) {
        const points = stroke.points;
        for (let i = 1; i < points.length; i++) {
          drawSegment(points[i - 1], points[i], stroke.color, stroke.width);
        }
      }
    },
  }));

  useEffect(() => {
    function resize() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientWidth * 0.6;
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!canDraw) return;
    drawingRef.current = true;
    const point = toNormalized(e.clientX, e.clientY);
    currentStrokeRef.current = [point];
    onLocalPoint("start", point.x, point.y);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!canDraw || !drawingRef.current) return;
    const point = toNormalized(e.clientX, e.clientY);
    const prev = currentStrokeRef.current[currentStrokeRef.current.length - 1];
    if (prev) drawSegment(prev, point, color, strokeWidth);
    currentStrokeRef.current.push(point);
    onLocalPoint("move", point.x, point.y);
  }

  function handlePointerUp() {
    if (!canDraw || !drawingRef.current) return;
    drawingRef.current = false;
    onLocalPoint("end", 0, 0);
    if (currentStrokeRef.current.length > 1) {
      onStrokeComplete(currentStrokeRef.current);
    }
    currentStrokeRef.current = [];
  }

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className={`w-full touch-none rounded-2xl border-2 border-plum/20 bg-white ${
        canDraw ? "cursor-crosshair" : "cursor-not-allowed"
      }`}
    />
  );
});

export default WhiteboardCanvas;
