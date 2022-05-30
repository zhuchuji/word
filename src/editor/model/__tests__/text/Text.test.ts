import Text from "../../text/Text";
import { Range } from "../../base/Range";

let text: Text;

beforeEach(() => {
  text = new Text();
});

describe("method: insert", () => {
  test("insert content on empty document", () => {
    text.insert(0, "abc");
    expect(text.getText(new Range(0))).toEqual("abc");
    text.insert(0, "def", true);
    expect(text.getText(new Range(0))).toEqual("defabc");
    text.insert(1, "gh");
    expect(text.getText(new Range(0))).toEqual("deghfabc");
    text.insert(7, "ij");
    expect(text.getText(new Range(0))).toEqual("deghfabcij");
    text.insert(9, "kh");
    expect(text.getText(new Range(0))).toEqual("deghfabcijkh");
  });

  test("insert content on non-empty document", () => {
    text = new Text("abc");
    expect(text.getText(new Range(0))).toEqual("abc");
    text.insert(0, "def", true);
    expect(text.getText(new Range(0))).toEqual("defabc");
    text.insert(1, "gh");
    expect(text.getText(new Range(0))).toEqual("deghfabc");
    text.insert(7, "ij");
    expect(text.getText(new Range(0))).toEqual("deghfabcij");
    text.insert(9, "kh");
    expect(text.getText(new Range(0))).toEqual("deghfabcijkh");
  });
});

describe("method: getText", () => {
  test("get text from piece table", () => {
    const originalString = "0123456789";
    text = new Text(originalString);
    const text1 = "abcdef";
    const text2 = "ghijkl";
    text.insert(originalString.length - 1, text1);
    text.insert(originalString.length + text1.length - 1, text2);
    expect(text.getText(new Range(0))).toEqual(
      `${originalString}${text1}${text2}`
    );
    expect(text.getText(new Range(2, 4))).toEqual("2345");
    expect(text.getText(new Range(5, 15))).toEqual("56789abcdefghij");
    expect(text.getText(new Range(18, 4))).toEqual("ijkl");
  });
});

describe("method: delete", () => {
  test("delete text", () => {
    const originalString = "0123456789";
    text = new Text(originalString);
    const text1 = "abcdef";
    const text2 = "ghijkl";
    text.insert(originalString.length - 1, text1);
    text.insert(originalString.length + text1.length - 1, text2);
    text.delete(new Range(0, 10));
    expect(text.getText(new Range(0))).toEqual(`${text1}${text2}`);
    text.delete(new Range(2, 2));
    expect(text.getText(new Range(0, 4))).toEqual("abef");
    text.delete(new Range(2, 5));
    expect(text.getText(new Range(0))).toEqual("abjkl");
  });
});
