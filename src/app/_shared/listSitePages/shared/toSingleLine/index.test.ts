import { describe, it, expect } from 'vitest';
import toSingleLine from './index';

describe('toSingleLine', () => {
  it.each([
    ['newline', 'one\ntwo', 'one two'],
    ['CRLF', 'one\r\ntwo', 'one two'],
    ['tabs', 'one\t\ttwo', 'one two'],
    ['double spaces', 'one  two', 'one two'],
    ['leading and trailing', '  \n one two \t', 'one two'],
    ['already single line', 'one two', 'one two'],
  ])('%s', (_label, input, expected) => {
    expect(toSingleLine(input)).toBe(expected);
  });
});
