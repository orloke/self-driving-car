"use client";

import { Car } from "@/class/Car";
import { Road } from "@/class/Road";
import { useEffect, useRef } from "react";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !canvasRef.current) return;
    const width = canvasRef.current!.width;
    const road = new Road(width / 2, width * 0.9);
    const laneCenter = road.getLaneCenter(1);
    const car = new Car(laneCenter, 100, 30, 50);
    const animate = () => {
      car.update();

      canvasRef.current!.height = window.innerHeight;
      const height = canvasRef.current!.height;

      ctx.save();
      ctx.translate(0, -car.y + height * 0.7);

      road.draw(ctx);
      car.draw(ctx);

      ctx.restore();
      requestAnimationFrame(animate);
    };
    animate();
  }, [canvasRef]);

  return <canvas ref={canvasRef} className="h-full w-[200px] bg-gray-500"></canvas>;
};
