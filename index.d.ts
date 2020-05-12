import { Vue2TouchEventsOptions } from "vue2-touch-events";

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
  readonly enableButtons: boolean;
  readonly enableDots: boolean;
  readonly goBackOnEnd: boolean;
  readonly navigateBySlide: boolean;
  readonly draggable: boolean;
  readonly speed: number;
  readonly itemsPerView: number;
  readonly dotsData: DotsData;
  readonly touchOptions: Vue2TouchEventsOptions;
  readonly itemsCount: number;
  readonly maximumSlideIndex: number;
  readonly pages: number;
  readonly itemsPerPage: number;
  goToBeginning: () => void;
  next: () => void;
  onNextBySlide: () => void;
  onNextByPage: () => void;
  prev: () => void;
  onPrevBySlide: () => void;
  onPrevByPage: () => void;
  setCarouselSizingSettings: () => void;
  goToPage: (pageIdx: number) => void;
}

declare const Vue2SimpleCarousel: Carousel;
export default Vue2SimpleCarousel;