<template>
  <label
    :class="[
      'size-[1.125rem] border rounded-md duration-200 flex justify-center items-center cursor-pointer',
      checked ? 'bg-indigo-800 border-indigo-800' : 'bg-white border-gray-300',
    ]"
  >
    <IconsCheck :size="'0.85rem'" color="#fff" />

    <input
      v-model="checked"
      type="checkbox"
      class="w-0 h-0 border-0 outline-none select-none"
      :disabled="disabled"
    />
  </label>
</template>

<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  disabled: { type: Boolean, default: false },
});
const emit = defineEmits<{
  (eventName: "update:modelValue", value: boolean): void;
}>();

const checked = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});
</script>
