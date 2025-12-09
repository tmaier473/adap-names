import { describe, it, expect } from "vitest";
import { StringName } from "../../../src/adap-b06/names/StringName";
import { StringArrayName } from "../../../src/adap-b06/names/StringArrayName";

describe("Name Value Type - StringName", () => {
  it("should create a StringName and get components", () => {
    const name = new StringName("oss.cs.fau");
    expect(name.getNoComponents()).toBe(3);
    expect(name.getComponent(0)).toBe("oss");
    expect(name.getComponent(1)).toBe("cs");
    expect(name.getComponent(2)).toBe("fau");
  });

  it("should return new instance on setComponent", () => {
    const name1 = new StringName("a.b.c");
    const name2 = name1.setComponent(1, "x");

    expect(name1.getComponent(1)).toBe("b");
    expect(name2.getComponent(1)).toBe("x");
    expect(name1).not.toBe(name2);
  });

  it("should return new instance on append", () => {
    const name1 = new StringName("a.b");
    const name2 = name1.append("c");

    expect(name1.getNoComponents()).toBe(2);
    expect(name2.getNoComponents()).toBe(3);
    expect(name2.getComponent(2)).toBe("c");
  });

  it("should return new instance on insert", () => {
    const name1 = new StringName("a.c");
    const name2 = name1.insert(1, "b");

    expect(name1.getNoComponents()).toBe(2);
    expect(name2.getNoComponents()).toBe(3);
    expect(name2.getComponent(1)).toBe("b");
  });

  it("should return new instance on remove", () => {
    const name1 = new StringName("a.b.c");
    const name2 = name1.remove(1);

    expect(name1.getNoComponents()).toBe(3);
    expect(name2.getNoComponents()).toBe(2);
    expect(name2.getComponent(1)).toBe("c");
  });

  it("should return new instance on concat", () => {
    const name1 = new StringName("a.b");
    const name2 = new StringName("c.d");
    const name3 = name1.concat(name2);

    expect(name1.getNoComponents()).toBe(2);
    expect(name2.getNoComponents()).toBe(2);
    expect(name3.getNoComponents()).toBe(4);
  });

  it("should properly handle equality with same values", () => {
    const name1 = new StringName("x.y.z");
    const name2 = new StringName("x.y.z");

    expect(name1.isEqual(name2)).toBe(true);
  });

  it("should properly handle equality with different values", () => {
    const name1 = new StringName("x.y.z");
    const name2 = new StringName("a.b.c");

    expect(name1.isEqual(name2)).toBe(false);
  });

  it("should generate consistent hash codes for equal names", () => {
    const name1 = new StringName("test.value");
    const name2 = new StringName("test.value");

    expect(name1.getHashCode()).toBe(name2.getHashCode());
  });
});

describe("Name Value Type - StringArrayName", () => {
  it("should create a StringArrayName and get components", () => {
    const name = new StringArrayName(["oss", "cs", "fau"]);
    expect(name.getNoComponents()).toBe(3);
    expect(name.getComponent(0)).toBe("oss");
    expect(name.getComponent(1)).toBe("cs");
    expect(name.getComponent(2)).toBe("fau");
  });

  it("should return new instance on setComponent", () => {
    const name1 = new StringArrayName(["a", "b", "c"]);
    const name2 = name1.setComponent(1, "x");

    expect(name1.getComponent(1)).toBe("b");
    expect(name2.getComponent(1)).toBe("x");
    expect(name1).not.toBe(name2);
  });

  it("should return new instance on append", () => {
    const name1 = new StringArrayName(["a", "b"]);
    const name2 = name1.append("c");

    expect(name1.getNoComponents()).toBe(2);
    expect(name2.getNoComponents()).toBe(3);
    expect(name2.getComponent(2)).toBe("c");
  });

  it("should properly handle equality", () => {
    const name1 = new StringArrayName(["x", "y", "z"]);
    const name2 = new StringArrayName(["x", "y", "z"]);

    expect(name1.isEqual(name2)).toBe(true);
  });

  it("should have different hash codes for different names", () => {
    const name1 = new StringArrayName(["a", "b"]);
    const name2 = new StringArrayName(["x", "y"]);

    expect(name1.getHashCode()).not.toBe(name2.getHashCode());
  });
});

describe("Cross-implementation equality", () => {
  it("should compare StringName and StringArrayName with same values", () => {
    const stringName = new StringName("a.b.c");
    const arrayName = new StringArrayName(["a", "b", "c"]);

    expect(stringName.isEqual(arrayName)).toBe(true);
  });
});
