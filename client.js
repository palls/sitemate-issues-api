const axios = require('axios');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const API_URL = 'http://localhost:3000/issues';


//Function to Read all the presnt issue with the server
function printIssues() {
  axios.get(API_URL)
    .then(response => {
      console.log('Current Issues:');
      console.table(response.data);
      promptAction();
    })
    .catch(error => {
      console.error(error);
      promptAction();
    });
}


//Read a specific issue from the server
function specificIssue() {
    rl.question('Issue ID: ', id => {
      axios.get(`${API_URL}/${id}`)
        .then(response => {
          if (response.status === 200) {
            console.log('Specific Issues:');
            console.log(`Issue ID: ${response.data.id}`);
            console.log(`Issue Title: ${response.data.title}`);
            console.log(`Issue Description: ${response.data.description}`);
          } else {
              // If the issue is not found provide suitable error message
              console.log(response.data.error);
          }
          promptAction();
        })
        .catch(error => {
          if (error.response && error.response.status === 404) {
              // If the issue is not found provide suitable error message
              console.log(`Issue ${id} not found`);
          } else {
              console.error(error);
          }
          promptAction();
        });
    });
  }

//Function to create a new issue with the server
function createIssue() {
  rl.question('Title: ', title => {
    rl.question('Description: ', description => {
      const issue = { title, description };
      axios.post(API_URL, issue)
        .then(response => {
          console.log(`Created issue ${response.data.id}`);
          promptAction();
        })
        .catch(error => {
          console.error(error);
          promptAction();
        });
    });
  });
}


//Update an exisiting issue with the server
function updateIssue() {
  rl.question('Issue ID: ', id => {
    rl.question('Title: ', title => {
      rl.question('Description: ', description => {
        const issue = { title, description };
        axios.put(`${API_URL}/${id}`, issue)
          .then(response => {
            if (response.status === 200) {
                console.log(`Updated issue ${response.data.id}`);
            } else {
                // If the issue is not found provide suitable error message
                console.log(response.data.error);
            }
            promptAction();
          })
          .catch(error => {
            if (error.response && error.response.status === 404) {
                // If the issue is not found provide suitable error message
                console.log(`Issue ${id} not found`);
            } else {
                console.error(error);
            }
            promptAction();
          });
      });
    });
  });
}


// Delete and existing issue from the server
function deleteIssue() {
  rl.question('Issue ID: ', id => {
    axios.delete(`${API_URL}/${id}`)
      .then(response => {
        if (response.status === 200) {
            console.log(`Deleted issue ${response.data.id}`);
        } else {
            // If the issue is not found provide suitable error message
            console.log(response.data.error);
        }
        promptAction();
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
            // If the issue is not found provide suitable error message
            console.log(`Issue ${id} not found`);
        } else {
            console.error(error);
        }
        promptAction();
      });
  });
}

function promptAction() {
  rl.question('Select an action: [c]reate, [r]ead, [u]pdate, [d]elete, [s]pecific issue or [q]uit: ', action => {
    switch (action.toLowerCase()) {
      case 'c':
        createIssue();
        break;
      case 'r':
        printIssues();
        break;
      case 'u':
        updateIssue();
        break;
      case 'd':
        deleteIssue();
        break;
    case 's':
        specificIssue();
        break;
      case 'q':
        rl.close();
        break;
      default:
        console.log('Invalid action');
        promptAction();
        break;
    }
  });
}

promptAction();
