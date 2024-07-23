<template>
  <input
    v-model="inputted"
    type="text"
    maxlength="30"
    class="create-campaign-input w-full border border-gray-300 outline-indigo-800 rounded-lg font-thin shadow-sm px-4 py-2"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: String as PropType<string | null>,
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
