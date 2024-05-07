<template>
  <div
    class="relative text-gray-700 w-full max-w-xl flex flex-col justify-center items-center gap-3"
  >
    <div
      class="rounded-full bg-gray-100 w-full overflow-hidden py-3 px-5 max-w-xl flex items-center gap-3"
    >
      <IconsSearch />

      <input
        type="text"
        placeholder=" Search for campaigns"
        class="w-full bg-transparent hide-scrollbar outline-none caret-indigo-500"
      />
    </div>

    <div class="w-full flex items-center justify-start flex-wrap gap-2">
      <TransitionGroup name="scale-in">
        <div
          v-for="filter in selectedFilters"
          :key="filter.text"
          class="overflow-hidden divide-x grid grid-cols-2 items-stretch capitalize font-semibold bg-white hover:bg-gray-100 active:bg-gray-100 duration-200 border rounded-full text-sm text-gray-500"
          style="grid-template-columns: 1fr min-content"
        >
          <div class="pl-[.875rem] pr-3 line-clamp-1 leading-8 overflow-hidden">
            {{ filter.text }}
          </div>
          <button
            class="pl-2 pr-2.5 h-full flex items-center justify-center"
            @click="filter.selected = false"
          >
            <IconsCross :size="1.25" />
          </button>
        </div>
      </TransitionGroup>

      <div class="relative h-full flex flex-col items-center justify-center">
        <button
          class="bg-white hover:bg-gray-100 active:bg-gray-100 duration-200 py-1.5 pl-3 pr-4 border border-dashed rounded-full text-sm font-medium text-gray-500 flex items-center justify-center gap-2"
          @click.stop="opened = !opened"
        >
          <IconsFilter />
          Add Filter
        </button>

        <div>
          <CommonMultiselect
            :filters="filters"
            :opened="opened"
            @close="opened = false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  filters: Array<{ text: string; selected: boolean }>,
});

const selectedFilters = computed(() =>
  props.filters?.filter((filter) => filter.selected),
);

const opened = ref(false);
</script>

<style lang="scss" scoped>
.scale-in {
  &-enter-active,
  &-leave-active {
    transition: max-width scale 3s;
    transform-origin: left;
  }

  &-enter-from,
  &-leave-to {
    max-width: 0;
    transform: scaleX(0);
  }

  &-enter-to,
  &-leave-from {
    max-width: 10rem;
    transform: scaleX(1);
  }
}
</style>
