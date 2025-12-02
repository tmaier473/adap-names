import { describe, it, expect } from "vitest";

import { Exception } from "../../../src/adap-b05/common/Exception";
import { InvalidStateException } from "../../../src/adap-b05/common/InvalidStateException";
import { ServiceFailureException } from "../../../src/adap-b05/common/ServiceFailureException";

import { StringName } from "../../../src/adap-b05/names/StringName";

import { Node } from "../../../src/adap-b05/files/Node";
import { File } from "../../../src/adap-b05/files/File";
import { BuggyFile } from "../../../src/adap-b05/files/BuggyFile";
import { Directory } from "../../../src/adap-b05/files/Directory";
import { RootNode } from "../../../src/adap-b05/files/RootNode";

function createFileSystem(): RootNode {
  let rn: RootNode = new RootNode();

  let usr: Directory = new Directory("usr", rn);
  let bin: Directory = new Directory("bin", usr);
  let ls: File = new File("ls", bin);
  let code: File = new File("code", bin);

  let media: Directory = new Directory("media", rn);

  let home: Directory = new Directory("home", rn);
  let riehle: Directory = new Directory("riehle", home);
  let bashrc: File = new File(".bashrc", riehle);
  let wallpaper: File = new File("wallpaper.jpg", riehle);
  let projects: Directory = new Directory("projects", riehle);

  return rn;
}

describe("Basic naming test", () => {
  it("test name checking", () => {
    let fs: RootNode = createFileSystem();
    let ls: Node = [...fs.findNodes("ls")][0];
    // RootNode starts with "", so path is "usr/bin/ls" not "/usr/bin/ls"
    expect(ls.getFullName().asString()).toBe(
      new StringName("usr/bin/ls", "/").asString()
    );
  });

  it("test finding multiple files with same name", () => {
    let fs: RootNode = createFileSystem();
    let results: Set<Node> = fs.findNodes("File");
    // Should find no files with name "File"
    expect(results.size).toBe(0);
  });

  it("test finding directory", () => {
    let fs: RootNode = createFileSystem();
    let results: Set<Node> = fs.findNodes("usr");
    expect(results.size).toBe(1);
    expect([...results][0]).toBeInstanceOf(Directory);
  });

  it("test finding non-existent file", () => {
    let fs: RootNode = createFileSystem();
    let results: Set<Node> = fs.findNodes("nonexistent.txt");
    expect(results.size).toBe(0);
  });
});

function createBuggySetup(): RootNode {
  let rn: RootNode = new RootNode();

  let usr: Directory = new Directory("usr", rn);
  let bin: Directory = new Directory("bin", usr);
  let ls: File = new BuggyFile("ls", bin);
  let code: File = new BuggyFile("code", bin);

  let media: Directory = new Directory("media", rn);

  let home: Directory = new Directory("home", rn);
  let riehle: Directory = new Directory("riehle", home);
  let bashrc: File = new BuggyFile(".bashrc", riehle);
  let wallpaper: File = new BuggyFile("wallpaper.jpg", riehle);
  let projects: Directory = new Directory("projects", riehle);

  return rn;
}

describe("Buggy setup test", () => {
  it("test finding files", () => {
    let threwException: boolean = false;
    try {
      let fs: RootNode = createBuggySetup();
      fs.findNodes("ls");
    } catch (er) {
      threwException = true;
      let ex: Exception = er as Exception;
      expect(ex).toBeInstanceOf(ServiceFailureException);
      expect(ex.hasTrigger()).toBe(true);
      let tx: Exception = ex.getTrigger();
      expect(tx).toBeInstanceOf(InvalidStateException);
    }
    expect(threwException).toBe(true);
  });

  it("test buggy file throws exception on getBaseName()", () => {
    let rn: RootNode = new RootNode();
    let bin: Directory = new Directory("bin", rn);
    let buggyFile: File = new BuggyFile("test", bin);

    expect(() => {
      buggyFile.getBaseName();
    }).toThrow(ServiceFailureException);
  });

  it("test normal file does not throw exception", () => {
    let rn: RootNode = new RootNode();
    let bin: Directory = new Directory("bin", rn);
    let normalFile: File = new File("test", bin);

    expect(() => {
      normalFile.getBaseName();
    }).not.toThrow();
    expect(normalFile.getBaseName()).toBe("test");
  });
});
