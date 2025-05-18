<template>
  <a-textarea
    :value="value"
    @change="(e) => handleChange?.(e.target.value)"
    :placeholder="placeholder"
    :auto-size="{ minRows: 3, maxRows: 3 }"
    allow-clear
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  value?: string
  handleChange?: (value: string) => void
  placeholder?: string
}>()
</script>

<style scoped>
:deep(.ant-input) {
  font-size: 14px;
}
</style>
