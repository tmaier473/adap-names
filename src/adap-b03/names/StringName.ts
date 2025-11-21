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

  public getNoComponents(): number {
    return this.noComponents;
  }
  public getComponent(i: number): string {
    const components: string[] = this.getComponents();
    return components[i];
  }
  public setComponent(i: number, c: string): void {
    const components: string[] = this.getComponents();
    components[i] = c;
    this.name = components.join(super.getDelimiterCharacter());
  }
  public insert(i: number, c: string): void {
    const components: string[] = this.getComponents();
    components.splice(i, 0, c);
    this.name = components.join(super.getDelimiterCharacter());
    this.noComponents++;
  }
  public append(c: string): void {
    const components: string[] = this.getComponents();
    this.noComponents = components.push(c);
    this.name = components.join(super.getDelimiterCharacter());
  }
  public remove(i: number): void {
    const components: string[] = this.getComponents();
    components.splice(i, 1);
    this.name = components.join(super.getDelimiterCharacter());
    this.noComponents--;
  }

  private getComponents(): string[] {
    return this.name.split(super.getDelimiterCharacter());
  }
}
