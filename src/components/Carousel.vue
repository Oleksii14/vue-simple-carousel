<template>
  <div
    ref="carousel"
    class="carousel"
    :style="{
      height: autoHeight ? 'auto' : '100%'
    }"
  >
    <template v-if="enableButtons">
      <button class="carousel__button carousel__button--prev" @click="prev">
        <slot v-if="$slots.prevButton" name="prevButton" />
        <span v-else>&#60;</span>
      </button>

      <button class="carousel__button carousel__button--next" @click="next">
        <slot v-if="$slots.nextButton" name="nextButton" />
        <span v-else>&#62;</span>
      </button>
    </template>

    <div
      v-touch:swipe.left="onDragNext"
      v-touch:swipe.right="onDragPrev"
      v-touch-options="touchOptions"
      class="carousel__track"
      :style="{
        width: `${trackWidth}px`,
        transform: `translateX(${translateValue}px)`,
        transition: `transform ${speed / 10000}s`,
        cursor: draggable ? 'grab' : 'default'
      }"
      @mouseenter="stopAutoplay"
      @mouseleave="startAutoplay"
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
            marginRight:
              idx === $slots.default.length - 1
                ? 0
                : `${dotsData.dots.spacing}px`
          }"
          :class="{
            carousel__dot: true,
            'carousel__dot--active': currentPageIndex === idx
          }"
          @click="goToPage(idx)"
        />
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
    user-select: none;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__button {
    position: absolute;
    top: 50%;

    z-index: 2;

    transform: translateY(-50%);

    &--next {
      right: 0;
    }

    &--prev {
      left: 0;
    }
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

    &--active {
      opacity: 0.7;
    }

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

import Vue2TouchEvents, { Vue2TouchEventsOptions } from "vue2-touch-events";

Vue.use(Vue2TouchEvents);

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

  @Prop({ default: false, type: Boolean })
  private autoplay!: boolean;

  @Prop({ default: true, type: Boolean })
  private stopAutoplayHover!: boolean;

  @Prop({ default: true, type: Boolean })
  private enableButtons!: boolean;

  @Prop({ default: false, type: Boolean })
  private enableDots!: boolean;

  @Prop({ default: false, type: Boolean })
  private goBackOnEnd!: boolean;

  @Prop({ default: false, type: Boolean })
  private navigateBySlide!: boolean;

  @Prop({ default: true, type: Boolean })
  private draggable!: boolean;

  @Prop({ default: 3000, type: Number })
  private speed!: number;

  @Prop({ default: 1500, type: Number })
  private autoplayTimeout!: number;

  @Prop({ default: 3, type: Number })
  private itemsPerView!: number;

  @Prop({ default: () => DEFAULT_DOTS_DATA, type: Object })
  private dotsData!: IDotsData;

  @Prop({ default: () => ({ swipeTolerance: 80 }), type: Object })
  private touchOptions!: Vue2TouchEventsOptions;

  private translateValue = 0;

  private trackWidth = 0;
  private carouselElementWidth = 0;

  private currentSlideIndex = 0;
  private currentPageIndex = 0;

  private autoplayIntervalId = 0;

  public $refs!: {
    carouselElement: HTMLDivElement | HTMLDivElement[];
    carousel: HTMLDivElement;
  };

  private get itemsCount() {
    return this.$slots.default!.length;
  }

  private get maximumSlideIndex() {
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

  private goToBeginning() {
    this.currentPageIndex = 0;
    this.currentSlideIndex = 0;
    this.translateValue = 0;
  }

  private next(autoplay?: true) {
    this.navigateBySlide
      ? this.onNextBySlide(autoplay)
      : this.onNextByPage(autoplay);
  }

  private onNextBySlide(autoplay?: true) {
    if (this.currentSlideIndex < this.maximumSlideIndex) {
      this.currentSlideIndex++;
      this.translateValue = this.translateValue - this.carouselElementWidth;

      if (
        this.currentSlideIndex % this.itemsPerView === 0 ||
        this.itemsPerPage[this.currentPageIndex + 1] < this.itemsPerView
      ) {
        this.currentPageIndex++;
      }
    } else {
      if (this.goBackOnEnd || autoplay) {
        this.goToBeginning();
      }
    }
  }

  private onNextByPage(autoplay?: true) {
    if (this.currentPageIndex < this.pages - 1) {
      this.goToPage(this.currentPageIndex + 1);
    } else {
      if (this.goBackOnEnd || autoplay) {
        this.goToBeginning();
      }
    }
  }

  private prev() {
    this.navigateBySlide ? this.onPrevBySlide() : this.onPrevByPage();
  }

  private onPrevBySlide() {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
      this.translateValue = this.translateValue + this.carouselElementWidth;

      if (this.currentSlideIndex % this.itemsPerView === 0) {
        this.currentPageIndex--;
      }
    }
  }

  private onPrevByPage() {
    if (this.currentPageIndex > 0) {
      this.goToPage(this.currentPageIndex - 1);
    }
  }

  private setCarouselSizingSettings() {
    const carouselWidth = this.$refs.carousel.offsetWidth;
    const elementsTranslated =
      this.translateValue / this.carouselElementWidth || 0;

    this.carouselElementWidth = carouselWidth / this.itemsPerView;
    this.trackWidth = this.carouselElementWidth * this.itemsCount;

    const translateValue = elementsTranslated * this.carouselElementWidth;
    this.translateValue =
      this.translateValue < 0 ? translateValue : -translateValue;
  }

  private goToPage(pageIndex: number) {
    if (this.currentPageIndex === pageIndex) {
      return;
    }

    if (pageIndex > this.currentPageIndex) {
      this.translateValue = -(
        this.carouselElementWidth * this.itemsPerPage[pageIndex] +
        (pageIndex - 1) * this.itemsPerView * this.carouselElementWidth
      );

      this.currentSlideIndex =
        this.itemsPerPage[pageIndex] < this.itemsPerView
          ? pageIndex * this.itemsPerView -
            (this.itemsPerView - this.itemsPerPage[pageIndex])
          : pageIndex * this.itemsPerView;
    } else {
      this.translateValue = -(
        this.carouselElementWidth *
        this.itemsPerView *
        pageIndex
      );

      this.currentSlideIndex = this.itemsPerView * pageIndex;
    }

    this.currentPageIndex = pageIndex;
  }

  private onDragNext() {
    if (this.draggable) {
      this.next();
    }
  }

  private onDragPrev() {
    if (this.draggable) {
      this.prev();
    }
  }

  private stopAutoplay() {
    if (this.stopAutoplayHover) {
      clearInterval(this.autoplayIntervalId);
    }
  }

  private startAutoplay() {
    if (this.autoplay) {
      this.autoplayIntervalId = setInterval(() => {
        this.next(true);
      }, this.autoplayTimeout);
    }
  }

  private mounted() {
    this.setCarouselSizingSettings();

    window.addEventListener("resize", this.setCarouselSizingSettings);

    this.startAutoplay();
  }

  private destroyed() {
    clearInterval(this.autoplayIntervalId);
    window.removeEventListener("resize", this.setCarouselSizingSettings);
  }
}
</script>
