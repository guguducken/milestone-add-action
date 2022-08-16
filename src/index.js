const core = require('@actions/core');
const github = require('@actions/github');

const github_token = core.getInput("action-token", { required: true });
const milestones = core.getInput("milestones");

async function run() {
    const context = github.context;

    const oc = github.getOctokit(github_token);

    const { data: issue } = await oc.rest.issues.get(
        ...context.issue,
    )
    core.info(JSON.stringify(issue));
}

run();