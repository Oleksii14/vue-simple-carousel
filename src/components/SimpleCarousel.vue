<template>
  <div class="carousel-wrapper">
    <div v-if="disabled" class="carousel__disable-wrapper">
      <slot />
    </div>

    <div
      v-else
      ref="carousel"
      class="carousel"
      :style="{
        height: autoHeight ? 'auto' : '100%'
      }"
    >
      <template v-if="enableButtons">
        <button
          v-if="showPrevButton"
          class="carousel__button carousel__button--prev"
          @click="prev"
        >
          <slot v-if="$slots.prevButton" name="prevButton" />
          <span v-else>&#60;</span>
        </button>

        <button
          v-if="showNextButton"
          class="carousel__button carousel__button--next"
          @click="next"
        >
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
import Vue, { RenderContext, CreateElement, PropType } from "vue";

import { Computed, Data, IDotsData, Methods, Props } from "./interfaces";
import { DEFAULT_DOTS_DATA } from "./helpers";

import Vue2TouchEvents, { Vue2TouchEventsOptions } from "vue2-touch-events";

Vue.use(Vue2TouchEvents);

export default Vue.extend<Data, Methods, Computed, Props>({
  name: "Vue2SimpleCarousel",

  components: {
    PassedNode: {
      functional: true,
      render: (_: CreateElement, ctx: RenderContext) => ctx.props.nodes
    }
  },

  props: {
    autoHeight: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    autoplay: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    manualInitialize: {
      default: false,
      type: Boolean as PropType<boolean>
    },
    stopAutoplayHover: {
      default: true,
      type: Boolean as PropType<boolean>
    },
    enableButtons: {
      default: true,
      type: Boolean as PropType<boolean>
    },
    enableDots: {
      default: false,
      type: Boolean as PropType<boolean>
    },
    goBackOnEnd: {
      default: false,
      type: Boolean as PropType<boolean>
    },
    navigateBySlide: {
      default: false,
      type: Boolean as PropType<boolean>
    },
    draggable: {
      default: true,
      type: Boolean as PropType<boolean>
    },
    speed: {
      default: 3000,
      type: Number as PropType<number>
    },
    autoplayTimeout: {
      default: 1500,
      type: Number as PropType<number>
    },
    itemsPerView: {
      default: 3,
      type: Number as PropType<number>
    },
    hideButtonsOnStartEnd: {
      default: false,
      type: Boolean as PropType<boolean>
    },
    dotsData: {
      default: () => DEFAULT_DOTS_DATA,
      type: Object as PropType<IDotsData>
    },
    touchOptions: {
      default: () => ({ swipeTolerance: 80 }),
      type: Object as PropType<Vue2TouchEventsOptions>
    }
  },

  data() {
    return {
      translateValue: 0,
      trackWidth: 0,
      carouselElementWidth: 0,
      currentSlideIndex: 0,
      currentPageIndex: 0,
      autoplayIntervalId: 0,
      disabled: this.manualInitialize
    };
  },

  computed: {
    showPrevButton(): boolean {
      if (this.hideButtonsOnStartEnd) {
        return this.navigateBySlide
          ? this.currentSlideIndex > 0
          : this.currentPageIndex > 0;
      } else {
        return true;
      }
    },

    showNextButton(): boolean {
      if (this.hideButtonsOnStartEnd) {
        return this.navigateBySlide
          ? this.currentSlideIndex < this.maximumSlideIndex
          : this.currentPageIndex < this.pages - 1;
      } else {
        return true;
      }
    },

    itemsCount() {
      return this.$slots.default!.length;
    },

    maximumSlideIndex(): number {
      return this.itemsCount - this.itemsPerView;
    },

    pages(): number {
      return Math.ceil(this.itemsCount / this.itemsPerView);
    },

    itemsPerPage(): number[] {
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
  },

  watch: {
    currentSlideIndex(value: number) {
      this.$emit("on-slide-change", value);
    },

    currentPageIndex(value: number) {
      this.$emit("on-page-change", value);
    }
  },

  mounted() {
    if (!this.manualInitialize) {
      this.initialize();
    }
  },

  destroyed() {
    clearInterval(this.autoplayIntervalId);
    window.removeEventListener("resize", this.setCarouselSizingSettings);
  },

  methods: {
    goToBeginning() {
      this.currentPageIndex = 0;
      this.currentSlideIndex = 0;
      this.translateValue = 0;
    },

    next(autoplay?: boolean) {
      this.navigateBySlide
        ? this.onNextBySlide(autoplay)
        : this.onNextByPage(autoplay);
    },

    onNextBySlide(autoplay?: boolean) {
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
    },

    onNextByPage(autoplay?: boolean) {
      if (this.currentPageIndex < this.pages - 1) {
        this.goToPage(this.currentPageIndex + 1);
      } else {
        if (this.goBackOnEnd || autoplay) {
          this.goToBeginning();
        }
      }
    },

    prev() {
      this.navigateBySlide ? this.onPrevBySlide() : this.onPrevByPage();
    },

    onPrevBySlide() {
      if (this.currentSlideIndex > 0) {
        this.currentSlideIndex--;
        this.translateValue = this.translateValue + this.carouselElementWidth;

        if (this.currentSlideIndex % this.itemsPerView === 0) {
          this.currentPageIndex--;
        }
      }
    },

    onPrevByPage() {
      if (this.currentPageIndex > 0) {
        this.goToPage(this.currentPageIndex - 1);
      }
    },

    setCarouselSizingSettings() {
      const carousel = this.$refs.carousel as HTMLDivElement;

      if (carousel) {
        const carouselWidth = carousel.offsetWidth;
        const elementsTranslated =
          this.translateValue / this.carouselElementWidth || 0;

        this.carouselElementWidth = carouselWidth / this.itemsPerView;
        this.trackWidth = this.carouselElementWidth * this.itemsCount;

        const translateValue = elementsTranslated * this.carouselElementWidth;
        this.translateValue =
          this.translateValue < 0 ? translateValue : -translateValue;
      }
    },

    goToPage(pageIndex: number) {
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
    },

    onDragNext() {
      if (this.draggable) {
        this.next();
      }
    },

    onDragPrev() {
      if (this.draggable) {
        this.prev();
      }
    },

    stopAutoplay() {
      if (this.stopAutoplayHover) {
        clearInterval(this.autoplayIntervalId);
      }
    },

    startAutoplay() {
      if (this.autoplay) {
        this.autoplayIntervalId = setInterval(() => {
          this.next(true);
        }, this.autoplayTimeout);
      }
    },

    initialize() {
      this.disabled = false;

      this.startAutoplay();
      window.addEventListener("resize", this.setCarouselSizingSettings);

      this.$nextTick(() => {
        this.setCarouselSizingSettings();
      });
    },

    destroy() {
      this.disabled = true;

      this.stopAutoplay();
      window.removeEventListener("resize", this.setCarouselSizingSettings);
    }
  }
});
</script>
