const Agenda = require('agenda');
const { mongo, jobTypes } = require('../config/vars');

const connectionOpts = { db: { address: mongo.uri, collection: 'agendaJobs' } };

const agenda = new Agenda(connectionOpts);

let newJobTypes = jobTypes ? jobTypes.split(',') : [];

newJobTypes.forEach(type => {
  require('./' + type)(agenda);
});

if (newJobTypes.length) {
  agenda.start(); // Returns a promise, which should be handled appropriately
}

module.exports = agenda;