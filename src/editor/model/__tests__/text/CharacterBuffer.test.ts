import { CharacterBuffer } from "../../text/CharacterBuffer";
import { Range } from "../../base/Range";

const PAGE_SIZE = 1024;

describe("constructor", () => {
  test("create an empty buffer", () => {
    const buffer = new CharacterBuffer();
    expect(buffer.length).toEqual(0);
    expect(buffer.nextPos).toEqual(0);
    expect(buffer.getText(new Range(0))).toEqual("");
  });

  test("create buffer with string", () => {
    const raw = "0123456789";
    const buffer = new CharacterBuffer(raw);
    expect(buffer.length).toEqual(raw.length);
    expect(buffer.getText(new Range(0, 2))).toEqual(raw.substr(0, 2));
    expect(buffer.getText(new Range(6, 4))).toEqual(raw.substr(6, 4));
  });
});

describe("method: append", () => {
  let buffer: CharacterBuffer;
  beforeEach(() => {
    buffer = new CharacterBuffer();
  });

  test("append characters on empty buffer", () => {
    buffer.append("abc");
    expect(buffer.length).toEqual(3);
    expect(buffer.getText(new Range(0, 1))).toEqual("a");
    expect(() => {
      buffer.getText(new Range(2, 4));
    }).toThrowError();
  });

  test("append characters on non-empty buffer", () => {
    const originalString = "0123456789";
    buffer = new CharacterBuffer(originalString);
    const chars = "abcd";
    buffer.append(chars);
    expect(buffer.length).toEqual(14);
    expect(buffer.getText(new Range(0, 10))).toEqual(originalString);
    expect(buffer.getText(new Range(10, 4))).toEqual(chars);
    expect(buffer.getText(new Range(8, 4))).toEqual("89ab");
  });

  test("append a full page", () => {
    let numbers = "0123456789";
    let chars = "";
    for (let i = 0; i < 102; i += 1) {
      chars += numbers;
    }
    chars += "0123";
    buffer.append(chars);
    expect(buffer.nextPos % PAGE_SIZE).toEqual(0);
    buffer.append("4");
    expect(buffer.nextPos % PAGE_SIZE).toEqual(1);
  });

  test("append multiple-page chars", () => {
    let chars: string[] = [];
    for (let i = 0; i < 10000; i += 1) {
      chars.push(String(i % 10));
    }
    const text = chars.join("");
    buffer.append(text);
    const start = 100;
    const length = 2000;
    const startChar = String(start % 10);
    const endChar = String((start + length - 1) % 10);
    const result = buffer.getText(new Range(start, length));
    expect(result.length).toEqual(length);
    expect(result[0]).toEqual(startChar);
    expect(result[length - 1]).toEqual(endChar);
  });
});
