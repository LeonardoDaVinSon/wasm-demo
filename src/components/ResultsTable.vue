<template>
  <div class="results-table">
    <h2>📊 Kết quả Performance</h2>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Test</th>
            <th>WASM (ms)</th>
            <th>TypeScript (ms)</th>
            <th>Tăng tốc</th>
            <th>Người thắng</th>
            <th>Kết quả</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="result in results" :key="result.name">
            <td class="test-name">{{ result.name }}</td>
            <td class="time-cell">{{ result.wasmTime.toFixed(2) }}</td>
            <td class="time-cell">{{ result.tsTime.toFixed(2) }}</td>
            <td class="speedup-cell">
              <span :class="['speedup-badge', result.speedup > 1 ? 'positive' : 'negative']">
                {{ result.speedup }}x
              </span>
            </td>
            <td class="winner-cell">
              <span :class="['winner-badge', result.winner]">
                {{ result.winner === 'wasm' ? '🦀 WASM' : '📘 TypeScript' }}
              </span>
            </td>
            <td class="result-cell">
              <div class="result-content">
                <div class="result-wasm">
                  <span class="result-label">🦀</span>
                  <span class="result-value">{{ formatResult(result.wasmResult, result.name) }}</span>
                </div>
                <div class="result-ts">
                  <span class="result-label">📘</span>
                  <span class="result-value">{{ formatResult(result.tsResult, result.name) }}</span>
                </div>
                <!-- <div v-if="hasResultMismatch(result)" class="result-warning">
                  ⚠️ Kết quả khác nhau
                </div> -->
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="summary">
      <div class="summary-stats">
        <div class="stat">
          <span class="stat-label">WASM Wins:</span>
          <span class="stat-value">{{ wasmWins }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">TypeScript Wins:</span>
          <span class="stat-value">{{ tsWins }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Average Speedup:</span>
          <span class="stat-value">{{ averageSpeedup.toFixed(2) }}x</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BenchmarkResult } from '../benchmark'

interface Props {
  results: BenchmarkResult[]
}

const props = defineProps<Props>()

const wasmWins = computed(() => 
  props.results.filter((r: BenchmarkResult) => r.winner === 'wasm').length
)

const tsWins = computed(() => 
  props.results.filter((r: BenchmarkResult) => r.winner === 'ts').length
)

const averageSpeedup = computed(() => {
  if (props.results.length === 0) return 0
  const sum = props.results.reduce((acc: number, r: BenchmarkResult) => acc + r.speedup, 0)
  return sum / props.results.length
})

function formatResult(result: any, testName: string): string {
  console.log(`formatResult for ${testName}:`, result, typeof result);
  
  if (result === undefined || result === null) {
    return 'N/A'
  }

  // Extract test type from test name
  const testType = testName.split('(')[0].trim()
  
  switch (testType) {
    case 'Fibonacci':
      // Handle both number and BigInt types
      if (typeof result === 'number' || typeof result === 'bigint') {
        return result.toString()
      }
      return `Invalid (${typeof result}): ${String(result)}`
      
    case 'Prime Sieve':
      if (Array.isArray(result)) {
        return `${result.length} số nguyên tố`
      }
      return typeof result === 'number' ? `${result} số nguyên tố` : `Invalid (${typeof result})`
      
    case 'Quick Sort':
      if (Array.isArray(result)) {
        return `${result.length} phần tử được sắp xếp`
      }
      return `Invalid (${typeof result})`
      
    case 'Matrix Multiply':
      if (Array.isArray(result)) {
        const size = Math.sqrt(result.length)
        return `Ma trận ${size}x${size}`
      }
      return `Invalid (${typeof result})`
      
    case 'Image Blur':
      if (result instanceof Uint8Array || Array.isArray(result)) {
        const pixels = result.length / 4 // RGBA format
        const size = Math.sqrt(pixels)
        return `${size}x${size} pixels`
      }
      return `Invalid (${typeof result})`
      
    default:
      return String(result).substring(0, 50) + (String(result).length > 50 ? '...' : '')
  }
}

function hasResultMismatch(result: BenchmarkResult): boolean {
  if (!result.wasmResult || !result.tsResult) {
    return false
  }

  const testType = result.name.split('(')[0].trim()
  
  switch (testType) {
    case 'Fibonacci':
      // Convert both to numbers for comparison
      const wasmNum = typeof result.wasmResult === 'bigint' ? Number(result.wasmResult) : result.wasmResult
      const tsNum = typeof result.tsResult === 'bigint' ? Number(result.tsResult) : result.tsResult
      return wasmNum !== tsNum
      
    case 'Prime Sieve':
      if (Array.isArray(result.wasmResult) && Array.isArray(result.tsResult)) {
        return result.wasmResult.length !== result.tsResult.length
      }
      return result.wasmResult !== result.tsResult
      
    case 'Quick Sort':
      if (Array.isArray(result.wasmResult) && Array.isArray(result.tsResult)) {
        return result.wasmResult.length !== result.tsResult.length
      }
      return false
      
    case 'Matrix Multiply':
      if (Array.isArray(result.wasmResult) && Array.isArray(result.tsResult)) {
        return result.wasmResult.length !== result.tsResult.length
      }
      return false
      
    case 'Image Blur':
      if ((result.wasmResult instanceof Uint8Array || Array.isArray(result.wasmResult)) &&
          (result.tsResult instanceof Uint8Array || Array.isArray(result.tsResult))) {
        return result.wasmResult.length !== result.tsResult.length
      }
      return false
      
    default:
      return false
  }
}
</script>

<style scoped>
.results-table {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.results-table h2 {
  margin: 0 0 1.5rem 0;
  color: #1f2937;
  font-size: 1.5rem;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 1.5rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #f9fafb;
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

td {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.test-name {
  font-weight: 500;
  color: #1f2937;
}

.time-cell {
  font-family: 'Monaco', 'Menlo', monospace;
  color: #6b7280;
}

.speedup-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.875rem;
}

.speedup-badge.positive {
  background: #dcfce7;
  color: #166534;
}

.speedup-badge.negative {
  background: #fef2f2;
  color: #991b1b;
}

.winner-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.875rem;
}

.winner-badge.wasm {
  background: #ddd6fe;
  color: #5b21b6;
}

.winner-badge.ts {
  background: #dbeafe;
  color: #1d4ed8;
}

.result-cell {
  font-size: 0.875rem;
  max-width: 200px;
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.result-wasm,
.result-ts {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: #f9fafb;
}

.result-wasm {
  border-left: 3px solid #8b5cf6;
}

.result-ts {
  border-left: 3px solid #3b82f6;
}

.result-label {
  font-size: 0.75rem;
  flex-shrink: 0;
}

.result-value {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.75rem;
  color: #374151;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-warning {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: #fef2f2;
  color: #991b1b;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.summary {
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.summary-stats {
  display: flex;
  gap: 2rem;
  justify-content: center;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

@media (max-width: 768px) {
  .summary-stats {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
