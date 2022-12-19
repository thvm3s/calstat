const {program} = require('commander');

program.option('--start <start date>').option('--end <end date>');
program.parse();
const opts = program.opts();

// Be default, returns [last sunday, next monday].
function getDateRange(today = new Date()) {
  if (opts['start'] && opts['end']) {
    return [new Date(opts['start']), new Date(opts['end'])];
  }
  function midnightOf(date) {
    const result = new Date(today);
    result.setHours(0, 0, 0, 0);
    result.setDate(date);
    return result;
  }
  return [
    midnightOf(today.getDate() - today.getDay()),
    midnightOf(today.getDate() + (6 - today.getDay()) + 1),
  ];
}

// For testing
exports.getDateRange = getDateRange;