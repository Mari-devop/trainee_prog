import inquirer from 'inquirer';

let database = [];

const questions = [
  {
    type: 'input',
    name: 'name',
    message: 'Enter name of the user (Press ENTER to stop adding users)',
    validate: function(value) {
      if (value.trim() === '') {
        console.log('\nStopping process of adding users.');
        return true; 
      }
      return true; 
    }
  },
  {
    type: 'list',
    name: 'gender',
    message: 'Enter gender from the list',
    choices: ['Male', 'Female', 'Other'],
    when: (answers) => answers.name.trim() !== '' 
  },
  {
    type: 'input',
    name: 'age',
    message: 'Enter age of the user',
    when: (answers) => answers.name.trim() !== '' 
  },
  {
    type: 'confirm',
    name: 'addAnother',
    message: 'Do you want to add another user?',
    default: false,
    when: (answers) => answers.name.trim() !== ''
  }
];

function getAnswers(answers = []) {
  return inquirer.prompt(questions)
    .then((response) => {
      if (response.name.trim() === '') {
        return answers; 
      }
      const newAnswers = [...answers, response]; 
      if (response.addAnother) {
        return getAnswers(newAnswers); 
      } else {
        return newAnswers; 
      }
    });
}

function searchUserByName() {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'search',
      message: 'Do u want to findd a user by name?',
      default: false
    }
  ])
  .then((answer) => {
    if(answer.search) {
      return inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Enter the name of the user you want to find:'
        }
      ])
      .then((searchInput) => {
        const foundUser = database.find(user => user.name === searchInput.name);
        if(foundUser) {
          console.log('User found:', foundUser);
        } else {
          console.log('User not found.');
        }
      })
    } else {
      console.log('Exiting search process.');
    }
  });
}

function run() {
  getAnswers()
  .then((allAnswers) => {
    database = allAnswers;
    console.log('All users:', database);
    return searchUserByName()
  })
  .then(() => {
    console.log('App caput =)')
  })
  .catch((error) => {
    console.error('Error occurred:', error);
  });
}

run();