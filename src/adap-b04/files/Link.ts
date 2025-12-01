import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class Link extends Node {
  protected targetNode: Node | null = null;

  constructor(bn: string, pn: Directory, tn?: Node) {
    super(bn, pn);

    if (tn != undefined) {
      this.targetNode = tn;
    }
  }

  public getTargetNode(): Node | null {
    return this.targetNode;
  }

  public setTargetNode(target: Node): void {
    IllegalArgumentException.assert(
      target !== null,
      "target node must not be null"
    );
    this.targetNode = target;
  }

  public getBaseName(): string {
    IllegalArgumentException.assert(
      this.getTargetNode() !== null,
      "link must point to valid target"
    );
    const target = this.ensureTargetNode(this.targetNode);
    return target.getBaseName();
  }

  public rename(bn: string): void {
    IllegalArgumentException.assert(
      this.getTargetNode() !== null,
      "link must point to valid target"
    );
    IllegalArgumentException.assert(bn !== "", "basename cannot be empty");
    const target = this.ensureTargetNode(this.targetNode);
    target.rename(bn);
  }

  protected ensureTargetNode(target: Node | null): Node {
    IllegalArgumentException.assert(
      target !== null,
      "link target must not be null"
    );
    const result: Node = this.targetNode as Node;
    return result;
  }
}
