import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://me.frankie.wang",
  output: "static",
  integrations: [sitemap()],
});
