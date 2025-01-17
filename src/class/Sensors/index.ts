import { IRoadBoarders } from "@/types";
import { getIntersection, lerp } from "@/utils";
import { Car } from "../Car";

export class Sensors {
  car: Car;
  rayCount: number;
  rayLength: number;
  raySpread: number;
  rays: {
    x: number;
    y: number;
  }[][];
  readings: Array<
    | {
        x: number;
        y: number;
        offset: number;
      }
    | null
    | undefined
  >;

  constructor(car: Car) {
    this.car = car;
    this.rayCount = 5;
    this.rayLength = 150;
    this.raySpread = Math.PI / 2;
    this.rays = [];
    this.readings = [];
  }

  update(roadBoarders: IRoadBoarders[][]) {
    this.castRays();
    this.readings = [];

    for (let i = 0; i < this.rays.length; i++) {
      const ray = this.rays[i];
      const reading = this.getReading(ray, roadBoarders);
      this.readings.push(reading);
    }
  }

  private getReading(ray: IRoadBoarders[], roadBoarders: IRoadBoarders[][]) {
    let touches = [];
    for (let i = 0; i < roadBoarders.length; i++) {
      const touch = getIntersection(ray[0], ray[1], roadBoarders[i][0], roadBoarders[i][1]);
      if (touch) {
        touches.push(touch);
      }
    }

    if (touches.length == 0) {
      return null;
    } else {
      const offset = touches.map((e) => e.offset);
      const minOffset = Math.min(...offset);
      return touches.find((e) => e.offset == minOffset);
    }
  }

  private castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(this.raySpread / 2, -this.raySpread / 2, this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)) +
        this.car.angle;
      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };
      this.rays.push([start, end]);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.rays.length; i++) {
      let end = this.rays[i][1];
      if (this.readings[i]) {
        end = this.readings[i] as IRoadBoarders;
      }

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }
}
