import * as core from "@actions/core";
const { getOctokit, context } = require("@actions/github");

async function run() {
  try {
    // Acquire GitHub Token
    const token = core.getInput("GITHUB_TOKEN", { required: true });
    const octokit = getOctokit(token);

    // Regex Patterns
    const MARKDOWN_IMG_REGEX_PATTERN =
      /!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/;
    const HTML_IMG_REGEX_PATTERN = /<img([\w\W]+?)[\/]?>/;
    const NOT_AVAILABLE_REGEX_PATTERN = /a11y:\s*N\/A/;
    const A11Y_REGEX_PATTERN = /a11y/;

    // Regex Objects
    const MARKDOWN_IMG_REGEX = new RegExp(MARKDOWN_IMG_REGEX_PATTERN, "g");
    const HTML_IMG_REGEX = new RegExp(HTML_IMG_REGEX_PATTERN, "g");
    const NOT_AVAILABLE_REGEX = new RegExp(NOT_AVAILABLE_REGEX_PATTERN, "gi");
    const A11Y_REGEX = new RegExp(A11Y_REGEX_PATTERN, "gi");

    // Acquire booleans from user's YAML workflow config
    const checkForImage = core.getBooleanInput("checkForImage") ?? true;
    const ignoreDependabot = core.getBooleanInput("ignoreDependabot") ?? true;
    if (!checkForImage) return;

    // Optional ignore dependabot PRs
    const prAuthor = context.payload.user.login.toLowerCase();
    core.notice("PR: " + context.payload);

    core.notice("PR: " + prAuthor);
    if (ignoreDependabot && prAuthor === "dependabot") return;

    // Acquire body contents of PR in the form of a string
    const PR_BODY_CONTENTS = context.payload.pull_request.body;
    if (!PR_BODY_CONTENTS) {
      core.setFailed(
        "PRs should have a message or body, add a description before proceeding to help the other developers."
      );
      return;
    }

    // Ensure the developer adds the 'a11y' keyword to the PR body
    if (!A11Y_REGEX.test(PR_BODY_CONTENTS)) {
      core.setFailed(
        "PRs must have the keyword `a11y` followed by 2 accessibility screenshots of before and after your changes. If you wish to disable this, update your PR message with `a11y: N/A`"
      );
      return;
    }

    // PR body contains 'a11y: N/A' option, do nothing
    if (NOT_AVAILABLE_REGEX.test(PR_BODY_CONTENTS)) {
      return;
    }

    let numberOfImagesFound = 0;
    numberOfImagesFound += (PR_BODY_CONTENTS.match(MARKDOWN_IMG_REGEX) ?? [])
      .length;
    numberOfImagesFound += (PR_BODY_CONTENTS.match(HTML_IMG_REGEX) ?? [])
      .length;

    // Ensure PR message contains at least 2 markdown
    if (numberOfImagesFound < 2) {
      core.notice("Frontend PRs should include a screenshot for accessibility");

      const pullRequestNumber = context.payload.pull_request.number;
      await octokit.rest.issues.createComment({
        ...context.repo,
        issue_number: pullRequestNumber,
        body: "Frontend PRs must include 2 screenshots for accessibility.\nEdit your PR message with screenshots of before and after your changes of the accessibility tool. If you wish to disable this, update your PR with `a11y: N/A`",
      });
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
