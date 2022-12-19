const {google} = require('googleapis');
const {program} = require('commander');
const {authorize} = require('./auth')
const {render} = require('./render');

program.option('--start <start date>').option('--end <end date>');
program.parse();
const opts = program.opts();

function extractHashtags(text) {
  text ||= "";
  const matches = text.matchAll(/(\#[\w-]+)/g);
  const result = new Set();
  for (const match of matches) result.add(match[0]);
  return result;
}
exports.extractHashtags = extractHashtags;

// Be default, returns the beginning an end of the current week.
function getDateRange() {
  if (opts['start'] && opts['end']) {
    return [new Date(opts['start']), new Date(opts['end'])];
  }

  const today = new Date();
  function lastSunday() {
    return new Date(today.getDate() - today.getDay());
  }
  function nextMonday() {
    return new Date(today.getDate() + (6 - today.getDay()) + 1);
  }
  return [lastSunday(), nextMonday()];
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

function hashtags(event) {
  const summary = extractHashtags(event.summary);
  const description = extractHashtags(event.description);
  return new Set([...summary, ...description]);
}

class Track {
  constructor(name) {
    this.name = name
    this.events = [];
  }
  
  add(event) {
    this.events.push(event);
  }

  durationMinutes() {
    return this.events.reduce((sum, event) => {
      return sum + event.durationMinutes();
    }, 0);
  }
}

class Event {
  constructor(googleEvent) {
    this.googleEvent = googleEvent;
  }

  summary() {
    return this.googleEvent.summary;
  }

  description() {
    return this.googleEvent.description;
  }

  durationMinutes() {
    return (this.endTime() - this.startTime()) / 60000;
  }

  startTime() {
    return new Date(this.googleEvent.start.dateTime);
  }

  endTime() {
    return new Date(this.googleEvent.end.dateTime);
  }

  hashtags() {
    const summary = extractHashtags(this.summary());
    const description = extractHashtags(this.description());
    return new Set([...summary, ...description]);
  }
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