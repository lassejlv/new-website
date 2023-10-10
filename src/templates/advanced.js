import fs from "fs";
import path from "path";
import config from "./config.js";
import chalk from "chalk";

export const advancedTemplate = (projectName, buildTool, libarys) => {
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
     <script src="js/index.js" type="module"></script>
    <!-- Stylesheets -->
    <link rel="stylesheet" href="css/index.css" />
     ${config.cdns
       .map((cdn) => {
         if (libarys.includes(cdn.name)) {
           return `
${cdn.css !== null ? `<link rel="stylesheet" href="${cdn.css}" />` : ""};
${cdn.js !== null ? `<script src="${cdn.js}"></script>` : ""}`;
         }
       })
       .join("")
       .replace(";", "")}
     <title>Template web + ${buildTool}</title>
    </head>
    <body>
    <!-- App Component-->
    <include src="components/app.html"></include>

    <!-- Scripts -->
    <script src="https://unpkg.com/includerjs@2.0.0/dist/includer-2.0.0.bundle.js"></script>
    </body>
</html>
      `,
    },
    {
      name: "app.html",
      isInAntoherFolder: true,
      folder: "./src/components",
      content: `<div class="container">
  <h1>Create Website</h1>
  <p>Edit <code>src/components/app.html</code> to edit this content</p>
</div>
      `,
    },

    {
      name: "package.json",
      isInAntoherFolder: false,
      folder: null,
      content: `{
  "scripts": {
    "dev": "servemon dev"
  },
  "devDependencies": {
    "servemon": "^2.1.9"
  }
}`,
    },

    {
      name: "index.css",
      isInAntoherFolder: true,
      folder: "./src/css",
      content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Open sans", sans-serif;
}

body {
  color: #eee;
  background: rgb(16, 30, 46);
}

code {
  color: rgb(168, 55, 196);
  font-family: monospace;
}

.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.container p {
  color: #888;
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
};
