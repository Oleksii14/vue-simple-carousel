<template>
  <div id="app">
    <Carousel>
      <div class="item">1</div>
      <div class="item">2</div>
      <div class="item">3</div>
      <div class="item">3</div>
      <div class="item">3</div>
      <div class="item">3</div>
    </Carousel>
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
import { Component, Vue } from "vue-property-decorator";

import Carousel from "@/components/Carousel.vue";

@Component({
  components: {
    Carousel
  }
})
export default class App extends Vue {}
</script>

<style lang="scss"></style>
