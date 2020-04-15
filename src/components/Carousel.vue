<template>
  <div
    ref="carousel"
    class="carousel"
    :style="{
      height: autoHeight ? 'auto' : '100%'
    }"
  >
    <template v-if="enableButtons">
      <template>
        <slot name="customButtons" />
      </template>

      <div v-if="!$slots.customButtons" class="carousel__buttons">
        <button class="carousel__button" @click="prev">
          <slot v-if="$slots.prevButton" name="prevButton" />
          <span v-else>&#60;</span>
        </button>

        <button class="carousel__button" @click="next">
          <slot v-if="$slots.nextButton" name="nextButton" />
          <span v-else>&#62;</span>
        </button>
      </div>
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

    <template v-if="enableDots">
      <template>
        <slot name="customDots" />
      </template>

      <div
        v-if="!$slots.customDots"
        class="carousel__dots"
        :style="{
          margin: dotsData.margin,
          padding: dotsData.padding
        }"
      >
        <button
          v-for="(dot, idx) in pages"
          :key="`carousel-dot-${idx}`"
          :style="{
            width: `${dotsData.dots.size}px`,
            height: `${dotsData.dots.size}px`,
            backgroundColor: dotsData.dots.color,
            border: dotsData.dots.border,
            marginRight:
              idx === $slots.default.length - 1
                ? 0
                : `${dotsData.dots.spacing}px`
          }"
          class="carousel__dot"
          @click="goToPage(idx)"
        >
          {{ idx }}
        </button>
      </div>
    </template>
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
    justify-content: center;
  }

  &__dot {
    padding: 0;

    outline: none;
    cursor: pointer;

    border-radius: 50%;

    &:hover {
      opacity: 0.8;
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
  private lastTranslateValue = 0;
  private trackWidth = 0;
  private carouselElementWidth = 0;

  private currentSlideIndex = this.initialSlideIndex;
  private currentPageIndex = 0;

  public $refs!: {
    carouselElement: HTMLDivElement | HTMLDivElement[];
    carousel: HTMLDivElement;
  };

  private get itemsCount() {
    return this.$slots.default!.length;
  }

  private get maximumIndex() {
    return this.itemsCount - this.itemsPerView;
  }

  private get pages() {
    return Math.ceil(this.itemsCount / this.itemsPerView);
  }

  private get itemsPerPage() {
    const itemsPerPage: number[] = [];
    let remainder = this.itemsCount;

    for (let i = 0; i < this.pages; i++) {
      itemsPerPage.push(
        remainder > this.itemsPerView ? this.itemsPerView : remainder
      );

      remainder = remainder - this.itemsPerView;
    }

    return itemsPerPage;
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
    this.trackWidth = this.carouselElementWidth * this.itemsCount;
  }

  private goToPage(pageIndex: number) {
    if (pageIndex !== this.currentPageIndex) {
      const translateValue =
        this.carouselElementWidth * this.itemsPerPage[pageIndex];

      this.translateValue =
        pageIndex > this.currentPageIndex
          ? this.translateValue - translateValue
          : this.lastTranslateValue;

      this.currentPageIndex = pageIndex;
    }
  }

  private mounted() {
    this.setCarouselSizingSettings();

    window.addEventListener("resize", this.setCarouselSizingSettings);
  }
}
</script>
