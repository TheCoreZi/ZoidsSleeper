export type TickCallback = () => void;

export class GameLoop {
  private accumulatedTime = 0;
  private frameRequest = 0;
  private lastFrameTime = 0;
  private onTick: TickCallback;
  private running = false;
  private tickTime: number;

  constructor(tickTime: number, onTick: TickCallback) {
    this.tickTime = tickTime;
    this.onTick = onTick;
  }

  start(): void {
    this.running = true;
    this.lastFrameTime = 0;
    this.accumulatedTime = 0;
    this.frameRequest = requestAnimationFrame((t) => this.tick(t));
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.frameRequest);
  }

  private tick(currentTime: number): void {
    if (!this.running) {return;}

    if (this.lastFrameTime > 0) {
      const delta = currentTime - this.lastFrameTime;
      this.accumulatedTime += delta;

      if (this.accumulatedTime >= this.tickTime * 2) {
        this.accumulatedTime = 0;
      }

      if (this.accumulatedTime >= this.tickTime) {
        this.accumulatedTime -= this.tickTime;
        this.onTick();
      }
    }

    this.lastFrameTime = currentTime;
    this.frameRequest = requestAnimationFrame((t) => this.tick(t));
  }
}
