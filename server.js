const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//Exposing port 3000
const PORT = process.env.PORT || 3000;

let issues = [
  { id: 1, title: 'Issue 1', description: 'This is the first issue' },
  { id: 2, title: 'Issue 2', description: 'This is the second issue' },
  { id: 3, title: 'Issue 3', description: 'This is the third issue' },
];

app.use(bodyParser.json());

// Get all issues
app.get('/issues', (req, res) => {
  res.json(issues);
});

// Get a specific issue by ID
app.get('/issues/:id', (req, res) => {
  const issue = issues.find(issue => issue.id === parseInt(req.params.id));
  if (!issue) {
    // res.status(404).send('Issue not found');
    res.status(404).json({ error: `Issue ${req.params.id} not found` });
  } else {
    res.json(issue);
  }
});

// Create a new issue
app.post('/issues', (req, res) => {
  const { title, description } = req.body;
  // extracting the maximum Id present in the issue list
  const maxId = issues.reduce((max, issue) => Math.max(max, issue.id), 0);
  //Incrementing the Id by 1
  const id = maxId + 1;
  const issue = { id, title, description };
  issues.push(issue);
  res.json(issue);
});

// Update an existing issue
app.put('/issues/:id', (req, res) => {
  const issue = issues.find(issue => issue.id === parseInt(req.params.id));
  if (!issue) {
    // res.status(404).send('Issue not found');
    res.status(404).json({ error: `Issue ${req.params.id} not found` });
  } else {
    issue.title = req.body.title || issue.title;
    issue.description = req.body.description || issue.description;
    res.json(issue);
  }
});

// Delete an issue by ID
app.delete('/issues/:id', (req, res) => {
  const index = issues.findIndex(issue => issue.id === parseInt(req.params.id));
  if (index === -1) {
    // res.status(404).send('Issue not found');
    res.status(404).json({ error: `Issue ${req.params.id} not found` });
  } else {
    const deletedIssue = issues.splice(index, 1)[0];
    res.status(200).json({ id: deletedIssue.id });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
