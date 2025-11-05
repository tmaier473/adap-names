import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {
  protected delimiter: string = DEFAULT_DELIMITER;
  protected name: string = "";
  protected noComponents: number = 0;

  constructor(source: string, delimiter?: string) {
    this.initialize(source, delimiter);
  }

  private initialize(source: string, delimiter?: string): void {
    if (delimiter && delimiter.length < 2) {
      this.setDelimiter(delimiter);
    }

    this.setName(source);
    const components: string[] = this.getComponents();
    this.setNoComponents(components.length)
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

  private getName(): string {
    return this.doGetName();
  }

  private doGetName(): string {
    return this.name;
  }

  private setName(name: string): void {
    this.doSetName(name);
  }

  private doSetName(name: string): void {
    this.name = name;
  }

  public getNoComponents(): number {
    return this.doGetNoComponents();
  }

  private doGetNoComponents(): number {
    return this.noComponents;
  }

  public setNoComponents(no: number): void {
    this.doSetNoComponents(no);
  }

  private doSetNoComponents(no: number): void {
    this.noComponents = no;
  }

  private getComponents(): string[] {
    const name: string = this.getName();
    return name.split(this.getDelimiterCharacter());
  }

  public asString(delimiter: string = this.delimiter): string {
    const components: string[] = this.getComponents();
    const componentsSeperatedByDelimiter: string =
      components.join(delimiter);

    return componentsSeperatedByDelimiter;
  }

  public asDataString(): string {
    const components: string[] = this.getComponents();
    const maskedComponents: string[] = components.map((component) =>
      this.asMaskedComponent(component)
    );
    const maskedComponentsSeperatedByDelimiter: string =
      maskedComponents.join(this.getDelimiterCharacter());

    return maskedComponentsSeperatedByDelimiter;
  }

  /** Escapes all delimiters after escaping the escape character */
  private asMaskedComponent(c: string): string {
    let maskedComponent: string = c.replaceAll(
      ESCAPE_CHARACTER,
      `${ESCAPE_CHARACTER}${ESCAPE_CHARACTER}`
    );

    maskedComponent = maskedComponent.replaceAll(
      this.getDelimiterCharacter(),
      `${ESCAPE_CHARACTER}${this.getDelimiterCharacter()}`
    );

    return maskedComponent;
  }

  public isEmpty(): boolean {
    return this.getNoComponents() === 0;
  }

  public getComponent(x: number): string {
    if (!this.isValidIndexForComponentsArray(x)) {
      console.error(`${x} is not a valid index for the components array!`);
      return "";
    }

    const components: string[] = this.getComponents();
    return components[x];
  }

  public setComponent(n: number, c: string): void {
    if (!this.isValidIndexForComponentsArray(n)) {
      console.error(`${n} is not a valid index for the components array!`);
      return;
    }

    const components: string[] = this.getComponents();
    components[n] = c;
    this.setName(components.join(this.getDelimiterCharacter()));
  }

  public insert(n: number, c: string): void {
    const components: string[] = this.getComponents();
    const isValidInsertIndex: boolean =
      Number.isInteger(n) && n >= 0 && n <= components.length;
    if (!isValidInsertIndex) {
      console.error(
        `${n} is not a valid *insertion* index for the components array!`
      );
      return;
    }

    components.splice(n, 0, c);
    this.setName(components.join(this.getDelimiterCharacter()));
    this.setNoComponents(components.length);
  }

  public append(c: string): void {
    const components: string[] = this.getComponents();
    this.setNoComponents(components.push(c));
    this.setName(components.join(this.getDelimiterCharacter()));
  }

  public remove(n: number): void {
    if (!this.isValidIndexForComponentsArray(n)) {
      console.error(`${n} is not a valid index for the components array!`);
      return;
    }

    const components: string[] = this.getComponents();
    components.splice(n, 1);
    this.setName(components.join(this.delimiter));
    this.setNoComponents(components.length);
  }

  public concat(other: Name): void {
    const delimiter: string = this.getDelimiterCharacter();
    this.setName(this.asString() + delimiter + other.asString());

    const components: string[] = this.getComponents();
    this.setNoComponents(components.length);
  }

  private isValidIndexForComponentsArray(i: number): boolean {
    const components: string[] = this.getComponents();
    const isInteger: boolean = Number.isInteger(i);
    const isInBounds: boolean = i >= 0 && i < components.length;

    return isInteger && isInBounds;
  }
}
