<script setup lang="ts">
defineProps<{
  categories: string[]
  selected: string
}>()

defineEmits<{
  'update:selected': [value: string]
}>()
</script>

<template>
  <nav class="category-filter" aria-label="Category filter">
    <button
      class="filter-chip"
      :class="{ 'filter-chip--active': selected === '' }"
      @click="$emit('update:selected', '')"
    >
      All
    </button>
    <button
      v-for="cat in categories"
      :key="cat"
      class="filter-chip"
      :class="{ 'filter-chip--active': selected === cat }"
      @click="$emit('update:selected', cat)"
    >
      {{ cat }}
    </button>
  </nav>
</template>

<style scoped>
.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-chip {
  padding: 7px 16px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: 100px;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
  text-transform: capitalize;
  white-space: nowrap;
  transition: all var(--transition-fast);
}

.filter-chip:hover {
  background: var(--bg-hover);
  border-color: var(--border-hover);
  color: var(--text-primary);
}

.filter-chip--active {
  background: var(--text-primary);
  border-color: var(--text-primary);
  color: var(--text-inverse);
}

.filter-chip--active:hover {
  background: var(--text-primary);
  border-color: var(--text-primary);
  color: var(--text-inverse);
  opacity: 0.9;
}
</style>
