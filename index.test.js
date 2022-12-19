const {extractHashtags} = require('./index');
const {expect, test} = require('@jest/globals');

test('extracts a single hashtag', () => {
  const content = "This is a sentence with a #hashtag";
  expect(Array.from(extractHashtags(content))).toEqual(["#hashtag"]);
});

test('extracts a hashtag ending in non-word character', () => {
  const content = "This is a sentence with a #hashtag.";
  expect(Array.from(extractHashtags(content))).toEqual(["#hashtag"]);
});

test('extracts multiple hashtags', () => {
  const content = "This is a #sentence with a #hashtag.";
  expect(Array.from(extractHashtags(content)).slice().sort())
    .toEqual(["#hashtag", "#sentence"]);
});

test('extracts hashtag with valid separator', () => {
  const content = "This is a sentence with a #hash-tag.";
  expect(Array.from(extractHashtags(content)).slice().sort())
    .toEqual(["#hash-tag"]);
});