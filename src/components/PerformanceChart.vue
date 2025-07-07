<template>
  <div class="performance-chart">
    <h2>📈 Biểu đồ so sánh hiệu năng</h2>
    <div class="chart-container">
      <div class="chart-bar" v-for="result in results" :key="result.name">
        <div class="bar-header">
          <span class="bar-title">{{ result.name }}</span>
          <span class="speedup-indicator" :class="result.winner">
            {{ result.speedup }}x {{ result.winner === 'wasm' ? 'faster' : 'slower' }}
          </span>
        </div>
        <div class="bars">
          <div class="bar-group">
            <div class="bar-label">WASM</div>
            <div class="bar-container">
              <div 
                class="bar wasm-bar"
                :style="{ width: getBarWidth(result.wasmTime, result) + '%' }"
              ></div>
              <span class="time-label">{{ result.wasmTime.toFixed(2) }}ms</span>
            </div>
          </div>
          <div class="bar-group">
            <div class="bar-label">TypeScript</div>
            <div class="bar-container">
              <div 
                class="bar ts-bar"
                :style="{ width: getBarWidth(result.tsTime, result) + '%' }"
              ></div>
              <span class="time-label">{{ result.tsTime.toFixed(2) }}ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BenchmarkResult } from '../benchmark'

interface Props {
  results: BenchmarkResult[]
}

const props = defineProps<Props>()

function getBarWidth(time: number, result: BenchmarkResult): number {
  const maxTime = Math.max(result.wasmTime, result.tsTime)
  return (time / maxTime) * 100
}
</script>

<style scoped>
.performance-chart {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.performance-chart h2 {
  margin: 0 0 1.5rem 0;
  color: #1f2937;
  font-size: 1.5rem;
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.chart-bar {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  background: #fafafa;
}

.bar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.bar-title {
  font-weight: 600;
  color: #1f2937;
  font-size: 1.1rem;
}

.speedup-indicator {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
}

.speedup-indicator.wasm {
  background: #dcfce7;
  color: #166534;
}

.speedup-indicator.ts {
  background: #fef2f2;
  color: #991b1b;
}

.bars {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.bar-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.bar-label {
  width: 80px;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.bar-container {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
}

.bar {
  height: 24px;
  border-radius: 4px;
  min-width: 2px;
  transition: width 0.5s ease-in-out;
}

.wasm-bar {
  background: linear-gradient(90deg, #8b5cf6, #a855f7);
}

.ts-bar {
  background: linear-gradient(90deg, #3b82f6, #2563eb);
}

.time-label {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.875rem;
  color: #6b7280;
  min-width: 60px;
}

@media (max-width: 768px) {
  .bar-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .bar-group {
    flex-direction: column;
    align-items: stretch;
    gap: 0.25rem;
  }
  
  .bar-label {
    width: auto;
  }
}
</style>
