<template>
  <label
    :class="`${modelValue ? 'p-1.5' : 'py-10 px-5'} upload-label ${imageInputFocused ? 'active' : ''} create-campaign-input`"
    @drop="handleDrop"
    @dragover="(e) => e.preventDefault()"
    @dragenter="(e) => e.preventDefault()"
  >
    <div v-if="!modelValue">
      <IconsImage />
    </div>

    <div class="relative">
      <img ref="imageElement" class="w-full rounded-lg" />
      <button
        v-if="modelValue"
        class="show absolute top-2 right-2 bg-black bg-opacity-50 rounded-full flex items-center justify-center size-7 text-white"
      >
        <IconsCross @click="clearInput" />
      </button>
    </div>

    <div
      v-if="!modelValue"
      :class="`${modelValue ? 'mt-5' : 'mt-2'} text-center font-medium`"
    >
      <span class="underline text-indigo-700 underline-offset-2"
        >Click to upload</span
      >
      or drag and drop
    </div>
    <input
      ref="inputElement"
      type="file"
      accept=".png, .jpg , .jpeg , .jfif , .pjpeg , .pjp"
      alt="Image input"
      class="w-0 h-0 overflow-hidden"
      @change="handleInput"
      @focus="() => (imageInputFocused = true)"
      @blur="() => (imageInputFocused = false)"
    />
  </label>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Object as PropType<File | null>,
    required: true,
  },
});

const emit = defineEmits<{
  (eventName: "update:modelValue", value: File | null): void;
}>();

const inputElement = ref<HTMLInputElement | null>(null);
const imageElement = ref<HTMLImageElement | null>(null);

// Allowed file types
const allowedTypes = [".png", ".jpg", ".jpeg", ".jfif", ".pjpeg", ".pjp"];

// Helper function to check if a file type is allowed
function isFileTypeAllowed(fileName: string) {
  return allowedTypes.some((type) => fileName.toLowerCase().endsWith(type));
}

function handleDrop(event: DragEvent) {
  event.preventDefault();
  if (!event.dataTransfer) return;

  // Filter out files that don't match the allowed types
  const filteredFiles = Array.from(event.dataTransfer.files).filter((file) =>
    isFileTypeAllowed(file.name),
  );

  // Use a DataTransfer object to override the input element's files property
  const dataTransfer = new DataTransfer();
  filteredFiles.forEach((file) => dataTransfer.items.add(file));

  if (inputElement.value && dataTransfer.files.length) {
    inputElement.value.files = dataTransfer.files;
    emit("update:modelValue", dataTransfer.files[0]);
    setInputImage();
  }
}

function handleInput() {
  if (!inputElement.value?.files?.length) return;
  emit("update:modelValue", inputElement.value.files[0]);
  setInputImage();
}

function setInputImage(image?: File) {
  if (!inputElement.value?.files?.length && !image) return;

  const imageToApply = image || inputElement.value?.files?.[0];
  if (imageElement.value && imageToApply) {
    imageElement.value.src = URL.createObjectURL(imageToApply);
  }
}

function clearInput(event: Event) {
  event.preventDefault();
  imageElement.value!.src = "";
  if (inputElement.value) {
    inputElement.value.value = "";
  }
  emit("update:modelValue", null);
}

onMounted(() => {
  props.modelValue && setInputImage(props.modelValue);
});

const imageInputFocused = ref(false);
</script>

<style lang="scss" scoped>
.upload-label {
  @apply relative flex flex-col items-center justify-center
    mlg:min-h-64 overflow-hidden
    rounded-lg 
    text-gray-500 text-base
    cursor-pointer duration-200;

  &:before {
    @apply duration-200 rounded-xl absolute -top-1 -left-1 -right-1 -bottom-1 border-[5px] border-gray-400 border-dashed;
    content: "";
  }

  &:hover,
  &:active {
    @apply text-indigo-800 border-indigo-800 bg-indigo-800 bg-opacity-5;

    &:before {
      @apply border-indigo-800;
    }
  }

  &.active {
    @apply text-indigo-800 border-indigo-800 bg-indigo-800 bg-opacity-5;

    &:before {
      @apply border-indigo-800;
    }
  }
}

.show {
  animation: show 0.5s ease-in-out;
}

@keyframes show {
  0% {
    opacity: 0;
    scale: 0;
  }
  100% {
    opacity: 1;
    scale: 1;
  }
}
</style>
