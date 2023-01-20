# Check-PR-For-Image

This action checks the body of a PR for an attached image.

## Usage

`checkForImage` allows you to detect if the body of PR has an image by matching Markdown Regex for an image. The bot leaves a comment on PR if no image is attached.

```yaml
name: "Check-PR-For-Image"
on:
  pull-request:
    types: [opened, edited, ready_for_review]

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
          checkForImage: true
```
