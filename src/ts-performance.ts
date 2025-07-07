// TypeScript implementations of the same algorithms

export class TSPerformance {
  static fibonacci(n: number): number {
    if (n === 0) return 0;
    if (n === 1) return 1;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
      const temp = a + b;
      a = b;
      b = temp;
    }
    console.log(`TS fibonacci(${n}) =`, b, typeof b);
    return b;
  }

  static fibonacciRecursive(n: number): number {
    if (n <= 1) return n;
    return this.fibonacciRecursive(n - 1) + this.fibonacciRecursive(n - 2);
  }

  static bubbleSort(arr: number[]): number[] {
    const result = [...arr];
    const len = result.length;
    
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len - 1 - i; j++) {
        if (result[j] > result[j + 1]) {
          [result[j], result[j + 1]] = [result[j + 1], result[j]];
        }
      }
    }
    return result;
  }

  static quickSort(arr: number[]): number[] {
    const result = [...arr];
    this.quickSortHelper(result, 0, result.length - 1);
    return result;
  }

  private static quickSortHelper(arr: number[], low: number, high: number): void {
    if (low < high) {
      const pi = this.partition(arr, low, high);
      this.quickSortHelper(arr, low, pi - 1);
      this.quickSortHelper(arr, pi + 1, high);
    }
  }

  private static partition(arr: number[], low: number, high: number): number {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (arr[j] <= pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
  }

  static matrixMultiply(a: number[], b: number[], size: number): number[] {
    const result = new Array(size * size).fill(0);

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        for (let k = 0; k < size; k++) {
          result[i * size + j] += a[i * size + k] * b[k * size + j];
        }
      }
    }

    return result;
  }

  static imageBlur(pixels: Uint8Array, width: number, height: number): Uint8Array {
    const result = new Uint8Array(pixels.length);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 4; c++) { // RGBA channels
          let sum = 0;
          let count = 0;

          // 3x3 kernel blur
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const ny = y + dy;
              const nx = x + dx;
              const idx = (ny * width + nx) * 4 + c;
              sum += pixels[idx];
              count++;
            }
          }

          const idx = (y * width + x) * 4 + c;
          result[idx] = Math.floor(sum / count);
        }
      }
    }

    // Copy edges
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (y === 0 || y === height - 1 || x === 0 || x === width - 1) {
          for (let c = 0; c < 4; c++) {
            const idx = (y * width + x) * 4 + c;
            result[idx] = pixels[idx];
          }
        }
      }
    }

    return result;
  }

  static primeSieve(limit: number): number[] {
    const sieve = new Array(limit + 1).fill(true);
    sieve[0] = false;
    if (limit > 0) sieve[1] = false;

    for (let p = 2; p * p <= limit; p++) {
      if (sieve[p]) {
        for (let i = p * p; i <= limit; i += p) {
          sieve[i] = false;
        }
      }
    }

    const primes: number[] = [];
    for (let i = 2; i <= limit; i++) {
      if (sieve[i]) {
        primes.push(i);
      }
    }

    return primes;
  }
}
