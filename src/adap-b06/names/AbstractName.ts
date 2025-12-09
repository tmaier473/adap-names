import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {
  protected readonly delimiter: string;

  constructor(delimiter: string = DEFAULT_DELIMITER) {
    if (delimiter.length !== 1) {
      console.error("Delimiter must be exactly one character");
    }
    this.delimiter = delimiter;
  }

  public asString(delimiter: string = this.delimiter): string {
    const components: string[] = [];
    for (let i = 0; i < this.getNoComponents(); i++) {
      components.push(this.unescape(this.getComponent(i)));
    }
    return components.join(delimiter);
  }

  public asDataString(): string {
    const components: string[] = [];
    for (let i = 0; i < this.getNoComponents(); i++) {
      components.push(this.escape(this.getComponent(i)));
    }
    return components.join(this.delimiter);
  }

  protected escape(component: string): string {
    return component
      .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
      .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter);
  }

  protected unescape(component: string): string {
    return component
      .replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter)
      .replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER);
  }

  public toString(): string {
    return this.asDataString();
  }

  public isEqual(other: Object): boolean {
    if (!(other instanceof AbstractName)) return false;
    if (other.getNoComponents() !== this.getNoComponents()) return false;
    if (other.getDelimiterCharacter() !== this.delimiter) return false;

    for (let i = 0; i < this.getNoComponents(); i++) {
      if (this.getComponent(i) !== other.getComponent(i)) return false;
    }
    return true;
  }

  public getHashCode(): number {
    let hash = 0;
    for (let i = 0; i < this.getNoComponents(); i++) {
      const component = this.getComponent(i);
      for (let j = 0; j < component.length; j++) {
        hash = hash * 31 + component.charCodeAt(j);
      }
    }
    for (let j = 0; j < this.delimiter.length; j++) {
      hash = hash * 31 + this.delimiter.charCodeAt(j);
    }
    return hash;
  }

  public isEmpty(): boolean {
    return this.getNoComponents() === 0;
  }

  public getDelimiterCharacter(): string {
    return this.delimiter;
  }

  public concat(other: Name): Name {
    const components: string[] = [];
    for (let i = 0; i < this.getNoComponents(); i++) {
      components.push(this.getComponent(i));
    }
    for (let i = 0; i < other.getNoComponents(); i++) {
      components.push(other.getComponent(i));
    }
    return this.createFromComponents(components);
  }

  abstract getNoComponents(): number;

  abstract getComponent(i: number): string;
  abstract setComponent(i: number, c: string): Name;

  abstract insert(i: number, c: string): Name;
  abstract append(c: string): Name;
  abstract remove(i: number): Name;

  /**
   * Creates a new instance of the same type with the given components
   */
  protected abstract createFromComponents(components: string[]): Name;
}
