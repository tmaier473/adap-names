import { Equality } from "../common/Equality";
import { Printable } from "../common/Printable";

/**
 * A name is an immutable value type representing a sequence of string components
 * separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 *
 * As a value type, all operations return new Name instances rather than modifying in place.
 *
 * Homogenous name examples
 *
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export interface Name extends Printable, Equality {
  /**
   * Returns true, if number of components == 0; else false
   */
  isEmpty(): boolean;

  /**
   * Returns number of components in Name instance
   */
  getNoComponents(): number;

  getComponent(i: number): string;

  /**
   * Returns a new Name with the component at index i replaced with c.
   * Expects that new Name component c is properly masked
   */
  setComponent(i: number, c: string): Name;

  /**
   * Returns a new Name with component c inserted at index i.
   * Expects that new Name component c is properly masked
   */
  insert(i: number, c: string): Name;

  /**
   * Returns a new Name with component c appended.
   * Expects that new Name component c is properly masked
   */
  append(c: string): Name;

  /**
   * Returns a new Name with the component at index i removed
   */
  remove(i: number): Name;

  /**
   * Returns a new Name that is the concatenation of this Name with other
   */
  concat(other: Name): Name;
}
