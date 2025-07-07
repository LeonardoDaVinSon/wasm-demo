<template>
  <div id="app">
    <header class="header">
      <h1>🚀 WASM vs TypeScript Performance Demo</h1>
      <p>So sánh hiệu năng giữa WebAssembly và TypeScript với các tác vụ tính toán nặng</p>
    </header>

    <main class="main">
      <div class="controls">
        <button @click="runAllBenchmarks" :disabled="isRunning" class="btn-primary">
          {{ isRunning ? '⏳ Đang chạy...' : '🏁 Chạy tất cả benchmark' }}
        </button>
        <button @click="clearResults" :disabled="isRunning" class="btn-secondary">
          🗑️ Xóa kết quả
        </button>
      </div>

      <div class="test-grid">
        <TestCard
          v-for="test in tests"
          :key="test.name"
          :test="test"
          :is-running="runningTests.has(test.name)"
          @run="runSingleTest"
        />
      </div>

      <ResultsTable v-if="results.length > 0" :results="results" />
      
      <PerformanceChart v-if="results.length > 0" :results="results" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import TestCard from './components/TestCard.vue'
import ResultsTable from './components/ResultsTable.vue'
import PerformanceChart from './components/PerformanceChart.vue'
import { WASMPerformance } from './wasm-performance'
import { TSPerformance } from './ts-performance'
import { PerformanceBench, type BenchmarkResult } from './benchmark'

const isRunning = ref(false)
const runningTests = reactive(new Set<string>())
const results = ref<BenchmarkResult[]>([])

const tests = [
  {
    name: 'Fibonacci (n=40)',
    description: 'Tính số Fibonacci thứ 40',
    icon: '🔢',
    wasmFn: () => WASMPerformance.fibonacci(40),
    tsFn: () => TSPerformance.fibonacci(40)
  },
  {
    name: 'Prime Sieve (100,000)',
    description: 'Tìm số nguyên tố đến 100,000',
    icon: '🔍',
    wasmFn: () => WASMPerformance.primeSieve(100000),
    tsFn: () => TSPerformance.primeSieve(100000)
  },
  {
    name: 'Quick Sort (50,000 items)',
    description: 'Sắp xếp mảng 50,000 số ngẫu nhiên',
    icon: '📊',
    wasmFn: () => {
      const arr = PerformanceBench.generateRandomArray(50000)
      return WASMPerformance.quickSort(arr)
    },
    tsFn: () => {
      const arr = PerformanceBench.generateRandomArray(50000)
      return TSPerformance.quickSort(arr)
    }
  },
  {
    name: 'Matrix Multiply (200x200)',
    description: 'Nhân hai ma trận 200x200',
    icon: '🧮',
    wasmFn: () => {
      const a = PerformanceBench.generateRandomMatrix(200)
      const b = PerformanceBench.generateRandomMatrix(200)
      return WASMPerformance.matrixMultiply(a, b, 200)
    },
    tsFn: () => {
      const a = PerformanceBench.generateRandomMatrix(200)
      const b = PerformanceBench.generateRandomMatrix(200)
      return TSPerformance.matrixMultiply(a, b, 200)
    }
  },
  {
    name: 'Image Blur (512x512)',
    description: 'Làm mờ ảnh 512x512 pixels',
    icon: '🖼️',
    wasmFn: () => {
      const pixels = PerformanceBench.generateRandomImageData(512, 512)
      return WASMPerformance.imageBlur(pixels, 512, 512)
    },
    tsFn: () => {
      const pixels = PerformanceBench.generateRandomImageData(512, 512)
      return TSPerformance.imageBlur(pixels, 512, 512)
    }
  }
]

onMounted(async () => {
  try {
    await WASMPerformance.init()
    console.log('WASM initialized successfully')
  } catch (error) {
    console.error('Failed to initialize WASM:', error)
  }
})

async function runSingleTest(testName: string) {
  const test = tests.find(t => t.name === testName)
  if (!test) return

  runningTests.add(testName)
  
  try {
    const result = await PerformanceBench.benchmark(
      test.name,
      test.wasmFn,
      test.tsFn
    )
    
    // Update existing result or add new one
    const existingIndex = results.value.findIndex(r => r.name === testName)
    if (existingIndex >= 0) {
      results.value[existingIndex] = result
    } else {
      results.value.push(result)
    }
  } catch (error) {
    console.error(`Error running test ${testName}:`, error)
  } finally {
    runningTests.delete(testName)
  }
}

async function runAllBenchmarks() {
  isRunning.value = true
  results.value = []
  
  for (const test of tests) {
    await runSingleTest(test.name)
  }
  
  isRunning.value = false
}

function clearResults() {
  results.value = []
}
</script>

<style scoped>
.header {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: 2rem;
}

.header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  font-weight: bold;
}

.header p {
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.9;
}

.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6b7280;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-secondary:hover:not(:disabled) {
  background: #4b5563;
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.test-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}
</style>
