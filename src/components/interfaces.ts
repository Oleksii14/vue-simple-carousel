import { Vue2TouchEventsOptions } from "vue2-touch-events";

export interface IDotsData {
  margin?: string;
  padding?: string;
  dots?: {
    size?: number;
    spacing?: number;
  };
}

export interface Data {
  translateValue: number;
  trackWidth: number;
  carouselElementWidth: number;
  currentSlideIndex: number;
  currentPageIndex: number;
  autoplayIntervalId: number;
  disabled: boolean;
}

export interface Props {
  autoHeight: boolean;
  autoplay: boolean;
  manualInitialize: boolean;
  stopAutoplayHover: boolean;
  enableButtons: boolean;
  enableDots: boolean;
  goBackOnEnd: boolean;
  navigateBySlide: boolean;
  draggable: boolean;
  speed: number;
  autoplayTimeout: number;
  itemsPerView: number;
  hideButtonsOnStartEnd: boolean;
  dotsData: IDotsData;
  touchOptions: Vue2TouchEventsOptions;
}

export interface Methods {
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

export interface Computed {
  showPrevButton: boolean;
  showNextButton: boolean;
  itemsCount: number;
  maximumSlideIndex: number;
  pages: number;
  itemsPerPage: number[];
}
