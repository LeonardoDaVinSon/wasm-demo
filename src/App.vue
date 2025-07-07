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
          v-for="config in testConfigs"
          :key="config.name"
          :config="config"
          :input-value="testInputs[config.name as keyof typeof testInputs]"
          :is-running="runningTests.has(config.name)"
          @run="runSingleTest"
          @input-change="(value) => testInputs[config.name as keyof typeof testInputs] = value"
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

const testConfigs = [
  {
    name: 'Fibonacci',
    description: 'Tính số Fibonacci',
    icon: '🔢',
    inputType: 'number',
    inputLabel: 'Số thứ n:',
    defaultValue: 40,
    min: 1,
    max: 50
  },
  {
    name: 'Prime Sieve',
    description: 'Tìm số nguyên tố',
    icon: '🔍',
    inputType: 'number',
    inputLabel: 'Giới hạn:',
    defaultValue: 100000,
    min: 10,
    max: 1000000
  },
  {
    name: 'Quick Sort',
    description: 'Sắp xếp mảng ngẫu nhiên',
    icon: '📊',
    inputType: 'number',
    inputLabel: 'Số phần tử:',
    defaultValue: 50000,
    min: 1000,
    max: 100000
  },
  {
    name: 'Matrix Multiply',
    description: 'Nhân hai ma trận vuông',
    icon: '🧮',
    inputType: 'number',
    inputLabel: 'Kích thước ma trận:',
    defaultValue: 200,
    min: 50,
    max: 500
  },
  {
    name: 'Image Blur',
    description: 'Làm mờ ảnh vuông',
    icon: '🖼️',
    inputType: 'number',
    inputLabel: 'Kích thước ảnh:',
    defaultValue: 512,
    min: 128,
    max: 1024
  }
]

// Generate test functions based on configs and inputs
function generateTestFunctions(config: any, input: number) {
  const testName = config.name
  const fullName = `${config.name} (${input.toLocaleString()})`
  
  switch (testName) {
    case 'Fibonacci':
      return {
        name: fullName,
        description: `${config.description} thứ ${input}`,
        icon: config.icon,
        wasmFn: () => WASMPerformance.fibonacci(input),
        tsFn: () => TSPerformance.fibonacci(input)
      }
    case 'Prime Sieve':
      return {
        name: fullName,
        description: `${config.description} đến ${input.toLocaleString()}`,
        icon: config.icon,
        wasmFn: () => WASMPerformance.primeSieve(input),
        tsFn: () => TSPerformance.primeSieve(input)
      }
    case 'Quick Sort':
      const sortArray = PerformanceBench.generateRandomArray(input)
      return {
        name: fullName,
        description: `${config.description} ${input.toLocaleString()} phần tử`,
        icon: config.icon,
        wasmFn: () => {
          return WASMPerformance.quickSort([...sortArray])
        },
        tsFn: () => {
          return TSPerformance.quickSort([...sortArray])
        }
      }
    case 'Matrix Multiply':
      const matrixA = PerformanceBench.generateRandomMatrix(input)
      const matrixB = PerformanceBench.generateRandomMatrix(input)
      return {
        name: fullName,
        description: `${config.description} ${input}x${input}`,
        icon: config.icon,
        wasmFn: () => {
          return WASMPerformance.matrixMultiply([...matrixA], [...matrixB], input)
        },
        tsFn: () => {
          return TSPerformance.matrixMultiply([...matrixA], [...matrixB], input)
        }
      }
    case 'Image Blur':
      const pixels = PerformanceBench.generateRandomImageData(input, input)
      return {
        name: fullName,
        description: `${config.description} ${input}x${input} pixels`,
        icon: config.icon,
        wasmFn: () => {
          return WASMPerformance.imageBlur(new Uint8Array(pixels), input, input)
        },
        tsFn: () => {
          return TSPerformance.imageBlur(new Uint8Array(pixels), input, input)
        }
      }
    default:
      throw new Error(`Unknown test: ${testName}`)
  }
}

const testInputs = reactive({
  'Fibonacci': 40,
  'Prime Sieve': 100000,
  'Quick Sort': 50000,
  'Matrix Multiply': 200,
  'Image Blur': 512
})

onMounted(async () => {
  try {
    await WASMPerformance.init()
    console.log('WASM initialized successfully')
  } catch (error) {
    console.error('Failed to initialize WASM:', error)
  }
})

async function runSingleTest(testName: string) {
  const config = testConfigs.find(c => c.name === testName)
  if (!config) return

  const input = testInputs[testName as keyof typeof testInputs]
  const test = generateTestFunctions(config, input)

  runningTests.add(testName)
  
  try {
    const result = await PerformanceBench.benchmark(
      test.name,
      test.wasmFn,
      test.tsFn
    )
    
    // Update existing result or add new one
    const existingIndex = results.value.findIndex((r: BenchmarkResult) => r.name === test.name)
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
  
  for (const config of testConfigs) {
    await runSingleTest(config.name)
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
