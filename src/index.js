const core = require('@actions/core');
const github = require('@actions/github');

const github_token = core.getInput("action-token", { required: true });
const milestones = core.getInput("milestones");

async function run() {
    const context = github.context;

    const issue_action = context.issue;

    const oc = github.getOctokit(github_token);

    const { data: issue } = await oc.rest.issues.get(
        {
            owner: issue_action.owner,
            repo: issue_action.repo,
            issue_number: issue_action.number
        }
    )
    core.info(JSON.stringify(issue));
}

run();