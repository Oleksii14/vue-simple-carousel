import VueSimpleCarousel from "./components/Carousel.vue";

function install(Vue) {
  if (!install.installed) {
    install.installed = true;
    Vue.component("VueSimpleCarousel", VueSimpleCarousel);
  }
}

const plugin = {
  install
};

let GlobalVue = null;

if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.vue;
}

if (GlobalVue) {
  GlobalVue.use(plugin);
}

VueSimpleCarousel.install = install;
export default VueSimpleCarousel;
