import { Vue2TouchEventsOptions } from "vue2-touch-events";
import { ComponentOptions } from "vue/types/umd";

export interface DotsData {
  margin?: string;
  padding?: string;
  dots?: {
    size?: number;
    spacing?: number;
  };
}

export interface Carousel {
  readonly autoHeight: boolean;
  readonly autoplay: boolean;
  readonly manualInitialize: boolean;
  readonly stopAutoplayHover: boolean;
  readonly enableButtons: boolean;
  readonly enableDots: boolean;
  readonly goBackOnEnd: boolean;
  readonly navigateBySlide: boolean;
  readonly draggable: boolean;
  readonly speed: number;
  readonly autoplayTimeout: number;
  readonly itemsPerView: number;
  readonly hideButtonsOnStartEnd: boolean;
  readonly dotsData: DotsData;
  readonly touchOptions: Vue2TouchEventsOptions;
  readonly showPrevButton: boolean;
  readonly showNextButton: boolean;
  readonly itemsCount: number;
  readonly maximumSlideIndex: number;
  readonly pages: number;
  readonly itemsPerPage: number[];
  goToBeginning: () => void;
  next: (autoplay?: boolean) => void;
  onNextBySlide: (autoplay?: boolean) => void;
  onNextByPage: (autoplay?: boolean) => void;
  prev: () => void;
  onPrevBySlide: () => void;
  onPrevByPage: () => void;
  setCarouselSizingSettings: () => void;
  goToPage: (pageIndex: number) => void;
  onDragNext: () => void;
  onDragPrev: () => void;
  stopAutoplay: () => void;
  startAutoplay: () => void;
  initialize: () => void;
  destroy: () => void;
}

declare const Vue2SimpleCarousel: ComponentOptions<Vue>;
export default Vue2SimpleCarousel;
