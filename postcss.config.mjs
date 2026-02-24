// postcss.config.mjs
import tailwindcss from '@tailwindcss/postcss'

export default {
  plugins: [
    tailwindcss({
      // Disable Lightning CSS entirely in production to avoid native binding
      optimize: false,

      // Alternative: keep Lightning CSS on but disable minification only
      // optimize: { minify: false },
    }),
  ],
}