<template>
  <div ref="avatarElement" class="z-50 address-avatar"></div>
</template>

<script lang="ts" setup>
const colors = ["indigo", "blue", "pink"];
const avatarElement = ref<HTMLElement | null>(null);
onMounted(() => {
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  avatarElement.value?.classList.add("gradient", randomColor);
});
</script>

<style lang="scss">
.address-avatar {
  @apply size-5 rounded-full;
}

.gradient {
  &.indigo {
    background: radial-gradient(
      circle,
      rgba(55, 48, 163, 0.1) 0%,
      rgba(55, 48, 163, 0.7) 100%
    );
  }
  &.blue {
    background: radial-gradient(
      circle,
      rgba(29, 78, 216, 0.1) 0%,
      rgba(29, 78, 216, 0.7) 100%
    );
  }
  &.pink {
    background: radial-gradient(
      circle,
      rgba(226, 137, 205, 0.1) 0%,
      rgba(226, 137, 205, 0.7) 100%
    );
  }
}
</style>
