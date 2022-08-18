const core = require('@actions/core');
const github = require('@actions/github');

const github_token = core.getInput("action-token", { required: true });
const milestones = JSON.parse(core.getInput("milestones"));

async function run() {
    try {
        const context = github.context;

        //get issue type regexp object Array
        let re_title = getTitleRe();
        core.info(JSON.stringify(re_title));

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

        //get issue milestone
        const issue_milestone = issue.milestone;

        if (issue_milestone != null) {
            core.info("The issue #" + context.issue.number + "already have milestone: " + issue_milestone.title);
            return;
        }

        //get the name of target milestone
        const targetName = getTargetName();

        //get milestones of repository
        const { data: repo_milestones } = await oc.rest.issues.listMilestones(
            {
                ...context.repo,
            }
        )

        if (repo_milestones.length == 0) {
            throw "The repository " + context.repo.repo + "don't have any milestone";
        }

        //check whether milestone exists and get the number of target milestone
        let target = -1;
        for (const repo_mile of repo_milestones) {
            if (targetName == repo_mile.title) {
                target = repo_mile.number;
            }
        }

        if (target == -1) {
            throw "There is no corresponding Milestone in the repository";
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

function getTargetName(title, re_title) {
    for (let { re, mile } of re_title) {
        re.lastIndex = 0;
        if (re.test(title)) {
            return mile;
        }
    }
    return null;
}

function getTitleRe() {
    let res = new Array();
    for (const type of Object.keys(milestones)) {
        res.push(
            {
                re: new RegExp(reParse(type), "igm"),
                mile: milestones[type],
            }
        );
    }
    return res;
}

function reParse(str) {
    let ans = "";
    for (let index = 0; index < str.length; index++) {
        const e = str[index];
        if (e == "/" || e == "{" || e == "}" || e == "[" || e == "]" ||
            e == "(" || e == ")" || e == "^" || e == "$" || e == "+" ||
            e == "\\" || e == "." || e == "*" || e == "|" || e == "?") {
            ans += "\\";
        }
        ans += e;
    }
    return ans
}

run();