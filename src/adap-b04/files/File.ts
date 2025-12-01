import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

enum FileState {
  OPEN,
  CLOSED,
  DELETED,
}

export class File extends Node {
  protected state: FileState = FileState.CLOSED;

  constructor(baseName: string, parent: Directory) {
    super(baseName, parent);
  }

  public open(): void {
    IllegalArgumentException.assert(
      this.doGetFileState() === 0 /* CLOSED */,
      "file must be CLOSED to open"
    );
    // do something
  }

  public read(noBytes: number): Int8Array {
    IllegalArgumentException.assert(
      this.doGetFileState() === 1 /* OPEN */,
      "file must be OPEN to read"
    );
    IllegalArgumentException.assert(
      Number.isInteger(noBytes),
      "read size must be integer"
    );
    IllegalArgumentException.assert(noBytes > 0, "read size must be > 0");
    // read something
    return new Int8Array();
  }

  public close(): void {
    IllegalArgumentException.assert(
      this.doGetFileState() === 1 /* OPEN */,
      "file must be OPEN to close"
    );
    // do something
  }

  protected doGetFileState(): FileState {
    return this.state;
  }
}
