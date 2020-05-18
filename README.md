# vue2-simple-carousel 🎠

Noticed a bug? Please report - https://github.com/Oleksii14/vue2-simple-carousel/issues

Liked a carousel? Become a patron https://www.patreon.com/join/oshap

#### It is:
1. Simple to use
2. Touch-friendly
3. Responsive
4. Fully customizable
5. Made with all common modes

## Table of contents
1. [Installation](#installation-)
2. [Basic usage](#basic-usage-)
3. [Props](#props-)
4. [Slots](#slots-)
5. [Examples with slots](#examples-with-slots-)
6. [Useful methods](#useful-methods-)
7. [Useful data](#useful-data-)

## Installation 💽

#### npm
```
npm i vue2-simple-carousel
```

#### yarn
```
yarn add vue2-simple-carousel
```

## Basic usage 🏄

```
// <script>
import Carousel from "vue2-simple-carousel";

export default {
    ...
    components: {
        Carousel
    }
}

// <template>

<Carousel>
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
    <div>6</div>
</Carousel>
```

## Props 💡

|Name|Type|Default|Description|
|-------------|-------------|-----|-----|
|auto-height|Boolean|false|Sets the `auto-height` css prop to wrapper
|enable-buttons|Boolean|true|Enables carousel buttons
|enable-dots|Boolean|false|Enables carousel dots
|autoplay|Boolean|false|Enables autoplay
|stop-autoplay-hover|Boolean|true|Stops the autoplay on carousel hover
|go-back-on-end|Boolean|false|Moves carousel to the 1st slide after you reached the last slide
|navigate-by-slide|Boolean|false|Navigates carousel by slide. (Carousel navigates by *page* by default)
|draggable|Boolean|true|Enables carousel navigation by dragging
|speed|Number|3000|Sets the `transition` speed while navigate
|autoplay-timeout|Number|1500|Sets the autoplay timeout time
|items-per-view|Number|3|Sets the number of items per *page* (view)
|dots-data|Object|`dotsDataObject`|Sets the number of items per *page* (view)
|touch-options|Object|`touchOptionsObject`|Sets the number of items per *page* (view)

`touchOptionsObject`:
```
// Supports all props from options object in https://www.npmjs.com/package/vue2-touch-events
{ swipeTolerance: 80 }
```

`dotsDataObject`:
```
{
  margin: "10px 0 0 0",
  padding: "0",
  dots: {
    size: 15,
    spacing: 5
  }
}
```

## Slots 🧭
`prevButton`, `nextButton`, `customDots`

## Examples with slots 🖼

#### prevButton, nextButton

```
<Carousel ref="carousel">
    <!-- Those spans will be wrapped in <button> tags, so don't worry about accessibility 😉  -->
    <span slot="prevButton">Click to go back!</span>
    <span slot="nextButton">Click to go next!</span>
    <div>1</div>
    <div>2</div>
    <div>3</div>
</Carousel>
```

#### customDots

This slot is needed when you want to provide fully custom dots and avoid global styling:

*template*: 
```
<Carousel ref="carousel">
    <div>1</div>
    <div>2</div>
    <div>3</div>
    
    <div class="custom-dots" slot="customDots">
        <button v-for="(dot, idx) in dots" @click="onDotClick(idx)">
            {{ dot }}
        </button>
    </div>
</Carousel>
```

*script*:
```
export default {
    ...
    data() {
        return {
            dots: 0
        }
    },
    methods: {
        onDotClick(pageIndex) {
            this.$refs.carousel.goToPage(pageIndex);
        }
    },
    mounted() {
        this.dots = this.$refs.carousel.pages;
    }
}
```

## Useful methods 📖

`prev` - navigates to the prev page/slide (this relates to `navigate-by-slide` prop)

`next` - navigates to the next page/slide (this relates to `navigate-by-slide` prop)

`onNextBySlide` - navigates to the next slide

`onNextByPage` - navigates to the next page

`onPrevBySlide` - navigates to the prev slide

`onPrevByPage` - navigates to the prev page

*Example*:

```
<button
    class="some-button-that-should-navigate-next" @click="$refs.carousel.onNextBySlide()"
>
    CLICK ME TO GO TO THE NEXT SLIDE
</button>
```

## Useful data 📖

`translateValue` - value on which the carousel is translated now

`trackWidth` - the width of the carousel track (changes on resize event)

`carouselElementWidth` - the width of the carousel element (changes on resize event)

`currentSlideIndex` / `currentPageIndex` - current indexes

`itemsCount` - the number of all passed nodes

`pages` - number of pages

`maximumSlideIndex` - the maximum index the carousel can be moved

`itemsPerPage` - the number of carousel items per page

*Example*:

```
mounted() {
    console.log(this.$refs.carousel.pages)
}
```

Happy using!