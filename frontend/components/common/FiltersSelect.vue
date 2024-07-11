<template>
  <div class="w-full flex items-center justify-start flex-wrap gap-2">
    <button
      v-for="(filter, index) in filtersToShow"
      :key="filter.text"
      :class="[
        'px-4 py-2 capitalize font-semibold duration-200 border rounded-full text-sm shadow-sm hover:scale-105',
        filter.selected ? 'bg-indigo-800 text-white' : 'bg-white text-gray-500',
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

    <button
      v-if="props.shorten"
      class="bg-white px-4 py-2 capitalize font-semibold duration-200 border rounded-full text-sm shadow-sm hover:scale-105"
      @click="isExpanded = !isExpanded"
    >
      ...
    </button>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  filters: Array as PropType<
    {
      text: string;
      selected: boolean;
    }[]
  >,
  shorten: {
    type: Boolean,
    default: false,
  },
});

const filtersToShow = computed(() => {
  if (!props.shorten) return props.filters;
  return props.filters?.slice(0, isExpanded.value ? props.filters.length : 4);
});

const emit = defineEmits<{
  (
    eventName: "update:selectItem",
    value: { filterIndex: number; selected: boolean },
  ): void;
}>();

const isExpanded = ref(false);
</script>
