import { IRoadBoarders } from "@/types";
import { Controls } from "../Controls";
import { Sensors } from "../Sensors";

export class Car {
  x: number;
  y: number;
  width: number;
  height: number;
  controls: Controls;
  speed: number;
  acceleration: number;
  maxSpeed: number;
  friction: number;
  angle: number;
  sensors: Sensors;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = 3;
    this.friction = 0.05;
    this.angle = 0;

    this.sensors = new Sensors(this);
    this.controls = new Controls();
  }

  update(
    roadBoarders: IRoadBoarders[][]
  ) {
    this.move();
    this.sensors.update(roadBoarders);
  }

  private move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }
    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);

    ctx.beginPath();
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fill();

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(0, -this.height / 2, 5, 0, 2 * Math.PI);
    ctx.fill();

    ctx.restore();

    this.sensors.draw(ctx);
  }
}
