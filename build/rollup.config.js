import vue from "rollup-plugin-vue";
import buble from "rollup-plugin-buble";
import commonjs from "rollup-plugin-commonjs";
import replace from "rollup-plugin-replace";
import typescript from "rollup-plugin-typescript";
import minimist from "minimist";
import uglify from "rollup-plugin-uglify-es";

const argv = minimist(process.argv.slice(2));

const config = {
  input: "src/entry.js",
  output: {
    name: "VueSimpleCarousel",
    exports: "named",
    globals: {
      "vue-property-decorator": "vuePropertyDecorator",
      "vue2-touch-events": "Vue2TouchEvents"
    }
  },
  external: ["vue2-touch-events", "vue-property-decorator"],
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    typescript({
      tsconfig: false,
      experimentalDecorators: true,
      module: "es2015"
    }),
    commonjs(),
    vue({
      css: true,
      compileTemplate: true,
      template: {
        isProduction: true
      }
    }),
    buble()
  ]
};

if (argv.format === "iife") {
  config.plugins.push(uglify());
}

export default config;
