<template>
  <div class="w-full flex items-center justify-start flex-wrap gap-2">
    <TransitionGroup name="scale-in">
      <button
        v-for="(filter, index) in filters"
        :key="filter.text"
        :class="[
          'px-4 py-2 capitalize font-semibold duration-200 border rounded-full text-sm shadow-sm',
          filter.selected
            ? 'bg-indigo-800 text-white'
            : 'bg-white text-gray-500',
        ]"
        @click="
          emit('update:selectItem', {
            filterIndex: index,
            selected: !filter.selected,
          })
        "
      >
        {{ filter.text }}
      </button>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  filters: Array<any>,
});

const emit = defineEmits<{
  (
    eventName: "update:selectItem",
    value: { filterIndex: number; selected: boolean },
  ): void;
}>();
</script>
