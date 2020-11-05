<template>
  <div id="app">
    <SimpleCarousel>
      <div class="item">1</div>
      <div class="item">2</div>
      <div class="item">3</div>
      <div class="item">4</div>
      <div class="item">5</div>
      <div class="item">6</div>
    </SimpleCarousel>
  </div>
</template>

<style lang="scss" scoped>
#app {
  height: 200px;
}

.item {
  display: flex;
  align-items: center;
  justify-content: center;

  background: blueviolet;
  font-size: 16px;

  height: 100%;
}
</style>

<script lang="ts">
import Vue from "vue";
import SimpleCarousel from "@/components/SimpleCarousel.vue";

export default Vue.extend({
  components: {
    SimpleCarousel
  }
});
</script>
