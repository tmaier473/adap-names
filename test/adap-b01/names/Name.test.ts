import { describe, it, expect } from "vitest";
import { Name, DEFAULT_DELIMITER } from "../../../src/adap-b01/names/Name";

describe("Basic initialization tests", () => {
  it("test construction 1", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("should create a name with default delimiter", () => {
    const n: Name = new Name(["a", "b"]);
    expect(n.asString()).toBe(`a${DEFAULT_DELIMITER}b`);
    expect(n.getNoComponents()).toBe(2);
  });

  it("should create a name with a custom delimiter", () => {
    const n: Name = new Name(["a", "b"], "/");
    expect(n.asString()).toBe("a/b");
  });

  it("should create an empty name", () => {
    const n: Name = new Name([]);
    expect(n.getNoComponents()).toBe(0);
    expect(n.asString()).toBe("");
  });
});

describe("asString tests", () => {
  it("should return string with default delimiter", () => {
    const n: Name = new Name(["oss", "fau", "de"]);
    expect(n.asString()).toBe("oss.fau.de");
  });

  it("should return string with provided delimiter", () => {
    const n: Name = new Name(["oss", "fau", "de"]);
    expect(n.asString("-")).toBe("oss-fau-de");
  });

  it("should not escape special characters", () => {
    const n: Name = new Name(["a.b", "c\\d"]);
    expect(n.asString()).toBe("a.b.c\\d");
  });

  it("should return empty string for an empty name", () => {
    const n: Name = new Name([]);
    expect(n.asString()).toBe("");
  });

  it("should return single component for a one-item name", () => {
    const n: Name = new Name(["hello"]);
    expect(n.asString()).toBe("hello");
  });
});

describe("asDataString tests", () => {
  it("should return a simple data string", () => {
    const n: Name = new Name(["oss", "fau", "de"]);
    expect(n.asDataString()).toBe("oss.fau.de");
  });

  it("should escape delimiters in components", () => {
    const n: Name = new Name(["a.b", "c"]);
    expect(n.asDataString()).toBe("a\\.b.c");
  });

  it("should escape escape-characters in components", () => {
    const n: Name = new Name(["a\\b", "c"]);
    expect(n.asDataString()).toBe("a\\\\b.c");
  });

  it("should handle both delimiters and escapes correctly", () => {
    const n: Name = new Name(["a\\.b", "c.d", "e\\f"]);
    expect(n.asDataString()).toBe("a\\\\\\.b.c\\.d.e\\\\f");
  });

  it("should correctly handle the example from the docs", () => {
    const n: Name = new Name(["Oh..."]);
    expect(n.asDataString()).toBe("Oh\\.\\.\\.");
  });

  it("should handle empty components", () => {
    const n: Name = new Name(["", "", "", ""]);
    expect(n.asDataString()).toBe("...");
  });

  it("should return empty string for an empty name", () => {
    const n: Name = new Name([]);
    expect(n.asDataString()).toBe("");
  });
});

describe("getComponent tests", () => {
  const n: Name = new Name(["oss", "fau", "de"]);;
  it("should get a component by index", () => {
    expect(n.getComponent(0)).toBe("oss");
    expect(n.getComponent(2)).toBe("de");
  });

  it("should return empty string for negative index", () => {
    expect(n.getComponent(-1)).toBe("");
  });

  it("should return empty string for out-of-bounds index", () => {
    expect(n.getComponent(99)).toBe("");
  });

  it("should return empty string for non-integer index", () => {
    expect(n.getComponent(1.5)).toBe("");
  });
});

describe("setComponent tests", () => {
  it("should set a component by index", () => {
    const n: Name = new Name(["oss", "fau", "de"]);
    n.setComponent(1, "cs");
    expect(n.asString()).toBe("oss.cs.de");
  });

  it("should not change array for negative index", () => {
    const n: Name = new Name(["oss", "fau", "de"]);
    n.setComponent(-1, "fail");
    expect(n.asString()).toBe("oss.fau.de");
  });

  it("should not change array for out-of-bounds index", () => {
    const n: Name = new Name(["oss", "fau", "de"]);
    n.setComponent(99, "fail");
    expect(n.asString()).toBe("oss.fau.de");
  });
});

describe("getNoComponents tests", () => {
  it("should return the correct number of components", () => {
    const n: Name = new Name(["oss", "fau", "de"]);
    expect(n.getNoComponents()).toBe(3);
  });

  it("should return 0 for an empty name", () => {
    const n: Name = new Name([]);
    expect(n.getNoComponents()).toBe(0);
  });
});

describe("Basic function tests", () => {
  it("test insert", () => {
    let n: Name = new Name(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("should insert at the beginning", () => {
    let n: Name = new Name(["oss", "fau", "de"]);
    n.insert(0, "www");
    expect(n.asString()).toBe("www.oss.fau.de");
    expect(n.getNoComponents()).toBe(4);
  });

  it("should insert in the middle", () => {
    let n: Name = new Name(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
    expect(n.getNoComponents()).toBe(4);
  });

  it("should insert at the end (valid index)", () => {
    let n: Name = new Name(["oss", "fau", "de"]);
    n.insert(3, "com");
    expect(n.asString()).toBe("oss.fau.de.com");
    expect(n.getNoComponents()).toBe(4);
  });

  it("should not insert for negative index", () => {
    let n: Name = new Name(["oss", "fau", "de"]);
    n.insert(-1, "fail");
    expect(n.asString()).toBe("oss.fau.de");
  });

  it("should not insert for out-of-bounds index", () => {
    let n: Name = new Name(["oss", "fau", "de"]);
    n.insert(99, "fail");
    expect(n.asString()).toBe("oss.fau.de");
  });
});

describe("append tests", () => {
  it("should append a component", () => {
    let n: Name = new Name(["oss", "fau", "de"]);
    n.append("com");
    expect(n.asString()).toBe("oss.fau.de.com");
    expect(n.getNoComponents()).toBe(4);
  });

  it("should append to an empty n", () => {
    let n = new Name([]);
    n.append("hello");
    expect(n.asString()).toBe("hello");
    expect(n.getNoComponents()).toBe(1);
  });
});

describe("remove tests", () => {
  it("should remove from the beginning", () => {
    let n: Name = new Name(["oss", "fau", "de"]);
    n.remove(0);
    expect(n.asString()).toBe("fau.de");
    expect(n.getNoComponents()).toBe(2);
  });

  it("should remove from the middle", () => {
    let n: Name = new Name(["oss", "fau", "de"]);
    n.remove(1);
    expect(n.asString()).toBe("oss.de");
    expect(n.getNoComponents()).toBe(2);
  });

  it("should remove from the end", () => {
    let n: Name = new Name(["oss", "fau", "de"]);
    n.remove(2);
    expect(n.asString()).toBe("oss.fau");
    expect(n.getNoComponents()).toBe(2);
  });

  it("should not remove for negative index", () => {
    let n: Name = new Name(["oss", "fau", "de"]);
    n.remove(-1);
    expect(n.asString()).toBe("oss.fau.de");
  });

  it("should not remove for out-of-bounds index", () => {
    let n: Name = new Name(["oss", "fau", "de"]);
    n.remove(99);
    expect(n.asString()).toBe("oss.fau.de");
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new Name(["oss", "fau", "de"], '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    // Original name string = "oss.cs.fau.de"
    let n: Name = new Name(["oss.cs.fau.de"], '#');
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });
});
