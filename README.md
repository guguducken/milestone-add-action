# Auto Add Milestone
This action will auto add milestone when issue created.
## Usage

Returns the deepest path to the file changed by the pull request

### First

Create a workflow `milestones.yml` file in your repositories `.github/workflows `directory.

### Inputs

#### action-token

The GitHub Actions token. e.g. `secrets.PATHS_TOKEN`. For more information,See this link: [Creating a personal access token](https://docs.github.com/cn/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

#### co-milestones
Here you need to create a relationship between issue title and milestone. For example:
~~~json
{
    "[BUG]":"v0.0.1",
    "[MOC FEATURE]":"v0.0.1"
}
~~~
### Example
~~~yml
name: Add Milestone
on:
  issues:
    types: [opened,edited]

jobs:
  add:
    runs-on: ubuntu-latest
    steps:
      - uses: guguducken/milestone-add-action@v0.0.1
        with:
          action-token: ${{ secrets.ACTION_TOKEN}}
          co-milestones: >
            {
              "[BUG]":"v0.0.1",
              "[MOC FEATURE]":"v0.0.1"
            }
~~~