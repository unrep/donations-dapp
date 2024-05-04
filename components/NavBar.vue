<template>
  <div
    class="z-50 sticky top-0 left-0 w-full p-5 bg-opacity-50 backdrop-blur-lg flex items-center justify-center border-b nav-shadow"
  >
    <div class="w-full max-w-7xl flex justify-between items-center">
      <div class="text-4xl font-black text-indigo-600">Raise&Reach</div>

      <div class="flex items-center gap-5">
        <a href="/" class="nav-button active">Home</a>
        <a href="/create-campaign" class="nav-button">Start campaign</a>
        <a class="nav-button">Search</a>
      </div>
    </div>
  </div>
</template>

<style>
.nav-shadow {
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
}

.nav-button {
  @apply px-5 py-2  text-indigo-600 text-lg font-bold rounded-lg duration-200 cursor-pointer;

  &.active {
    @apply scale-110;
  }

  &:hover {
    @apply scale-105;
  }
}
</style>
