<template>
  <textarea
    v-model="inputted"
    rows="5"
    class="bg-white create-campaign-input w-full border border-gray-300 outline-indigo-800 rounded-lg font-thin shadow-sm text-lg px-4 py-2 resize-none"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: [String, null] as any,
    required: true,
  },
});

const emit = defineEmits<{
  (eventName: "update:modelValue", value: string | null): void;
}>();

const inputted = computed({
  get: () => props.modelValue,
  set: (value: string | null) => {
    emit("update:modelValue", value);
  },
});
</script>
