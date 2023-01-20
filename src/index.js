import * as core from "@actions/core";
const { GitHub, context } = require("@actions/github");

async function run() {
  try {
    // Get token
    const token = core.getInput("github-token", { required: true });
    const github = new GitHub(token, {});

    const MARKDOWN_IMG_REGEX_PATTERN =
      /!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/;
    const MARKDOWN_IMG_REGEX = new RegExp(MARKDOWN_IMG_REGEX_PATTERN, "g");

    // Check if the body contains required string from YAML config
    const bodyContains = core.getInput("bodyContains");
    const checkForImage = core.getBooleanInput("checkForImage");

    if (bodyContains || checkForImage) {
      if (!context.payload.pull_request.body) {
        core.setFailed(
          "PRs should have a message or body, please add a description before proceeding to help the other developers."
        );
      } else {
        core.info(JSON.stringify(context.payload));

        if (checkForImage && !MARKDOWN_IMG_REGEX.test(bodyContains)) {
          const pull_request_number = context.payload.pull_request.number;

          const new_comment = github.issues.createComment({
            ...context.repo,
            issue_number: pull_request_number,
            body: "Frontend PRs should include a screenshot for accessibility",
          });
        }
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
