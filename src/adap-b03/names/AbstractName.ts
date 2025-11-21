import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {
  protected delimiter: string = DEFAULT_DELIMITER;

  constructor(delimiter: string = DEFAULT_DELIMITER) {
    if (delimiter.length !== 1) {
      console.error("Delimiter must be exactly one character");
    }
    this.delimiter = delimiter;
  }

  public clone(): Name {
    const components: string[] = [];
    for (let i = 0; i < this.getNoComponents(); i++) {
      components.push(this.getComponent(i));
    }
    // Array-Version in StringArrayName, String-Version in StringName
    return new (this.constructor as any)(components, this.delimiter);
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

  public isEqual(other: Name): boolean {
    if (!(other instanceof AbstractName)) return false;
    if (other.getNoComponents() !== this.getNoComponents()) return false;
    if (other.getDelimiterCharacter() !== this.delimiter) return false;

    for (let i = 0; i < this.getNoComponents(); i++) {
      if (this.getComponent(i) !== other.getComponent(i)) return false;
    }
    return true;
  }

  public getHashCode(): number {
    let hash = 17;
    for (let i = 0; i < this.getNoComponents(); i++) {
      const comp = this.getComponent(i);
      for (let c of comp) {
        hash = hash * 31 + c.charCodeAt(0);
      }
    }
    return hash;
  }

  public isEmpty(): boolean {
    return this.getNoComponents() === 0;
  }

  public getDelimiterCharacter(): string {
    return this.delimiter;
  }

  public concat(other: Name): void {
    for (let i = 0; i < other.getNoComponents(); i++) {
      this.append(other.getComponent(i));
    }
  }

  abstract getNoComponents(): number;

  abstract getComponent(i: number): string;
  abstract setComponent(i: number, c: string): void;

  abstract insert(i: number, c: string): void;
  abstract append(c: string): void;
  abstract remove(i: number): void;
}
