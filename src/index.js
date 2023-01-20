import * as core from "@actions/core";
const { getOctokit, context } = require("@actions/github");

async function run() {
  try {
    // Get token
    const token = core.getInput("GITHUB_TOKEN", { required: true });
    const octokit = getOctokit(token);

    const MARKDOWN_IMG_REGEX_PATTERN =
      /!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/;
    const MARKDOWN_IMG_REGEX = new RegExp(MARKDOWN_IMG_REGEX_PATTERN, "g");

    // Check if the body contains required string from YAML config
    const checkForImage = core.getBooleanInput("checkForImage");

    if (checkForImage) {
      if (!context.payload.pull_request.body) {
        core.setFailed(
          "PRs should have a message or body, please add a description before proceeding to help the other developers."
        );
      } else {
        core.debug(JSON.stringify(context.payload));
        if (
          checkForImage &&
          !MARKDOWN_IMG_REGEX.test(context.payload.pull_request.body)
        ) {
          core.notice(
            "Frontend PRs should include a screenshot for accessibility"
          );

          const pull_request_number = context.payload.pull_request.number;
          await octokit.rest.issues.createComment({
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
