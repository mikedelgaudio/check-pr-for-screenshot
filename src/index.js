import * as core from "@actions/core";
const { context } = require("@actions/github");

async function run() {
  try {
    // Get token
    const token = core.getInput("github-token", { required: true });
    // const github = new GitHub(token, {});

    // Check if the body contains required string
    const bodyContains = core.getInput("bodyContains");

    if (bodyContains) {
      if (!context.payload.pull_request.body) {
        core.setFailed("The body of the PR is empty, can't check");
      } else {
        console.log(JSON.stringify(context.payload));
        if (
          bodyContains &&
          context.payload.pull_request.body.indexOf(bodyContains) < 0
        ) {
          core.setFailed("The body of the PR does not contain " + bodyContains);
        }
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
