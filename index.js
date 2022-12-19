const {google} = require('googleapis');
const {program} = require('commander');
const {authorize} = require('./auth')
const {render} = require('./render');
const {Track, Event} = require('./models');

program.option('--start <start date>').option('--end <end date>');
program.parse();
const opts = program.opts();

// Be default, returns [last sunday, next monday].
function getDateRange(today = new Date()) {
  if (opts['start'] && opts['end']) {
    return [new Date(opts['start']), new Date(opts['end'])];
  }
  function midnightOf(date) {
    const result = new Date();
    result.setHours(0, 0, 0, 0);
    result.setDate(date);
    return result;
  }
  return [
    midnightOf(today.getDate() - today.getDay()),
    midnightOf(today.getDate() + ((7 - today.getDay() + 1) % 7 || 7))
  ];
}

async function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  const [startDate, endDate] = getDateRange();
  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: startDate.toISOString(),
    timeMax: endDate.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });
  return res.data.items
}

function stat(events) {
  const tracks = {};
  for (const googleEvent of events) {
    const event = new Event(googleEvent);
    for (const tag of event.hashtags()) {
      tracks[tag] ||= new Track(tag)
      tracks[tag].add(event);
    }
  }
  render(Object.values(tracks));
}

authorize().then(listEvents).then(stat).catch(console.error);