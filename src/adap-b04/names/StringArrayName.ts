import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {
  protected components: string[] = [];

  constructor(source: string[], delimiter?: string) {
    super(delimiter);
    this.components = [...source];
  }

  protected doClone(components: string[]): Name {
    return new StringArrayName(components, this.delimiter);
  }

  public getNoComponents(): number {
    return this.components.length;
  }

  public getComponent(i: number): string {
    this.assertValidIndexAsPrecondition(i);

    const componentAtIndex = this.components[i];
    MethodFailedException.assert(
      componentAtIndex !== undefined && componentAtIndex !== null
    );

    return componentAtIndex;
  }

  public setComponent(i: number, c: string): void {
    this.assertValidIndexAsPrecondition(i);
    this.assertIsMaskedAsPrecondition(c);

    const oldComponents = [...this.components];
    this.components[i] = c;

    this.assertClassInvariant();

    this.assertSetComponentPostcondition(i, c, oldComponents);
  }

  public insert(i: number, c: string): void {
    this.assertValidInsertIndexAsPrecondition(i);
    this.assertIsMaskedAsPrecondition(c);

    const oldComponents = [...this.components];
    this.components.splice(i, 0, c);

    this.assertClassInvariant();

    this.assertInsertPostcondition(i, c, oldComponents);
  }

  public append(c: string): void {
    this.assertIsMaskedAsPrecondition(c);

    const oldComponents = [...this.components];
    this.components.push(c);

    this.assertClassInvariant();

    this.assertAppendPostcondition(c, oldComponents);
  }

  public remove(i: number): void {
    this.assertValidIndexAsPrecondition(i);

    const oldComponents = [...this.components];
    this.components.splice(i, 1);

    this.assertClassInvariant();

    this.assertRemovePostcondition(i, oldComponents);
  }

  protected assertValidIndexAsPrecondition(i: number): void {
    const isInteger: boolean = Number.isInteger(i);
    const isInBounds: boolean = i >= 0 && i < this.getNoComponents();
    const isValidIndex: boolean = isInteger && isInBounds;

    IllegalArgumentException.assert(
      isValidIndex,
      `Precondition failed: index ${i} is not valid`
    );
  }

  protected assertValidInsertIndexAsPrecondition(i: number): void {
    const isInteger: boolean = Number.isInteger(i);
    const isInBoundsForInsertion: boolean =
      i >= 0 && i <= this.getNoComponents();
    const isValidIndex: boolean = isInteger && isInBoundsForInsertion;

    IllegalArgumentException.assert(
      isValidIndex,
      `Precondition failed: index ${i} is not valid for insertion`
    );
  }

  protected assertSetComponentPostcondition(
    i: number,
    c: string,
    oldComponents: string[]
  ): void {
    if (this.components.length !== oldComponents.length) {
      this.components = oldComponents;
      MethodFailedException.assert(
        false,
        "Postcondition failed: setComponent changed component count"
      );
    }
    if (this.components[i] !== c) {
      this.components = oldComponents;
      MethodFailedException.assert(
        false,
        "Postcondition failed: setComponent did not assign new value"
      );
    }
    for (let j = 0; j < oldComponents.length; j++) {
      if (j !== i && this.components[j] !== oldComponents[j]) {
        this.components = oldComponents;
        MethodFailedException.assert(
          false,
          `Postcondition failed: setComponent modified index ${j}`
        );
      }
    }
  }

  protected assertInsertPostcondition(
    i: number,
    c: string,
    oldComponents: string[]
  ): void {
    if (this.components.length !== oldComponents.length + 1) {
      this.components = oldComponents;
      MethodFailedException.assert(
        false,
        "Postcondition failed: insert did not increase count"
      );
    }
    if (this.components[i] !== c) {
      this.components = oldComponents;
      MethodFailedException.assert(
        false,
        "Postcondition failed: inserted value not found at correct index"
      );
    }
  }

  protected assertAppendPostcondition(
    c: string,
    oldComponents: string[]
  ): void {
    if (this.components.length !== oldComponents.length + 1) {
      this.components = oldComponents;
      MethodFailedException.assert(
        false,
        "Postcondition failed: append did not increase count"
      );
    }
    if (this.components[oldComponents.length] !== c) {
      this.components = oldComponents;
      MethodFailedException.assert(
        false,
        "Postcondition failed: append did not append at end"
      );
    }
  }

  protected assertRemovePostcondition(
    i: number,
    oldComponents: string[]
  ): void {
    if (this.components.length !== oldComponents.length - 1) {
      this.components = oldComponents;
      MethodFailedException.assert(
        false,
        "Postcondition failed: remove did not decrease count"
      );
    }
    for (let j = 0; j < i; j++) {
      if (this.components[j] !== oldComponents[j]) {
        this.components = oldComponents;
        MethodFailedException.assert(
          false,
          "Postcondition failed: remove modified prefix"
        );
      }
    }
    for (let j = i; j < this.components.length; j++) {
      if (this.components[j] !== oldComponents[j + 1]) {
        this.components = oldComponents;
        MethodFailedException.assert(
          false,
          "Postcondition failed: remove did not shift elements correctly"
        );
      }
    }
  }

  protected assertConcatPostcondition(
    other: Name,
    oldComponents: string[]
  ): void {
    if (
      this.getNoComponents() !==
      oldComponents.length + other.getNoComponents()
    ) {
      this.components = oldComponents;
      MethodFailedException.assert(
        false,
        "Postcondition failed: concat produced wrong component count"
      );
    }

    for (let j = 0; j < oldComponents.length; j++) {
      if (this.components[j] !== oldComponents[j]) {
        this.components = oldComponents;
        MethodFailedException.assert(
          false,
          "Postcondition failed: concat modified original prefix"
        );
      }
    }

    for (let j = 0; j < other.getNoComponents(); j++) {
      if (this.components[oldComponents.length + j] !== other.getComponent(j)) {
        this.components = oldComponents;
        MethodFailedException.assert(
          false,
          "Postcondition failed: concat did not copy other components correctly"
        );
      }
    }
  }

  protected assertClassInvariant(): void {
    if (this.delimiter.length !== 1) {
      InvalidStateException.assert(
        false,
        "Class invariant violated: delimiter must be exactly 1 char"
      );
    }

    for (let i = 0; i < this.components.length; i++) {
      const c = this.components[i];
      if (typeof c !== "string") {
        InvalidStateException.assert(
          false,
          `Class invariant violated: component at index ${i} is not a string`
        );
      }
      if (!this.assertIsMaskedAsPrecondition(c)) {
        InvalidStateException.assert(
          false,
          `Class invariant violated: component '${c}' improperly masked`
        );
      }
    }
  }

  protected assertIsMaskedAsPrecondition(component: string): boolean {
    const d = this.delimiter;
    const e = ESCAPE_CHARACTER;

    for (let i = 0; i < component.length; i++) {
      const ch = component[i];

      if (ch === d) return false;

      if (ch === e) {
        if (i === component.length - 1) return false;

        const next = component[i + 1];
        if (next !== d && next !== e) return false;

        i++;
      }
    }
    return true;
  }
}
