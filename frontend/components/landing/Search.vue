<template>
  <div
    class="relative text-gray-700 w-full max-w-3xl flex flex-col justify-center items-center gap-3"
  >
    <div
      class="rounded-full bg-gray-100 w-full overflow-hidden py-3 px-5 max-w-xl flex items-center gap-3"
    >
      <IconsSearch />

      <input
        type="text"
        placeholder=" Search for campaigns"
        class="w-full bg-transparent hide-scrollbar outline-none caret-indigo-800"
      />
    </div>

    <slot name="filters" />
  </div>
</template>

<style lang="scss" scoped>
.scale-in {
  &-enter-active,
  &-leave-active {
    transition: max-width scale 3s;
    transform-origin: left;
  }

  &-enter-from,
  &-leave-to {
    max-width: 0;
    transform: scaleX(0);
  }

  &-enter-to,
  &-leave-from {
    max-width: 10rem;
    transform: scaleX(1);
  }
}
</style>
