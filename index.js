const {google} = require('googleapis');
const {getDateRange} = require('program');
const {authorize} = require('./auth')
const {render} = require('./render');
const {Track, Event} = require('./models');

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