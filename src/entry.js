import Vue2SimpleCarousel from "./components/SimpleCarousel.vue";

function install(Vue) {
  if (!install.installed) {
    install.installed = true;
    Vue.component("Vue2SimpleCarousel", Vue2SimpleCarousel);
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

Vue2SimpleCarousel.install = install;
export default Vue2SimpleCarousel;
