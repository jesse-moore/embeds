import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";
import tailwindcss from "tailwindcss";
import html from "@rollup/plugin-html";
import htmlImport from "rollup-plugin-html";
import del from "rollup-plugin-delete";
import livereload from "rollup-plugin-livereload";
import babel from "@rollup/plugin-babel";
import alias from "@rollup/plugin-alias";
import typescript from "rollup-plugin-typescript2";
import { DEFAULT_EXTENSIONS } from "@babel/core";
import fs from "fs";

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;
export default (function () {
  const projects = fs
    .readdirSync("src/widgets", { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  return ["index", ...projects].map((project) => {
    return {
      input: project === "index" ? `src/index.tsx` : `src/widgets/${project}/index.ts`,
      output: {
        dir: project === "index" ? `docs/` : `docs/${project}`,
        format: "iife", // immediately-invoked function expression — suitable for <script> tags
        sourcemap: true,
      },
      plugins: [
        postcss({
          plugins: [
            tailwindcss({
              content: [project === "index" ? `./src/**/*.{html,js,tsx}` : `./src/widgets/${project}/**/*.{html,js}`],
              theme: {
                extend: {},
              },
              plugins: [require("daisyui")],
              daisyui: {
                themes: [
                  {
                    mytheme: {
                      primary: "#2563eb",
                      secondary: "#F000B8",
                      accent: "#37CDBE",
                      neutral: "#3D4451",
                      "base-100": "#FFFFFF",
                      info: "#3ABFF8",
                      success: "#36D399",
                      warning: "#FBBD23",
                      error: "#F87272",
                    },
                  },
                ],
              },
            }),
          ],
          config: {
            path: "../postcss.config.js",
          },
          extensions: [".css"],
          minimize: true,
          inject: {
            insertAt: "top",
          },
        }),
        typescript(),
        resolve(),
        babel({
          presets: ["@babel/preset-react"],
          plugins: ["@babel/plugin-transform-react-jsx"],
          babelHelpers: "bundled",
          extensions: [...DEFAULT_EXTENSIONS, ".ts", ".tsx"],
        }),
        commonjs({ strictRequires: true }),
        // production && terser(), // minify, but only in production
        html({
          // generate HTML file with the bundled JS and CSS
          fileName: "index.html",
          template: ({ bundle }) => {
            const indexFileURL = "./public/index.html";
            const indexFile = fs.readFileSync(indexFileURL, "utf-8");
            const templateFileURL = project === "index" ? `./src/index.html` : `./src/widgets/${project}/index.html`;
            const templateFile = fs.readFileSync(templateFileURL, "utf-8");
            return indexFile
              .replace("<body>", `<body>${templateFile}`)
              .replace("</body>", `<script>${bundle["index.js"].code}</script></body>`);
          },
          inject: false, // disable automatic injection of JS and CSS files
          output: "docs",
        }),
        // delete the bundle.js file after it's generated
        del({
          targets: project === "index" ? `docs/index.js` : `docs/${project}/index.js`,
          hook: "closeBundle",
        }),
        !production && livereload({
          watch: "docs",
          delay: 300,
        }),
        htmlImport({
          include: "**/*.html",
        }),
        alias({
          entries: [
            { find: "react", replacement: "preact/compat" },
            { find: "react-dom/test-utils", replacement: "preact/test-utils" },
            { find: "react-dom", replacement: "preact/compat" },
            { find: "react/jsx-runtime", replacement: "preact/jsx-runtime" },
          ],
        }),
      ],
    };
  });
})();
