<template>
  <div
    ref="carousel"
    class="carousel"
    :style="{
      height: autoHeight ? 'auto' : '100%'
    }"
  >
    <div v-if="enableButtons && !$slots.customButtons" class="carousel__buttons">
      <button class="carousel__button" @click="prev">
        <slot v-if="$slots.prevButton" name="prevButton" />
        <span v-else>&#60;</span>
      </button>

      <button class="carousel__button" @click="next">
        <slot v-if="$slots.nextButton" name="nextButton" />
        <span v-else>&#62;</span>
      </button>
    </div>

    <template>
      <slot name="customButtons" />
    </template>

    <div
      class="carousel__track"
      :style="{
        width: `${trackWidth}px`,
        transform: `translateX(${translateValue}px)`,
        transition: `transform ${speed / 10000}s`
      }"
    >
      <div
        v-for="(element, idx) in $slots.default"
        ref="carouselElement"
        :key="`${element.tag}-${idx}`"
        :style="{
          width: `${carouselElementWidth}px`
        }"
        class="carousel__element"
      >
        <PassedNode :nodes="element" />
      </div>
    </div>

    <div
      class="carousel__dots"
      :style="{
        margin: dotsData.margin,
        padding: dotsData.padding,
        justifyContent: dotsData.alignment === 'center' ? 'center' : `flex-${dotsData.alignment}`,
      }"
    >
      <button
        v-for="(dot, idx) in $slots.default.length"
        :key="`carousel-dot-${idx}`"
        :style="{
          width: `${dotsData.dots.size}px`,
          height: `${dotsData.dots.size}px`,
          backgroundColor: dotsData.dots.color,
          border: dotsData.dots.border,
          marginRight:
            idx === $slots.default.length - 1 ? 0 : `${dotsData.dots.spacing}px`
        }"
        :class="{
          carousel__dot: true,
          'carousel__dot--circled': dotsData.dots.circled
        }"
      >
        {{ idx }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.carousel {
  width: 100%;

  display: flex;
  flex-direction: column;

  overflow: hidden;

  position: relative;

  &__track {
    display: flex;

    flex: 1;
  }

  &__element {
    flex: 1;
  }

  &__buttons {
    display: flex;
    justify-content: space-between;

    position: absolute;
    top: 50%;
    left: 0;

    transform: translateY(-50%);

    width: 100%;

    z-index: 2;
  }

  &__dots {
    display: flex;
    align-items: center;
  }

  &__dot {
    padding: 0;

    outline: none;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }

    &--circled {
      border-radius: 50%;
    }
  }
}
</style>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { RenderContext, CreateElement } from "vue";

import { IDotsData } from "./interfaces";
import { DEFAULT_DOTS_DATA } from "./helpers";

@Component({
  components: {
    PassedNode: {
      functional: true,
      render: (_: CreateElement, ctx: RenderContext) => ctx.props.nodes
    }
  }
})
export default class Carousel extends Vue {
  @Prop({ default: false, type: Boolean })
  private autoHeight!: boolean;

  @Prop({ default: true, type: Boolean })
  private enableButtons!: boolean;

  @Prop({ default: false, type: Boolean })
  private enableDots!: boolean;

  @Prop({ default: false, type: Boolean })
  private separateButtons!: boolean;

  @Prop({ default: false, type: Boolean })
  private goBackOnEnd!: boolean;

  @Prop({ default: 0, type: Number })
  private initialSlideIndex!: number;

  @Prop({ default: 3000, type: Number })
  private speed!: number;

  @Prop({ default: 3, type: Number })
  private itemsPerView!: number;

  @Prop({ default: () => DEFAULT_DOTS_DATA, type: Object })
  private dotsData!: IDotsData;

  private translateValue = 0;
  private trackWidth = 0;
  private carouselElementWidth = 0;

  private currentSlideIndex = this.initialSlideIndex;

  public $refs!: {
    carouselElement: HTMLDivElement | HTMLDivElement[];
    carousel: HTMLDivElement;
  };

  private get maximumIndex() {
    return this.$slots.default!.length - this.itemsPerView;
  }

  private next() {
    if (this.currentSlideIndex < this.maximumIndex) {
      this.currentSlideIndex++;
      this.translateValue = this.translateValue - this.carouselElementWidth;
    } else {
      if (this.goBackOnEnd) {
        this.currentSlideIndex = 0;
        this.translateValue = 0;
      }
    }
  }

  private prev() {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
      this.translateValue = this.translateValue + this.carouselElementWidth;
    }
  }

  private setCarouselSizingSettings() {
    const carouselWidth = this.$refs.carousel.offsetWidth;

    this.carouselElementWidth = carouselWidth / this.itemsPerView;
    this.trackWidth = this.carouselElementWidth * this.$slots.default!.length;
  }

  private mounted() {
    this.setCarouselSizingSettings();

    window.addEventListener("resize", this.setCarouselSizingSettings);
  }
}
</script>
