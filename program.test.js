const {getDateRange} = require('./program');
const {test, expect} = require('@jest/globals');

test('get date range within the same month', () => {
    const today = new Date("2022-12-20T22:42:16.652Z");
    const [start, end] = getDateRange(today);
    expect(start.toLocaleString()).toEqual("12/18/2022, 12:00:00 AM");
    expect(end.toLocaleString()).toEqual("12/25/2022, 12:00:00 AM");
});

test('get date range across previous month boundaries', () => {
    const today = new Date("2023-01-31T22:42:16.652Z");
    const [start, end] = getDateRange(today);
    expect(start.toLocaleString()).toEqual("1/29/2023, 12:00:00 AM");
    expect(end.toLocaleString()).toEqual("2/5/2023, 12:00:00 AM");
});

test('get date range across next month boundaries', () => {
    const today = new Date("2023-02-03T22:42:16.652Z");
    const [start, end] = getDateRange(today);
    expect(start.toLocaleString()).toEqual("1/29/2023, 12:00:00 AM");
    expect(end.toLocaleString()).toEqual("2/5/2023, 12:00:00 AM");
});