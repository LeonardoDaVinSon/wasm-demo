// Performance measurement utilities

export interface BenchmarkResult {
  name: string;
  wasmTime: number;
  tsTime: number;
  wasmResult?: any;
  tsResult?: any;
  speedup: number;
  winner: 'wasm' | 'ts';
}

export class PerformanceBench {
  static async measureTime<T>(fn: () => Promise<T> | T): Promise<{ result: T; time: number }> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    return { result, time: end - start };
  }

  static calculateSpeedup(wasmTime: number, tsTime: number): number {
    return Number((tsTime / wasmTime).toFixed(2));
  }

  static determineWinner(wasmTime: number, tsTime: number): 'wasm' | 'ts' {
    return wasmTime < tsTime ? 'wasm' : 'ts';
  }

  static async benchmark(
    name: string,
    wasmFn: () => Promise<any>,
    tsFn: () => any
  ): Promise<BenchmarkResult> {
    // Run TypeScript version
    const tsResult = await this.measureTime(tsFn);
    
    // Run WASM version
    const wasmResult = await this.measureTime(wasmFn);

    const speedup = this.calculateSpeedup(wasmResult.time, tsResult.time);
    const winner = this.determineWinner(wasmResult.time, tsResult.time);

    return {
      name,
      wasmTime: wasmResult.time,
      tsTime: tsResult.time,
      wasmResult: wasmResult.result,
      tsResult: tsResult.result,
      speedup,
      winner
    };
  }

  static generateRandomArray(size: number, max: number = 1000): number[] {
    return Array.from({ length: size }, () => Math.floor(Math.random() * max));
  }

  static generateRandomMatrix(size: number): number[] {
    return Array.from({ length: size * size }, () => Math.random() * 100);
  }

  static generateRandomImageData(width: number, height: number): Uint8Array {
    const pixels = new Uint8Array(width * height * 4);
    for (let i = 0; i < pixels.length; i += 4) {
      pixels[i] = Math.floor(Math.random() * 256);     // Red
      pixels[i + 1] = Math.floor(Math.random() * 256); // Green
      pixels[i + 2] = Math.floor(Math.random() * 256); // Blue
      pixels[i + 3] = 255;                             // Alpha
    }
    return pixels;
  }
}
