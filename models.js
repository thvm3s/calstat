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

exports.Track = Track;
exports.Event = Event;

function extractHashtags(text) {
  text ||= "";
  const matches = text.matchAll(/(\#[\w-]+)/g);
  const result = new Set();
  for (const match of matches) result.add(match[0]);
  return result;
}
exports.extractHashtags = extractHashtags;