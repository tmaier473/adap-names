import { ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringName extends AbstractName {
  private readonly name: string;
  private readonly noComponents: number;

  constructor(source: string, delimiter?: string) {
    super(delimiter);
    this.name = source;
    this.noComponents = this.getComponentsFromString(this.name).length;
  }

  protected createFromComponents(components: string[]): Name {
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

    const components: string[] = this.getComponentsFromString(this.name);
    return components[i];
  }

  public setComponent(i: number, c: string): Name {
    this.assertValidIndexAsPrecondition(i);
    this.assertIsMaskedAsPrecondition(c);

    const newComponents = [...this.getComponentsFromString(this.name)];
    newComponents[i] = c;

    return this.createFromComponents(newComponents);
  }
  public insert(i: number, c: string): Name {
    this.assertValidInsertIndexAsPrecondition(i);
    this.assertIsMaskedAsPrecondition(c);

    const newComponents = [...this.getComponentsFromString(this.name)];
    newComponents.splice(i, 0, c);

    return this.createFromComponents(newComponents);
  }
  public append(c: string): Name {
    this.assertIsMaskedAsPrecondition(c);

    const newComponents = [...this.getComponentsFromString(this.name)];
    newComponents.push(c);

    return this.createFromComponents(newComponents);
  }
  public remove(i: number): Name {
    this.assertValidIndexAsPrecondition(i);

    const newComponents = [...this.getComponentsFromString(this.name)];
    newComponents.splice(i, 1);

    return this.createFromComponents(newComponents);
  }

  private getComponentsFromString(componentString: string): string[] {
    if (!componentString) {
      return [];
    }

    return componentString.split(this.getDelimiterCharacter());
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
