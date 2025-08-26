// agenda.js
const Agenda = require('agenda');

const agenda = new Agenda({
  db: { address: process.env.MONGO_URI || 'mongodb+srv://roomcraft:7FaU2sQurB3Sevdh@roomcraft.gps0ygv.mongodb.net/todo', collection: process.env.AGENDA_COLLECTION || 'agendaJobs' },
  processEvery: '30 seconds'
});

module.exports = agenda;
