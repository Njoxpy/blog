import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import pagefind from "astro-pagefind";
import node from "@astrojs/node";

export default defineConfig({
  site: "https://blog.njox.dev/",
  output: "hybrid",
  adapter: node({ mode: "standalone" }),
  build: { format: "directory" },
  integrations: [mdx(), tailwind(), pagefind()],
});
