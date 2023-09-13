#!/usr/bin/env node

"use strict";

import fs from "fs";
import inquirer from "inquirer";
import chalk from "chalk";
import * as template from "./templates/export.js";
import { exec } from "child_process";
import config from "./templates/config.js";
import * as spinner from "nanospinner";
import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find --version
if (process.argv[2] === "--version") {
  const pathToPackageJson = path.join(__dirname, "../package.json");
  const packageJson = JSON.parse(fs.readFileSync(pathToPackageJson));

  console.log(chalk.cyanBright(`v${packageJson.version}`));

  process.exit(0);
} else {
  // Variables
  const templatesLit = ["default", "tailwindcss"];
  const buildTools = ["vite", "servemon", "none"];
  const libarys = config.cdns.map((libary) => libary.name);

  // Questions
  const questions = [
    {
      type: "input",
      name: "project_name",
      message: "Hvad skal dit projekt hedde?",
      default: "min-hjemmeside",
      validate: function (value) {
        if (fs.existsSync(value)) {
          return "Der findes allerede en mappe med det navn, vælg et andet navn!";
        } else {
          return true;
        }
      },
    },

    {
      type: "list",
      name: "template",
      message: "Hvilken template vil du bruge?",
      choices: templatesLit,
    },

    {
      type: "list",
      name: "buildTool",
      message: "Hvilken build tool vil du bruge? (ikke nødvendigt)",
      choices: buildTools,
    },

    {
      type: "checkbox",
      name: "libarys",
      message: "Nogen libarys to vil tilføge? (ikke nødvendigt)",
      choices: libarys,
    },

    {
      type: "confirm",
      name: "git",
      message: "Vil du bruge git? (ikke nødvendigt)",
      default: false,
    },
  ];

  // Run spørgsmålene
  inquirer.prompt(questions).then((answers) => {
    // Create spinner
    const spin = spinner.createSpinner("Opretter projekt...").start();

    // Create folder
    fs.mkdirSync(answers.project_name);

    // Creating cli.config.js
    const fileContents = `export default {
  // Her er det et resumé af hvad projektet indeholder
  template: "${answers.template}",
  buildTool: "${answers.buildTool}",
  libarys: ${JSON.stringify(answers.libarys)},
  git: ${answers.git}
};
`;
    fs.writeFileSync(
      answers.project_name + "/cli.config.js",
      fileContents,
      (err) => {
        if (err) throw err;
      }
    );

    // Only create assets folder if default template is selected
    if (answers.template === "default") {
      // Create "assets" folder in project folder
      fs.mkdirSync(answers.project_name + "/assets");
    }
    // If git create .gitignore file and run "git init" inside project folder
    if (answers.git) {
      // Create .gitignore file
      fs.writeFileSync(
        answers.project_name + "/.gitignore",
        `
node_modules
.DS_Store
`
      );
      // Run "git init" inside project folder
      exec(
        "git init",
        { cwd: answers.project_name },
        (error, stdout, stderr) => {
          if (error) {
            spin.error();
            console.log(`error: ${error.message}`);
            return;
          }

          // res text
          const res = `${chalk.gray(
            `Git repository oprettet i ${chalk.greenBright(
              `${answers.project_name}`
            )} mappen`
          )}`;

          if (stderr) {
            console.log(res);
            return;
          }

          console.log(res);
        }
      );
    }

    switch (answers.template) {
      case "default": {
        template.defaultTemplate(
          answers.project_name,
          answers.buildTool,
          answers.libarys
        );

        break;
      }

      case "tailwindcss": {
        template.tailwindcss(
          answers.project_name,
          answers.buildTool,
          answers.libarys
        );
      }
    }

    setTimeout(() => {
      spin.success();

      console.log(`\nNu er dit projekt klar til at blive brugt! 🎉`);
    }, 1000);
  });
}
