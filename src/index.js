const core = require('@actions/core');
const github = require('@actions/github');

const github_token = core.getInput("action-token", { required: true });
const milestone = core.getInput("milestone", { required: true });

async function run() {
    try {
        const context = github.context;

        const oc = github.getOctokit(github_token);

        //get issue detail
        const { data: issue } = await oc.rest.issues.get(
            {
                ...context.repo,
                issue_number: context.issue.number
            }
        )
        //get issue title
        const title_issue = issue.title;
        core.info("The title of this issue is: " + title_issue);

        //get issue milestone
        const issue_milestone = issue.milestone;

        if (issue_milestone != null) {
            core.info("The issue #" + context.issue.number + " already have milestone: " + issue_milestone.title);
            return;
        }

        if (milestone.length == 0) {
            throw new Error("There is no corresponding milestones,please check your yml file or issue title");
        }
        core.info("The target milestone which need to add to this issue is: " + milestone);

        //get milestones of repository
        const { data: repo_milestones } = await oc.rest.issues.listMilestones(
            {
                ...context.repo,
            }
        )

        if (repo_milestones.length == 0) {
            throw new Error("The repository " + context.repo.repo + "don't have any milestone");
        }

        //check whether milestone exists and get the number of target milestone
        let target = -1;
        for (const repo_mile of repo_milestones) {
            if (targetName == repo_mile.title) {
                target = repo_mile.number;
                break;
            }
        }

        if (target == -1) {
            throw new Error("There is no corresponding Milestone in the repository");
        }

        //add milestone to issue
        await oc.rest.issues.update(
            {
                ...context.repo,
                issue_number: context.issue.number,
                milestone: target,
            }
        )

    } catch (err) {
        core.setFailed(err.message);
    }
}

run();