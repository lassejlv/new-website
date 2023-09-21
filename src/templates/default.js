import fs from "fs";
import path from "path";
import config from "./config.js";

export const defaultTemplate = (projectName, buildTool, libarys) => {
  const files = [
    {
      name: "index.html",
      isInAntoherFolder: false,
      folder: null,
      content: `
<!DOCTYPE html>
<html lang="en">
    <head>
     <meta charset="UTF-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     <link rel="stylesheet" href="./assets/css/main.css" />
     <script src="assets/js/main.js" type="module"></script>
     ${config.cdns
       .map((cdn) => {
         if (libarys.includes(cdn.name)) {
           return `
${cdn.css !== null ? `<link rel="stylesheet" href="${cdn.css}" />` : ""}
${cdn.js !== null ? `<script src="${cdn.js}"></script>` : ""}`;
         }
       })
       .join("")
       .replace(";", "")}
     <title>Template web + ${buildTool}</title>
    </head>
    <body>
         
    </body>
</html>
      `,
    },

    {
      name: "main.js",
      isInAntoherFolder: true,
      folder: "js",
      content: `document.body.innerText = "Hello Mom";`,
    },

    {
      name: "main.css",
      isInAntoherFolder: true,
      folder: "css",
      content: `
* {
 margin: 0;
 padding: 0;
 box-sizing: border-box;
}
      
body {
 font-family: "Open sans", sans-serif;
 background: #eee;
}`,
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
      fs.mkdirSync(
        path.join(process.cwd(), projectName, "/assets/" + file.folder)
      );

      // Create file
      fs.writeFileSync(
        path.join(
          process.cwd(),
          projectName,
          "/assets/" + file.folder,
          file.name
        ),
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
  directory: "./", 
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
};
