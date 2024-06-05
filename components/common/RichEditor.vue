<template>
  <div ref="el"></div>
</template>

<script setup lang="ts">
import { Editor } from "@toast-ui/editor";

const props = defineProps({
  modelValue: {
    type: [String, null] as PropType<string | null>,
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

const el = ref<HTMLElement | null>(null);
let editor: Editor | null = null;
onMounted(() => {
  editor = new Editor({
    el: el.value,
    height: "auto",
    initialEditType: "wysiwyg",
    previewStyle: "vertical",
    events: {
      change: () => {
        inputted.value = editor?.getMarkdown() ?? null;
      },
    },
  });
});
onBeforeUnmount(() => {
  editor?.destroy();
});
</script>
