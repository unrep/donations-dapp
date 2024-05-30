<template>
  <!-- Desktop -->
  <div
    class="w-full h-full max-h-screen hidden mlg:flex flex-col items-center justify-center bg-none mlg:slide-in mlg:p-10 mlg:py-10"
  >
    <div
      ref="container"
      class="scroll-smooth overflow-y-auto w-full h-full p-10 flex flex-col items-center justify-center bg-white bg-opacity-90 backdrop-blur-3xl input-container rounded-3xl"
    >
      <div
        :class="[
          'w-full h-full flex flex-col items-center justify-between gap-10',
          limitSize ? 'max-w-2xl' : '',
        ]"
      >
        <slot />
      </div>
    </div>
  </div>

  <!-- Mobile -->
  <div
    class="flex-grow flex mlg:hidden flex-col items-start justify-between gap-5 w-full h-full p-5 bg-white"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
const { limitSize } = defineProps<{
  onContinue: () => void;
  limitSize: boolean;
}>();

const container = ref<HTMLDivElement | null>(null);

const scrollUp = () => {
  if (container.value) {
    container.value.scrollTop = 0;
  }
};

defineExpose({
  scrollUp,
});
</script>

<style lang="scss">
.scale-enter-active,
.scale-leave-active {
  transition: scale 0.2s ease-in-out;
}

.scale-enter-from,
.scale-leave-to {
  scale: 0;
}

@media (min-width: 896px) {
  .slide-in {
    animation: slideInFromRightWithBounce 0.5s ease-out;
  }

  .input-container {
    box-shadow: 0px 0px 30px -20px rgba(0, 0, 0, 0.5);
  }
}

@keyframes slideInFromRightWithBounce {
  0% {
    transform: translateX(100%);
    width: 200%;
  }
  70% {
    transform: translateX(-5%);
  }
  100% {
    width: 100%;
    transform: translateX(0);
  }
}
</style>
