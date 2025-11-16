import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b02/names/Name";
import { StringName } from "../../../src/adap-b02/names/StringName";
import { StringArrayName } from "../../../src/adap-b02/names/StringArrayName";

// Factory für beide Implementierungen
const impls: [string, (input: any, delimiter?: string) => Name][] = [
  [
    "StringName",
    (input, delimiter) => {
      if (Array.isArray(input)) {
        if (input.length === 0) return new StringName("", delimiter);
        return new StringName(input.join(delimiter ?? "."), delimiter);
      }
      return new StringName(input, delimiter);
    },
  ],
  [
    "StringArrayName",
    (input, delimiter) => {
      if (typeof input === "string") input = input.split(delimiter ?? ".");
      return new StringArrayName(input, delimiter);
    },
  ],
];

describe("Full Name interface test suite for both implementations", () => {
  impls.forEach(([implName, factory]) => {
    describe(`${implName} - basic component operations`, () => {
      it("gets a specific component", () => {
        const n = factory(["a", "b", "c"]);
        expect(n.getComponent(1)).toBe("b");
      });

      it("sets a specific component", () => {
        const n = factory(["a", "b", "c"]);
        n.setComponent(1, "x");
        expect(n.getComponent(1)).toBe("x");
      });

      it("inserts a component", () => {
        const n = factory(["a", "c"]);
        n.insert(1, "b");
        expect(n.asString()).toBe("a.b.c");
      });

      it("appends a component", () => {
        const n = factory(["a", "b"]);
        n.append("c");
        expect(n.asString()).toBe("a.b.c");
      });

      it("removes a component", () => {
        const n = factory(["a", "b", "c"]);
        n.remove(1);
        expect(n.asString()).toBe("a.c");
      });

      it("concatenates another name", () => {
        const n1 = factory(["a", "b"]);
        const n2 = factory(["c", "d"]);
        n1.concat(n2);
        expect(n1.asString()).toBe("a.b.c.d");
      });

      it("detects empty name", () => {
        const n = factory([], ".");
        expect(n.isEmpty()).toBe(true);
      });

      it("detects non-empty name", () => {
        const n = factory(["a"], ".");
        expect(n.isEmpty()).toBe(false);
      });

      it("returns correct number of components", () => {
        const n = factory(["a", "b", "c"]);
        expect(n.getNoComponents()).toBe(3);
      });
    });

    describe(`${implName} - delimiter handling`, () => {
      it("uses custom delimiter for insert/append", () => {
        const n = factory("a#b#c", "#");
        n.insert(1, "x");
        expect(n.asString("#")).toBe("a#x#b#c");
        n.append("y");
        expect(n.asString("#")).toBe("a#x#b#c#y");
      });
    });

    describe(`${implName} - asDataString`, () => {
      it("escapes escape characters", () => {
        const n = factory(["a\\b", "c"]);
        const result = n.asDataString();
        expect(result.includes("\\\\")).toBe(true);
      });

      if (implName === "StringArrayName") {
        it("escapes escape char and delimiter", () => {
          const n = factory(["a\\b", "c.d"]);
          expect(n.asDataString()).toBe("a\\\\b.c\\.d");
        });
      }
    });
  });
});
