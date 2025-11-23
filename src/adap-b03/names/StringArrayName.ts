import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

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
    if (!this.isValidIndexForComponentsArray(i)) {
      console.error(`${i} is not a valid index for the components array!`);
      return "";
    }

    return this.components[i];
  }

  public setComponent(i: number, c: string): void {
    if (!this.isValidIndexForComponentsArray(i)) {
      console.error(`${i} is not a valid index for the components array!`);
      return;
    }

    this.components[i] = c;
  }

  public insert(i: number, c: string): void {
    const isValidInsertIndex: boolean =
      Number.isInteger(i) && i >= 0 && i <= this.getNoComponents();
    if (!isValidInsertIndex) {
      console.error(
        `${i} is not a valid *insertion* index for the components array!`
      );
      return;
    }
    this.components.splice(i, 0, c);
  }

  public append(c: string): void {
    this.components.push(c);
  }

  public remove(i: number): void {
    if (!this.isValidIndexForComponentsArray(i)) {
      console.error(`${i} is not a valid index for the components array!`);
      return;
    }

    this.components.splice(i, 1);
  }
}
