import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringName extends AbstractName {
  protected name: string = "";
  protected noComponents: number = 0;

  constructor(source: string, delimiter?: string) {
    super(delimiter);
    this.name = source;
    this.noComponents = this.getComponents().length;
  }

  protected doClone(components: string[]): Name {
    const escapedComponents = components.map((c) => this.escape(c));
    const componentsWithDelimiterString = escapedComponents.join(
      this.delimiter
    );
    return new StringName(componentsWithDelimiterString, this.delimiter);
  }

  public getNoComponents(): number {
    return this.noComponents;
  }
  public getComponent(i: number): string {
    this.assertValidIndexAsPrecondition(i);

    const components: string[] = this.getComponents();
    return components[i];
  }
  public setComponent(i: number, c: string): void {
    this.assertValidIndexAsPrecondition(i);
    this.assertIsMaskedAsPrecondition(c);

    const components: string[] = this.getComponents();
    components[i] = c;
    this.name = components.join(this.getDelimiterCharacter());

    this.assertClassInvariant();

    this.assertSetComponentPostcondition(i, c, components);
  }
  public insert(i: number, c: string): void {
    this.assertValidInsertIndexAsPrecondition(i);

    const components: string[] = this.getComponents();
    components.splice(i, 0, c);
    this.name = components.join(this.getDelimiterCharacter());
    this.noComponents++;

    this.assertClassInvariant();

    this.assertInsertPostcondition(i, c, components);
  }
  public append(c: string): void {
    this.assertIsMaskedAsPrecondition(c);

    const components: string[] = this.getComponents();
    this.noComponents = components.push(c);
    this.name = components.join(this.getDelimiterCharacter());

    this.assertClassInvariant();

    this.assertAppendPostcondition(c, components);
  }
  public remove(i: number): void {
    this.assertValidIndexAsPrecondition(i);

    const components: string[] = this.getComponents();
    components.splice(i, 1);
    this.name = components.join(this.getDelimiterCharacter());
    this.noComponents--;

    this.assertClassInvariant();

    this.assertRemovePostcondition(i, components);
  }

  private getComponents(): string[] {
    if (!this.name) {
      return [];
    }

    return this.name.split(this.getDelimiterCharacter());
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
    if (this.getComponents().length !== oldComponents.length) {
      this.name = oldComponents.join(this.getDelimiterCharacter());
      MethodFailedException.assert(
        false,
        "Postcondition failed: setComponent changed component count"
      );
    }
    if (this.getComponents()[i] !== c) {
      this.name = oldComponents.join(this.getDelimiterCharacter());
      MethodFailedException.assert(
        false,
        "Postcondition failed: setComponent did not assign new value"
      );
    }
    for (let j = 0; j < oldComponents.length; j++) {
      if (j !== i && this.getComponents()[j] !== oldComponents[j]) {
        this.name = oldComponents.join(this.getDelimiterCharacter());
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
    if (this.getComponents().length !== oldComponents.length + 1) {
      this.name = oldComponents.join(this.getDelimiterCharacter());
      MethodFailedException.assert(
        false,
        "Postcondition failed: insert did not increase count"
      );
    }
    if (this.getComponents()[i] !== c) {
      this.name = oldComponents.join(this.getDelimiterCharacter());
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
    if (this.getComponents().length !== oldComponents.length + 1) {
      this.name = oldComponents.join(this.getDelimiterCharacter());
      MethodFailedException.assert(
        false,
        "Postcondition failed: append did not increase count"
      );
    }
    if (this.getComponents()[oldComponents.length] !== c) {
      this.name = oldComponents.join(this.getDelimiterCharacter());
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
    if (this.getComponents().length !== oldComponents.length - 1) {
      this.name = oldComponents.join(this.getDelimiterCharacter());
      MethodFailedException.assert(
        false,
        "Postcondition failed: remove did not decrease count"
      );
    }
    for (let j = 0; j < i; j++) {
      if (this.getComponents()[j] !== oldComponents[j]) {
        this.name = oldComponents.join(this.getDelimiterCharacter());
        MethodFailedException.assert(
          false,
          "Postcondition failed: remove modified prefix"
        );
      }
    }
    for (let j = i; j < this.getComponents().length; j++) {
      if (this.getComponents()[j] !== oldComponents[j + 1]) {
        this.name = oldComponents.join(this.getDelimiterCharacter());
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
      this.name = oldComponents.join(this.getDelimiterCharacter());
      MethodFailedException.assert(
        false,
        "Postcondition failed: concat produced wrong component count"
      );
    }

    for (let j = 0; j < oldComponents.length; j++) {
      if (this.getComponents()[j] !== oldComponents[j]) {
        this.name = oldComponents.join(this.getDelimiterCharacter());
        MethodFailedException.assert(
          false,
          "Postcondition failed: concat modified original prefix"
        );
      }
    }

    for (let j = 0; j < other.getNoComponents(); j++) {
      if (
        this.getComponents()[oldComponents.length + j] !== other.getComponent(j)
      ) {
        this.name = oldComponents.join(this.getDelimiterCharacter());
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

    for (let i = 0; i < this.getComponents().length; i++) {
      const c = this.getComponents()[i];
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
