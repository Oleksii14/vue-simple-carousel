# Vue2 simple carousel 🤡
#### It is:
1. Simple to use
2. Touch-friendly
3. Responsive
4. Fully customizable
5. Made with all common modes

## Installation

#### npm
```
npm i vue2-simple-carousel
```

#### yarn
```
yarn add vue2-simple-carousel
```

## Basic usage

```
// <script>
import SimpleCarousel from "vue2-simple-carousel";

export default {
    ...
    components: {
        SimpleCarousel
    }
}

// <template>

<SimpleCarousel>
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
    <div>6</div>
</SimpleCarousel>
```

## Props

|Name|Type|Default|Description|
|-------------|-------------|-----|-----|
|auto-height|Boolean|false|Sets the `auto-height` css prop to wrapper
|enable-buttons|Boolean|true|Enables carousel buttons
|enable-dots|Boolean|false|Enables carousel dots
|go-back-on-end|Boolean|false|Moves carousel to the 1st slide after you reached the last slide
|navigate-by-slide|Boolean|false|Navigates carousel by slide. (Carousel navigates by *page* by default)
|draggable|Boolean|true|Enables carousel navigation by dragging
|speed|Number|3000|Sets the `transition` speed while navigate
|items-per-view|Number|3|Sets the number of items per *page* (view)
|dots-data|Object|`dotsDataObject`|Sets the number of items per *page* (view)
|touchOptions|Object|`touchOptionsObject`|Sets the number of items per *page* (view)

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

## Slots
`prevButton`, `nextButton`, `customDots`

## Examples with slots

### prevButton, nextButton

```
<SimpleCarousel ref="carousel">
    <!-- Those spans will be wrapped in <button> tags, so don't worry about accessibility 😉  -->
    <span slot="prevButton">Click to go back!</span>
    <span slot="nextButton">Click to go next!</span>
    <div>1</div>
    <div>2</div>
    <div>3</div>
</SimpleCarousel>
```

### customDots

This slot is needed when you want to provide fully custom dots and avoid global styling:

*template*: 
```
<SimpleCarousel ref="carousel">
    <div>1</div>
    <div>2</div>
    <div>3</div>
    
    <div class="custom-dots" slot="customDots">
        <button v-for="(dot, idx) in dots" @click="onDotClick(idx)">
            {{ dot }}
        </button>
    </div>
</SimpleCarousel>
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

Noticed a bug? Please report - https://github.com/Oleksii14/vue2-simple-carousel/issues

Happy using!