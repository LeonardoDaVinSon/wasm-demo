<template>
  <div class="test-card">
    <div class="test-header">
      <span class="test-icon">{{ config.icon }}</span>
      <h3 class="test-title">{{ config.name }}</h3>
    </div>
    <p class="test-description">{{ config.description }}</p>
    
    <div class="input-section">
      <label class="input-label">{{ config.inputLabel }}</label>
      <input
        type="number"
        :value="inputValue"
        :min="config.min"
        :max="config.max"
        @input="handleInputChange"
        class="input-field"
        :disabled="isRunning"
      />
      <small class="input-hint">
        Giá trị từ {{ config.min?.toLocaleString() }} đến {{ config.max?.toLocaleString() }}
      </small>
    </div>
    
    <button
      @click="emit('run', config.name)"
      :disabled="isRunning"
      class="run-button"
    >
      {{ isRunning ? '⏳ Đang chạy...' : '▶️ Chạy test' }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface TestConfig {
  name: string
  description: string
  icon: string
  inputType: string
  inputLabel: string
  defaultValue: number
  min: number
  max: number
}

interface TestProps {
  config: TestConfig
  inputValue: number
  isRunning: boolean
}

const { config, inputValue, isRunning } = defineProps<TestProps>()

const emit = defineEmits<{
  run: [testName: string]
  'input-change': [value: number]
}>()

function handleInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  const value = parseInt(target.value, 10)
  
  if (!isNaN(value)) {
    emit('input-change', value)
  }
}
</script>

<style scoped>
.test-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: transform 0.2s, box-shadow 0.2s;
}

.test-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
}

.test-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.test-icon {
  font-size: 2rem;
}

.test-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.test-description {
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.input-section {
  margin-bottom: 1.5rem;
}

.input-label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.input-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.input-field:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.input-field:disabled {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

.input-hint {
  display: block;
  margin-top: 0.25rem;
  color: #6b7280;
  font-size: 0.75rem;
}

.run-button {
  width: 100%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.run-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}

.run-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
