"use client";

import { Car } from "@/utils/Car";
import { useEffect, useRef } from "react";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !canvasRef.current) return;

    const car = new Car(150, 100, 30, 50);
    const animate = () => {
      car.update();

      canvasRef.current!.height = window.innerHeight;
      car.draw(ctx);
      requestAnimationFrame(animate);
    };
    animate();
  }, [canvasRef]);

  return <canvas ref={canvasRef} className="h-full w-[200px] bg-gray-500"></canvas>;
};
