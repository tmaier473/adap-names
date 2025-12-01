import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { Node } from "./Node";

export class Directory extends Node {
  protected childNodes: Set<Node> = new Set<Node>();

  constructor(bn: string, pn: Directory) {
    super(bn, pn);
  }

  public hasChildNode(cn: Node): boolean {
    IllegalArgumentException.assert(cn !== null, "child node must not be null");
    return this.childNodes.has(cn);
  }

  public addChildNode(cn: Node): void {
    IllegalArgumentException.assert(cn !== null, "child node must not be null");
    IllegalArgumentException.assert(
      !this.hasChildNode(cn),
      "child already exists"
    );
    IllegalArgumentException.assert(
      cn !== this,
      "directory cannot contain itself"
    );
    this.childNodes.add(cn);
  }

  public removeChildNode(cn: Node): void {
    IllegalArgumentException.assert(cn !== null, "child node must not be null");
    IllegalArgumentException.assert(
      this.hasChildNode(cn),
      "cannot remove non-existing child"
    );
    this.childNodes.delete(cn); // Yikes! Should have been called remove
  }
}
