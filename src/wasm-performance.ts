// WASM wrapper for easier usage

let wasmModule: any = null;
let wasmInitialized = false;

export async function initWasm() {
  if (!wasmInitialized) {
    try {
      // Import the WASM module dynamically
      const wasmImport = await import('../rust-wasm/pkg/rust_wasm.js');
      await wasmImport.default();
      wasmModule = wasmImport;
      wasmInitialized = true;
    } catch (error) {
      console.error('Failed to initialize WASM:', error);
      throw error;
    }
  }
  return wasmModule;
}

export class WASMPerformance {
  static async init() {
    if (!wasmModule) {
      wasmModule = await initWasm();
    }
    return wasmModule;
  }

  static async fibonacci(n: number): Promise<number> {
    await this.init();
    return wasmModule.fibonacci(n);
  }

  static async fibonacciRecursive(n: number): Promise<number> {
    await this.init();
    return wasmModule.fibonacci_recursive(n);
  }

  static async bubbleSort(arr: number[]): Promise<number[]> {
    await this.init();
    const result = wasmModule.bubble_sort(new Int32Array(arr));
    return Array.from(result);
  }

  static async quickSort(arr: number[]): Promise<number[]> {
    await this.init();
    const result = wasmModule.quick_sort(new Int32Array(arr));
    return Array.from(result);
  }

  static async matrixMultiply(a: number[], b: number[], size: number): Promise<number[]> {
    await this.init();
    const result = wasmModule.matrix_multiply(new Float64Array(a), new Float64Array(b), size);
    return Array.from(result);
  }

  static async imageBlur(pixels: Uint8Array, width: number, height: number): Promise<Uint8Array> {
    await this.init();
    const result = wasmModule.image_blur(pixels, width, height);
    return new Uint8Array(result);
  }

  static async primeSieve(limit: number): Promise<number[]> {
    await this.init();
    const result = wasmModule.prime_sieve(limit);
    return Array.from(result);
  }
}
