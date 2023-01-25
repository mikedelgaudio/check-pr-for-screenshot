# Check-PR-For-2-Accessibility-Images

This action checks the body of a PR for two Markdown or HTML images attached after the `a11y` keyword. The purpose of this Action is to remind developers to attach before and after screenshots of the accessibility tool into the body message of a pull request.

## Usage

- `checkForImages`: detect if the body of PR has an image by matching Markdown or HTML Regex for an image. The bot leaves a comment on PR if no image is attached.

- `ignoreDependabot`: disables functionality on PRs authored by dependabot

```yaml
name: "Check-PR-For-Image"
on:
  pull-request:
    types: [opened, ready_for_review]

jobs:
  Check-PR-For-Image:
    # Necessary for bot to write comments on PR reviews
    permissions:
      pull-requests: write
    runs-on: ubuntu-latest
    steps:
      - name: Check PR
        uses: mikedelgaudio/check-pr-for-screenshot@main
        with:
          GITHUB_TOKEN: ${{github.token}}
          checkForImages: true #default
          ignoreDependabot: true #default
```

## After setup, example PR message

There are three use cases a PR message may contain:

- `a11y: N/A`: disables bot for specific PR
- `a11y: ![accessibility-screenshot-BEFORE-my-changes](https://your-image-url.com) ![accessibility-screenshot-AFTER-my-changes](https://your-image-url.com)`: verifies PR meets standard of two screenshots attached
- No `a11y` tag auto fails the PR

```markdown
# Title Here

## What's Changed:

- Fixed big bug
- Changed colors
- Made things nice

a11y: ![accessibility-screenshot-BEFORE-my-changes](https://your-image-url.com) ![accessibility-screenshot-AFTER-my-changes](https://your-image-url.com)
```
