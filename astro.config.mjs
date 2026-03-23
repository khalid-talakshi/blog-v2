// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import react from "@astrojs/react";

import mdx from "@astrojs/mdx";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), mdx()],
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Anta",
      cssVariable: "--font-anta",
    },
    {
      provider: fontProviders.google(),
      name: "Aldrich",
      cssVariable: "--font-aldrich",
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
