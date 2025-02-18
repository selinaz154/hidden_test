const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Octokit } = require("@octokit/rest");
const app = express();
const port = 1313;

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN // Ensure GITHUB_TOKEN is set in your environment variables
});

app.use(bodyParser.json());
app.use(cors());

async function updateGitHubFile(content) {
  const path = 'submissions.txt'; // Path to the file in the repository
  const repo = { owner: "yourGitHubUsername", repo: "yourRepositoryName" };

  try {
    // Retrieve the file from the repository
    const { data: fileData } = await octokit.repos.getContent({
      ...repo,
      path,
      ref: 'heads/main' // or the branch name you want to target
    });

    // Update the file with the new content
    const { data: updateData } = await octokit.repos.createOrUpdateFileContents({
      ...repo,
      path,
      message: "Update submissions.txt",
      content: Buffer.from(content + '\n', 'utf8').toString('base64'), // Encode content in base64
      sha: fileData.sha, // Needed to update the file
      branch: 'main'
    });

    console.log("File updated on GitHub:", updateData.commit.message);
  } catch (error) {
    console.error("Error updating GitHub file:", error);
    throw error;
  }
}

app.post('/submit', async (req, res) => {
  const { firstName, lastName, researchArea, courses } = req.body;
  const content = `${firstName} ${lastName}, Research Area: ${researchArea}, Courses: ${courses}`;

  try {
    await updateGitHubFile(content); // Call the function to update GitHub
    res.status(200).send('Data received and written to GitHub file successfully');
  } catch (error) {
    res.status(500).send('Failed to update data on GitHub');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
