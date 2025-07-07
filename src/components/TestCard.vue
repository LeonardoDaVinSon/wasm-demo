<template>
  <div class="test-card">
    <div class="test-header">
      <span class="test-icon">{{ test.icon }}</span>
      <h3 class="test-title">{{ test.name }}</h3>
    </div>
    <p class="test-description">{{ test.description }}</p>
    <button
      @click="$emit('run', test.name)"
      :disabled="isRunning"
      class="run-button"
    >
      {{ isRunning ? '⏳ Đang chạy...' : '▶️ Chạy test' }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface TestProps {
  test: {
    name: string
    description: string
    icon: string
    wasmFn: () => any
    tsFn: () => any
  }
  isRunning: boolean
}

defineProps<TestProps>()
defineEmits<{
  run: [testName: string]
}>()
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
