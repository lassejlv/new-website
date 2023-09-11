import fs from "fs";
import path from "path";
import config from "./config.js";

export const tailwindcss = (projectName, buildTool, libarys) => {
  const files = [
    {
      name: "index.html",
      isInAntoherFolder: true,
      folder: "./src",
      content: `<!DOCTYPE html>
<html lang="en">
    <head>
     <meta charset="UTF-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     <link rel="stylesheet" href="./dist/index.css" />
     <script src="js/assets" type="module"></script>
     ${config.cdns
       .map((cdn) => {
         if (libarys.includes(cdn.name)) {
           return `
${cdn.css !== null ? `<link rel="stylesheet" href="${cdn.css}" />` : ""};
${cdn.js !== null ? `<script src="${cdn.js}"></script>` : ""}`;
         }
       })
       .join("")}
     <title>Template web + ${buildTool}</title>
    </head>
    <body>
         <h1 class="text-green-500 text-4xl">Hello dad!</h1>
    </body>
</html>
      `,
    },

    {
      name: "tailwind.config.js",
      isInAntoherFolder: false,
      folder: null,
      content: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
};`,
    },

    {
      name: "package.json",
      isInAntoherFolder: false,
      folder: null,
      content: `{
  "scripts": {
    "all": "concurrently \"pnpm run dev\" \"pnpm run tailwind\"",
    "dev": "vite",
    "tailwind": "tailwindcss -i ./src/css/index.css -o ./src/dist/index.css --watch"
  },
  "devDependencies": {
    "tailwindcss": "^3.3.3",
    "vite": "^4.4.9"
  }
}`,
    },

    {
      name: "index.css",
      isInAntoherFolder: true,
      folder: "./src/css",
      content: `@tailwind base;
@tailwind components;
@tailwind utilities;
`,
    },

    {
      name: "index.js",
      isInAntoherFolder: true,
      folder: "./src/js",
      content: `console.log("Hello dad!");`,
    },
  ];

  // Create files that are not in another folder
  files.forEach((file) => {
    if (!file.isInAntoherFolder && file.folder === null) {
      fs.writeFileSync(
        path.join(process.cwd(), projectName, file.name),
        file.content
      );
    } else if (file.isInAntoherFolder && file.folder !== null) {
      // Create folder
      fs.mkdirSync(path.join(process.cwd(), projectName, "/" + file.folder));

      // Create file
      fs.writeFileSync(
        path.join(process.cwd(), projectName, "/" + file.folder, file.name),
        file.content
      );
    }
  });

  // Create build tool config file
  switch (buildTool) {
    case "vite": {
      const viteFile = {
        name: "vite.config.js",
        content: `
import { defineConfig } from "vite";

export default defineConfig({
    server: { port: 3000 },
    build: { outDir: "${projectName}" },
});`,
      };

      fs.writeFileSync(
        path.join(process.cwd(), projectName, viteFile.name),
        viteFile.content
      );

      break;
    }

    case "servemon": {
      const servemonFile = {
        name: "servemon.config.js",
        content: `
module.exports = {
  projectName: "${projectName}",
  port: 3000,
  directory: "./src", 
  watch: true, 
  logger: true, 
};
        `,
      };

      fs.writeFileSync(
        path.join(process.cwd(), projectName, servemonFile.name),
        servemonFile.content
      );

      break;
    }
  }

  setTimeout(() => {
    console.log("\nFor at starte tailwindcss skriv: npm run tailwind\n");
  }, 1500);
};
