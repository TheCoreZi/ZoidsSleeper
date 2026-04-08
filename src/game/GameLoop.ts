export type TickCallback = () => void;

export class GameLoop {
  private accumulatedTime = 0;
  private frameRequest = 0;
  private lastFrameTime = 0;
  private onTick: TickCallback;
  private pageHidden = false;
  private running = false;
  private tickTime: number;
  private worker: Worker | null = null;

  constructor(tickTime: number, onTick: TickCallback) {
    this.tickTime = tickTime;
    this.onTick = onTick;
  }

  start(): void {
    this.running = true;
    this.lastFrameTime = 0;
    this.accumulatedTime = 0;
    this.pageHidden = document.hidden;

    this.worker = this.createWorker();
    this.worker.onmessage = () => {
      if (this.running && this.pageHidden) {
        this.onTick();
      }
    };

    if (this.pageHidden) {
      this.worker.postMessage('start');
    }

    document.addEventListener('visibilitychange', this.onVisibilityChange);
    this.frameRequest = requestAnimationFrame((t) => this.tick(t));
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.frameRequest);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.worker?.postMessage('stop');
    this.worker?.terminate();
    this.worker = null;
  }

  private createWorker(): Worker {
    const blob = new Blob([`
      let timer = null;
      self.onmessage = function(e) {
        if (e.data === 'start') {
          if (timer) clearInterval(timer);
          timer = setInterval(() => self.postMessage('tick'), ${this.tickTime});
        } else if (e.data === 'stop') {
          if (timer) { clearInterval(timer); timer = null; }
        }
      };
    `], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const w = new Worker(url);
    URL.revokeObjectURL(url);
    return w;
  }

  private onVisibilityChange = (): void => {
    this.pageHidden = document.hidden;
    if (this.pageHidden) {
      this.worker?.postMessage('start');
    } else {
      this.worker?.postMessage('stop');
    }
    this.accumulatedTime = 0;
    this.lastFrameTime = 0;
  };

  private tick(currentTime: number): void {
    if (!this.running) {return;}

    if (this.pageHidden) {
      this.frameRequest = requestAnimationFrame((t) => this.tick(t));
      return;
    }

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
