import { Vue, Prop, Watch, Component } from 'vue-property-decorator';
import Vue2TouchEvents from 'vue2-touch-events';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

var DEFAULT_DOTS_DATA = {
    margin: "10px 0 0 0",
    padding: "0",
    dots: {
        size: 15,
        spacing: 5
    }
};

Vue.use(Vue2TouchEvents);
var Carousel = /** @class */ (function (_super) {
    __extends(Carousel, _super);
    function Carousel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.translateValue = 0;
        _this.trackWidth = 0;
        _this.carouselElementWidth = 0;
        _this.currentSlideIndex = 0;
        _this.currentPageIndex = 0;
        _this.autoplayIntervalId = 0;
        _this.disabled = _this.manualInitialize;
        return _this;
    }
    Object.defineProperty(Carousel.prototype, "itemsCount", {
        get: function () {
            return this.$slots.default.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Carousel.prototype, "maximumSlideIndex", {
        get: function () {
            return this.itemsCount - this.itemsPerView;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Carousel.prototype, "pages", {
        get: function () {
            return Math.ceil(this.itemsCount / this.itemsPerView);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Carousel.prototype, "itemsPerPage", {
        get: function () {
            var itemsPerPage = [];
            var remainder = this.itemsCount;
            for (var i = 0; i < this.pages; i++) {
                itemsPerPage.push(remainder > this.itemsPerView ? this.itemsPerView : remainder);
                remainder = remainder - this.itemsPerView;
            }
            return itemsPerPage;
        },
        enumerable: true,
        configurable: true
    });
    Carousel.prototype.goToBeginning = function () {
        this.currentPageIndex = 0;
        this.currentSlideIndex = 0;
        this.translateValue = 0;
    };
    Carousel.prototype.next = function (autoplay) {
        this.navigateBySlide
            ? this.onNextBySlide(autoplay)
            : this.onNextByPage(autoplay);
    };
    Carousel.prototype.onNextBySlide = function (autoplay) {
        if (this.currentSlideIndex < this.maximumSlideIndex) {
            this.currentSlideIndex++;
            this.translateValue = this.translateValue - this.carouselElementWidth;
            if (this.currentSlideIndex % this.itemsPerView === 0 ||
                this.itemsPerPage[this.currentPageIndex + 1] < this.itemsPerView) {
                this.currentPageIndex++;
            }
        }
        else {
            if (this.goBackOnEnd || autoplay) {
                this.goToBeginning();
            }
        }
    };
    Carousel.prototype.onNextByPage = function (autoplay) {
        if (this.currentPageIndex < this.pages - 1) {
            this.goToPage(this.currentPageIndex + 1);
        }
        else {
            if (this.goBackOnEnd || autoplay) {
                this.goToBeginning();
            }
        }
    };
    Carousel.prototype.prev = function () {
        this.navigateBySlide ? this.onPrevBySlide() : this.onPrevByPage();
    };
    Carousel.prototype.onPrevBySlide = function () {
        if (this.currentSlideIndex > 0) {
            this.currentSlideIndex--;
            this.translateValue = this.translateValue + this.carouselElementWidth;
            if (this.currentSlideIndex % this.itemsPerView === 0) {
                this.currentPageIndex--;
            }
        }
    };
    Carousel.prototype.onPrevByPage = function () {
        if (this.currentPageIndex > 0) {
            this.goToPage(this.currentPageIndex - 1);
        }
    };
    Carousel.prototype.setCarouselSizingSettings = function () {
        var carouselWidth = this.$refs.carousel.offsetWidth;
        var elementsTranslated = this.translateValue / this.carouselElementWidth || 0;
        this.carouselElementWidth = carouselWidth / this.itemsPerView;
        this.trackWidth = this.carouselElementWidth * this.itemsCount;
        var translateValue = elementsTranslated * this.carouselElementWidth;
        this.translateValue =
            this.translateValue < 0 ? translateValue : -translateValue;
    };
    Carousel.prototype.goToPage = function (pageIndex) {
        if (this.currentPageIndex === pageIndex) {
            return;
        }
        if (pageIndex > this.currentPageIndex) {
            this.translateValue = -(this.carouselElementWidth * this.itemsPerPage[pageIndex] +
                (pageIndex - 1) * this.itemsPerView * this.carouselElementWidth);
            this.currentSlideIndex =
                this.itemsPerPage[pageIndex] < this.itemsPerView
                    ? pageIndex * this.itemsPerView -
                        (this.itemsPerView - this.itemsPerPage[pageIndex])
                    : pageIndex * this.itemsPerView;
        }
        else {
            this.translateValue = -(this.carouselElementWidth *
                this.itemsPerView *
                pageIndex);
            this.currentSlideIndex = this.itemsPerView * pageIndex;
        }
        this.currentPageIndex = pageIndex;
    };
    Carousel.prototype.onDragNext = function () {
        if (this.draggable) {
            this.next();
        }
    };
    Carousel.prototype.onDragPrev = function () {
        if (this.draggable) {
            this.prev();
        }
    };
    Carousel.prototype.stopAutoplay = function () {
        if (this.stopAutoplayHover) {
            clearInterval(this.autoplayIntervalId);
        }
    };
    Carousel.prototype.startAutoplay = function () {
        var _this = this;
        if (this.autoplay) {
            this.autoplayIntervalId = setInterval(function () {
                _this.next(true);
            }, this.autoplayTimeout);
        }
    };
    Carousel.prototype.initialize = function () {
        var _this = this;
        this.disabled = false;
        this.startAutoplay();
        window.addEventListener("resize", this.setCarouselSizingSettings);
        this.$nextTick(function () {
            _this.setCarouselSizingSettings();
        });
    };
    Carousel.prototype.mounted = function () {
        if (!this.manualInitialize) {
            this.initialize();
        }
    };
    Carousel.prototype.destroyed = function () {
        clearInterval(this.autoplayIntervalId);
        window.removeEventListener("resize", this.setCarouselSizingSettings);
    };
    Carousel.prototype.onSlideChanged = function (value) {
        this.$emit("on-slide-change", value);
    };
    Carousel.prototype.onPageChanged = function (value) {
        this.$emit("on-page-change", value);
    };
    __decorate([
        Prop({ default: false, type: Boolean })
    ], Carousel.prototype, "autoHeight", void 0);
    __decorate([
        Prop({ default: false, type: Boolean })
    ], Carousel.prototype, "autoplay", void 0);
    __decorate([
        Prop({ default: false, type: Boolean })
    ], Carousel.prototype, "manualInitialize", void 0);
    __decorate([
        Prop({ default: true, type: Boolean })
    ], Carousel.prototype, "stopAutoplayHover", void 0);
    __decorate([
        Prop({ default: true, type: Boolean })
    ], Carousel.prototype, "enableButtons", void 0);
    __decorate([
        Prop({ default: false, type: Boolean })
    ], Carousel.prototype, "enableDots", void 0);
    __decorate([
        Prop({ default: false, type: Boolean })
    ], Carousel.prototype, "goBackOnEnd", void 0);
    __decorate([
        Prop({ default: false, type: Boolean })
    ], Carousel.prototype, "navigateBySlide", void 0);
    __decorate([
        Prop({ default: true, type: Boolean })
    ], Carousel.prototype, "draggable", void 0);
    __decorate([
        Prop({ default: 3000, type: Number })
    ], Carousel.prototype, "speed", void 0);
    __decorate([
        Prop({ default: 1500, type: Number })
    ], Carousel.prototype, "autoplayTimeout", void 0);
    __decorate([
        Prop({ default: 3, type: Number })
    ], Carousel.prototype, "itemsPerView", void 0);
    __decorate([
        Prop({ default: function () { return DEFAULT_DOTS_DATA; }, type: Object })
    ], Carousel.prototype, "dotsData", void 0);
    __decorate([
        Prop({ default: function () { return ({ swipeTolerance: 80 }); }, type: Object })
    ], Carousel.prototype, "touchOptions", void 0);
    __decorate([
        Watch("currentSlideIndex")
    ], Carousel.prototype, "onSlideChanged", null);
    __decorate([
        Watch("currentPageIndex")
    ], Carousel.prototype, "onPageChanged", null);
    Carousel = __decorate([
        Component({
            components: {
                PassedNode: {
                    functional: true,
                    render: function (_, ctx) { return ctx.props.nodes; }
                }
            }
        })
    ], Carousel);
    return Carousel;
}(Vue));

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
var HEAD = document.head || document.getElementsByTagName('head')[0];
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) { style.element.setAttribute('media', css.media); }
      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) { style.element.removeChild(nodes[index]); }
      if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }else { style.element.appendChild(textNode); }
    }
  }
}

var browser = createInjector;

/* script */
var __vue_script__ = Carousel;

/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"carousel-wrapper"},[(_vm.disabled)?[_vm._t("default")]:_c('div',{ref:"carousel",staticClass:"carousel",style:({
      height: _vm.autoHeight ? 'auto' : '100%'
    })},[(_vm.enableButtons)?[_c('button',{staticClass:"carousel__button carousel__button--prev",on:{"click":_vm.prev}},[(_vm.$slots.prevButton)?_vm._t("prevButton"):_c('span',[_vm._v("<")])],2),_vm._v(" "),_c('button',{staticClass:"carousel__button carousel__button--next",on:{"click":_vm.next}},[(_vm.$slots.nextButton)?_vm._t("nextButton"):_c('span',[_vm._v(">")])],2)]:_vm._e(),_vm._v(" "),_c('div',{directives:[{name:"touch",rawName:"v-touch:swipe.left",value:(_vm.onDragNext),expression:"onDragNext",arg:"swipe",modifiers:{"left":true}},{name:"touch",rawName:"v-touch:swipe.right",value:(_vm.onDragPrev),expression:"onDragPrev",arg:"swipe",modifiers:{"right":true}},{name:"touch-options",rawName:"v-touch-options",value:(_vm.touchOptions),expression:"touchOptions"}],staticClass:"carousel__track",style:({
        width: (_vm.trackWidth + "px"),
        transform: ("translateX(" + _vm.translateValue + "px)"),
        transition: ("transform " + (_vm.speed / 10000) + "s"),
        cursor: _vm.draggable ? 'grab' : 'default'
      }),on:{"mouseenter":_vm.stopAutoplay,"mouseleave":_vm.startAutoplay}},_vm._l((_vm.$slots.default),function(element,idx){return _c('div',{key:((element.tag) + "-" + idx),ref:"carouselElement",refInFor:true,staticClass:"carousel__element",style:({
          width: (_vm.carouselElementWidth + "px")
        })},[_c('PassedNode',{attrs:{"nodes":element}})],1)}),0),_vm._v(" "),(_vm.enableDots)?[[_vm._t("customDots")],_vm._v(" "),(!_vm.$slots.customDots)?_c('div',{staticClass:"carousel__dots",style:({
          margin: _vm.dotsData.margin,
          padding: _vm.dotsData.padding
        })},_vm._l((_vm.pages),function(dot,idx){return _c('button',{key:("carousel-dot-" + idx),class:{
            carousel__dot: true,
            'carousel__dot--active': _vm.currentPageIndex === idx
          },style:({
            width: ((_vm.dotsData.dots.size) + "px"),
            height: ((_vm.dotsData.dots.size) + "px"),
            marginRight:
              idx === _vm.$slots.default.length - 1
                ? 0
                : ((_vm.dotsData.dots.spacing) + "px")
          }),on:{"click":function($event){return _vm.goToPage(idx)}}})}),0):_vm._e()]:_vm._e()],2)],2)};
var __vue_staticRenderFns__ = [];

  /* style */
  var __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-314b7c4b_0", { source: ".carousel[data-v-314b7c4b]{width:100%;display:flex;flex-direction:column;overflow:hidden;position:relative}.carousel__track[data-v-314b7c4b]{display:flex;flex:1}.carousel__element[data-v-314b7c4b]{flex:1;user-select:none;display:flex;align-items:center;justify-content:center}.carousel__button[data-v-314b7c4b]{position:absolute;top:50%;z-index:2;transform:translateY(-50%)}.carousel__button--next[data-v-314b7c4b]{right:0}.carousel__button--prev[data-v-314b7c4b]{left:0}.carousel__dots[data-v-314b7c4b]{display:flex;align-items:center;justify-content:center}.carousel__dot[data-v-314b7c4b]{padding:0;outline:0;cursor:pointer;border-radius:50%}.carousel__dot--active[data-v-314b7c4b]{opacity:.7}.carousel__dot[data-v-314b7c4b]:hover{opacity:.8}", map: undefined, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = "data-v-314b7c4b";
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var Vue2SimpleCarousel = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
    undefined
  );

function install(Vue) {
  if (!install.installed) {
    install.installed = true;
    Vue.component("Vue2SimpleCarousel", Vue2SimpleCarousel);
  }
}

var plugin = {
  install: install
};

var GlobalVue = null;

if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.vue;
}

if (GlobalVue) {
  GlobalVue.use(plugin);
}

Vue2SimpleCarousel.install = install;

export default Vue2SimpleCarousel;
