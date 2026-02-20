import { build } from 'bun';
import { Glob } from "bun";

import { exec } from "child_process";
const buildCSS = () =>
  new Promise((resolve) =>
    exec(
      "tailwindcss -i ./frontend/src/css/app.css -o frontend/public/output.css",
      (_error, _stdout, stderr) => {
        console.log(stderr);
        resolve(null);
      },
    ),
  );

await buildCSS();

const glob = new Glob("./frontend/public/*.html");
const entrypoints: string[] = [];
for await (const file of glob.scan(".")) {
  entrypoints.push(file);
}
await Bun.build({
  entrypoints,
  outdir: './dist', 
   naming: {
    entry: "[name].[hash].[ext]", // For your entry points
    chunk: "chunks/[name]-[hash].[ext]", // For shared code chunks
    asset: "assets/[name]-[hash].[ext]", // For CSS, images, etc.
  },
  target: 'browser',
  minify: true,
  // splitting: true,          // ← enable if you want shared chunks (recommended!)
  // naming: "[dir]/[name]-[hash].[ext]",   // customize output paths
});