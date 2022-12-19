exports.render = function(tracks) {
  tracks.sort((a, b) => {
    return (b.durationMinutes() < a.durationMinutes()) ? -1 : 1;
  });
  const totalMinutes = tracks.reduce((s, track) => s + track.durationMinutes(), 0);

  console.log("Summary\n-------")
  for (const track of tracks) {
    const percent = track.durationMinutes() / totalMinutes * 100
    console.log(renderSummary(percent, track));
  }
  console.log(`Total: ${renderDuration(totalMinutes)}`)

  console.log("\nDetail\n------");
  for (const track of tracks) {
    console.log(track.name);
    for (const event of track.events) {
      console.log(renderEvent(event));
    }
    console.log("");
  }
};

function renderSummary(percent, track) {
  return `${percent.toFixed(1)}% (${renderDuration(track.durationMinutes())}) — ${track.name}`;
}

function renderDuration(minutes) {
  h = Math.floor(minutes / 60);
  m = minutes % 60;

  result = "";
  if (h != 0) result = result + `${h}h`
  if (m != 0) result = result + `${m}m`
  return result;
}

function renderEvent(event) {
  return `${event.startTime().toLocaleDateString()} ` +
    `${renderDuration(event.durationMinutes())} — ${event.summary()}`;
}
