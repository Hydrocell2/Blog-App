<template>
  <div id="app">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
    <RightSidebar />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
import RightSidebar from './components/RightSidebar.vue';
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
}

.main-content {
  flex: 1;
  margin-left: 70px;
  min-height: 100vh;
}

@media (min-width: 1400px) {
  .main-content {
    margin-right: 320px;
  }
}
</style>
