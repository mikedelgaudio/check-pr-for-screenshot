# check-pr-for-screenshot

This action checks the body of a PR for a keyword that you've included a screenshot.

## Usage

`bodyContains` allows you to detect if the body of PR has a certain word

```yaml
name: "Check PR for word"
on:
  pull-request:
    types: [opened, edited, ready_for_review]

jobs:
  check_pr:
    runs-on: ubuntu-latest
    steps:
      - name: Check PR
        uses: mikedelgaudio/check-pr-for-screenshot@v0
        with:
          github-token: ${{github.token}}
          bodyContains: "Test"
```
