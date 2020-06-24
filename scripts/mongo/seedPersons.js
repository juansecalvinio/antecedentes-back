// DEBUG=app:* node scripts/mongo/seedPersons.js

const chalk = require('chalk');
const debug = require('debug')('app:scripts:persons');
const MongoLib = require('../../lib/mongo');
const { personsMock } = require('../../utils/mocks/persons');

async function seedPersons() {
  try {
    const mongoDB = new MongoLib();

    const promises = personsMock.map(async person => {
      await mongoDB.create('personas', person);
    });

    await Promise.all(promises);
    debug(chalk.green(`${promises.length} persons have been created succesfully`)); // prettier-ignore
    return process.exit(0);
  } catch (error) {
    debug(chalk.red(error));
    process.exit(1);
  }
}

seedPersons();