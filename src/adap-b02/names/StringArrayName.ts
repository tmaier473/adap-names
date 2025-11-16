import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {
  protected delimiter: string = DEFAULT_DELIMITER;
  protected components: string[] = [];

  constructor(source: string[], delimiter?: string) {
    this.initialize(source, delimiter);
  }

  private initialize(source: string[], delimiter?: string): void {
    if (delimiter && delimiter.length < 2) {
      this.setDelimiter(delimiter);
    }

    this.setComponents(source);
  }

  public getDelimiterCharacter(): string {
    return this.doGetDelimiterCharacter();
  }

  private doGetDelimiterCharacter(): string {
    return this.delimiter;
  }

  private setDelimiter(delimiter: string): void {
    this.doSetDelimiter(delimiter);
  }

  private doSetDelimiter(delimiter: string): void {
    this.delimiter = delimiter;
  }

  private getComponents(): string[] {
    return this.doGetComponents();
  }

  private doGetComponents(): string[] {
    return this.components;
  }

  private setComponents(components: string[]): void {
    this.doSetComponents(components);
  }

  private doSetComponents(components: string[]): void {
    this.components = components;
  }

  public asString(delimiter: string = this.delimiter): string {
    const components: string[] = this.getComponents();
    const componentsSeperatedByDelimiter: string = components.join(delimiter);

    return componentsSeperatedByDelimiter;
  }

  public asDataString(): string {
    const components: string[] = this.getComponents();
    const maskedComponents: string[] = components.map((component) =>
      this.asMaskedComponent(component)
    );
    const maskedComponentsSeperatedByDelimiter: string =
      maskedComponents.join(DEFAULT_DELIMITER);

    return maskedComponentsSeperatedByDelimiter;
  }

  /** Escapes all delimiters after escaping the escape character */
  private asMaskedComponent(c: string): string {
    let maskedComponent: string = c.replaceAll(
      ESCAPE_CHARACTER,
      `${ESCAPE_CHARACTER}${ESCAPE_CHARACTER}`
    );

    maskedComponent = maskedComponent.replaceAll(
      DEFAULT_DELIMITER,
      `${ESCAPE_CHARACTER}${DEFAULT_DELIMITER}`
    );

    return maskedComponent;
  }

  public isEmpty(): boolean {
    const components = this.getComponents();
    return (
      components.length === 0 ||
      (components.length === 1 && components[0] === "")
    );
  }

  public getNoComponents(): number {
    const components: string[] = this.getComponents();
    return components.length;
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
    this.setComponents(components);
  }

  public insert(i: number, c: string): void {
    const components: string[] = this.getComponents();
    const isValidInsertIndex: boolean =
      Number.isInteger(i) && i >= 0 && i <= components.length;
    if (!isValidInsertIndex) {
      console.error(
        `${i} is not a valid *insertion* index for the components array!`
      );
      return;
    }

    components.splice(i, 0, c);
    this.setComponents(components);
  }

  public append(c: string): void {
    const components: string[] = this.getComponents();
    components.push(c);
    this.setComponents(components);
  }

  public remove(i: number): void {
    if (!this.isValidIndexForComponentsArray(i)) {
      console.error(`${i} is not a valid index for the components array!`);
      return;
    }

    const components: string[] = this.getComponents();
    components.splice(i, 1);
    this.setComponents(components);
  }

  public concat(other: Name): void {
    const delimiter: string = this.getDelimiterCharacter();
    const concatAsString = this.asString() + delimiter + other.asString();
    this.setComponents(concatAsString.split(delimiter));
  }

  private isValidIndexForComponentsArray(i: number): boolean {
    const components: string[] = this.getComponents();
    const isInteger: boolean = Number.isInteger(i);
    const isInBounds: boolean = i >= 0 && i < components.length;

    return isInteger && isInBounds;
  }
}
