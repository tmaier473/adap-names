import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

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
    if (!this.isValidIndexForComponentsArray(i)) {
      console.error(`${i} is not a valid index for the components array!`);
      return "";
    }

    const components: string[] = this.getComponents();
    return components[i];
  }
  public setComponent(i: number, c: string): void {
    if (!this.isValidIndexForComponentsArray(i)) {
      console.error(`${i} is not a valid index for the components array!`);
      return;
    }

    const components: string[] = this.getComponents();
    components[i] = c;
    this.name = components.join(this.getDelimiterCharacter());
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

    const components: string[] = this.getComponents();
    components.splice(i, 0, c);
    this.name = components.join(this.getDelimiterCharacter());
    this.noComponents++;
  }
  public append(c: string): void {
    const components: string[] = this.getComponents();
    this.noComponents = components.push(c);
    this.name = components.join(this.getDelimiterCharacter());
  }
  public remove(i: number): void {
    if (!this.isValidIndexForComponentsArray(i)) {
      console.error(`${i} is not a valid index for the components array!`);
      return;
    }

    const components: string[] = this.getComponents();
    components.splice(i, 1);
    this.name = components.join(this.getDelimiterCharacter());
    this.noComponents--;
  }

  private getComponents(): string[] {
    if (!this.name) {
      return [];
    }

    return this.name.split(this.getDelimiterCharacter());
  }
}
