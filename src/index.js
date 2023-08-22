#!/usr/bin/env node

"use strict";

import fs from "fs";
import inquirer from "inquirer";
import * as template from "./templates/export.js";

// Variables
const templatesLit = ["default"];
const buildTools = ["vite", "servemon"];

// Questions
const questions = [
  {
    type: "input",
    name: "project_name",
    message: "Hvad skal dit projekt hedde?",
    default: "min-hjemmeside",
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
];

// Run spørgsmålene
inquirer.prompt(questions).then((answers) => {
  // Create folder
  fs.mkdirSync(answers.project_name);
  // Create "assets" folder in project folder
  fs.mkdirSync(answers.project_name + "/assets");

  switch (answers.template) {
    case "default": {
      template.defaultTemplate(answers.project_name, answers.buildTool);
    }
  }
});
