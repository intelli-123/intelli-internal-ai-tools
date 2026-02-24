import tailwindcss from '@tailwindcss/postcss'

export default {
  plugins: [
    tailwindcss({
      // Disable Lightning CSS completely (safe on servers/containers)
      optimize: false,

    }),
  ],
}