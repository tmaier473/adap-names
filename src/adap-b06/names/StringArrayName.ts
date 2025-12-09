import { ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {
  private readonly components: string[];

  constructor(source: string[], delimiter?: string) {
    super(delimiter);
    this.components = [...source];
  }

  protected createFromComponents(components: string[]): Name {
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

  public setComponent(i: number, c: string): Name {
    this.assertValidIndexAsPrecondition(i);
    this.assertIsMaskedAsPrecondition(c);

    const newComponents = [...this.components];
    newComponents[i] = c;

    return this.createFromComponents(newComponents);
  }

  public insert(i: number, c: string): Name {
    this.assertValidInsertIndexAsPrecondition(i);
    this.assertIsMaskedAsPrecondition(c);

    const newComponents = [...this.components];
    newComponents.splice(i, 0, c);

    return this.createFromComponents(newComponents);
  }

  public append(c: string): Name {
    this.assertIsMaskedAsPrecondition(c);

    const newComponents = [...this.components];
    newComponents.push(c);

    return this.createFromComponents(newComponents);
  }

  public remove(i: number): Name {
    this.assertValidIndexAsPrecondition(i);

    const newComponents = [...this.components];
    newComponents.splice(i, 1);

    return this.createFromComponents(newComponents);
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
