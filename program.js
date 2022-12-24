const {program} = require('commander');

program.option('--start <start date>').option('--end <end date>');
program.parse();
const opts = program.opts();

// Be default, returns [1st day of month, 1st day of next month].
function getDateRange(today = new Date()) {
  if (opts['start'] && opts['end']) {
    return [new Date(opts['start']), new Date(opts['end'])];
  }
  function midnightOf(date, month, year) {
    const result = new Date();
    result.setHours(0, 0, 0, 0);
    result.setDate(date);
    result.setMonth(month % 12);
    result.setFullYear(year);
    return result;
  }
  function getEndYear() {
    return today.getFullYear() + (today.getMonth() == 11 ? 1 : 0);
  }
  return [
    midnightOf(1, today.getMonth(), today.getFullYear()),
    midnightOf(1, today.getMonth() + 1, getEndYear()),
  ];
}

// For testing
exports.getDateRange = getDateRange;