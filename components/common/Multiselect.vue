<template>
  <Transition name="slide">
    <div
      v-if="opened"
      ref="multiselectRef"
      class="bg-white absolute -left-1 w-60 border rounded-xl overflow-y-auto shadow-sm mt-1 overflow-hidden"
    >
      <div class="w-full py-2 pl-3 pr-2 flex items-center gap-2 border-b">
        <IconsSearch />

        <input
          type="text"
          placeholder="Search by..."
          class="w-full bg-transparent outline-none caret-indigo-500 text-sm"
        />
      </div>

      <div class="flex flex-col">
        <button
          v-for="filter in props.filters"
          :key="filter.text"
          class="capitalize font-semibold hover:bg-gray-100 active:bg-gray-100 py-1.5 px-3 flex justify-between items-center duration-200"
          @click="filter.selected = !filter.selected"
        >
          {{ filter.text }}
          <CommonCheckBox v-model="filter.selected" :disabled="true" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const multiselectRef = ref<HTMLDivElement | null>(null);

const props = defineProps({
  opened: Boolean,
  filters: Array<{ text: string; selected: boolean }>,
});

const emit = defineEmits(["close"]);

const handleClickOutside = (event: MouseEvent) => {
  multiselectRef.value &&
    !multiselectRef.value.contains(event.target as Node) &&
    emit("close");
};

watch(
  () => props.opened,
  (opened) => {
    if (opened) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
  },
);
</script>

<style lang="scss">
.slide-enter-active,
.slide-leave-active {
  transition:
    max-height 0.2s ease-in-out,
    opacity 0.2s ease-in-out;
  max-height: 0; /* Initial state */
  opacity: 0.5;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0; /* Start collapsed */
}

.slide-enter-to,
.slide-leave-from {
  max-height: 220px; /* Maximum expanded height, around 5-6 items */
  opacity: 1;
}
</style>
