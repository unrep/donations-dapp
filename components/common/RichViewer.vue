<template>
  <div ref="el"></div>
</template>

<script setup lang="ts">
import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
});

const el = ref<HTMLElement | null>(null);
let editor: Viewer | null = null;
onMounted(() => {
  editor = new Viewer({
    el: el.value,
    height: "auto",
    initialValue: props.content,
  });
});
onBeforeUnmount(() => {
  editor?.destroy();
});
</script>
