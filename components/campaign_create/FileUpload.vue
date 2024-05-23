<template>
  <label
    :class="`${image ? 'p-1.5' : 'p-5'} upload-label`"
    @drop="handleDrop"
    @dragover="(e) => e.preventDefault()"
    @dragenter="(e) => e.preventDefault()"
  >
    <div v-if="!image">
      <IconsImage />
    </div>

    <div class="relative">
      <img ref="imageElement" class="w-full rounded-2xl" />
      <button
        v-if="image"
        class="show absolute top-2 right-2 bg-black bg-opacity-50 rounded-full flex items-center justify-center size-7 text-white"
      >
        <IconsCross @click="clearInput" />
      </button>
    </div>

    <div v-if="!image" :class="`${image ? 'mt-5' : 'mt-2'} text-center`">
      {{ "Upload campaign image" }}
    </div>
    <input
      ref="inputElement"
      type="file"
      accept=".png, .jpg , .jpeg , .jfif , .pjpeg , .pjp"
      alt="Image input"
      class="w-0 h-0 overflow-hidden"
      @change="handleInput"
    />
  </label>
</template>

<script setup lang="ts">
import { useCampaignStore } from "~/stores/campaign.store";

const { image } = storeToRefs(useCampaignStore());

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
    image.value = dataTransfer.files[0];
    setInputImage();
  }
}

function handleInput() {
  if (!inputElement.value?.files?.length) return;
  image.value = inputElement.value.files[0];
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
  image.value = null;
}

onMounted(() => {
  image.value && setInputImage(image.value);
});
</script>

<style lang="scss" scoped>
.upload-label {
  @apply flex flex-col items-center justify-center
    mlg:min-h-64
    rounded-3xl border border-gray-400 border-dashed 
    text-gray-500 text-base
    cursor-pointer duration-200;

  &:hover,
  &:active {
    @apply text-indigo-800 border-indigo-500;
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
