const { Octokit } = require("@octokit/rest");

module.exports = async (req, res) => {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });

  const { firstName, lastName, researchArea, courses } = req.body;
  const content = `${firstName} ${lastName}, Research Area: ${researchArea}, Courses: ${courses}`;
  const repo = { owner: "yourGitHubUsername", repo: "yourRepositoryName" };
  const path = 'submissions.txt';

  try {
    const { data: fileData } = await octokit.repos.getContent({
      ...repo,
      path,
      ref: 'heads/main'
    });

    const { data: updateData } = await octokit.repos.createOrUpdateFileContents({
      ...repo,
      path,
      message: "Update submissions.txt",
      content: Buffer.from(content + '\n', 'utf8').toString('base64'),
      sha: fileData.sha,
      branch: 'main'
    });

    res.status(200).json({ message: "Data written to GitHub successfully" });
  } catch (error) {
    console.error("Failed to update data on GitHub:", error);
    res.status(500).json({ message: "Failed to update data on GitHub" });
  }
};
