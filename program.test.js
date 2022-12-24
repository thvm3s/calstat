const {getDateRange} = require('./program');
const {test, expect} = require('@jest/globals');

test('get date range within the same year', () => {
    const today = new Date("2022-06-20T22:42:16.652Z");
    const [start, end] = getDateRange(today);
    expect(start.toLocaleString()).toEqual("6/1/2022, 12:00:00 AM");
    expect(end.toLocaleString()).toEqual("7/1/2022, 12:00:00 AM");
});

test('get date range for January', () => {
    const today = new Date("2022-01-20T22:42:16.652Z");
    const [start, end] = getDateRange(today);
    expect(start.toLocaleString()).toEqual("1/1/2022, 12:00:00 AM");
    expect(end.toLocaleString()).toEqual("2/1/2022, 12:00:00 AM");
});

test('get date range for December', () => {
    const today = new Date("2022-12-20T22:42:16.652Z");
    const [start, end] = getDateRange(today);
    expect(start.toLocaleString()).toEqual("12/1/2022, 12:00:00 AM");
    expect(end.toLocaleString()).toEqual("1/1/2023, 12:00:00 AM");
});