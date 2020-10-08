import * as os from "os";
import * as path from "path";
import * as stream from "stream";

import type { ReadStream, WriteStream } from "../helpers/mixed";

export const IS_WINDOWS = os.platform() === "win32";

export class FailReadStream extends stream.Readable implements ReadStream {
  isTTY = true;

  _read(size: number): void {
    throw new Error(
      `Expected FailReadStream not to be read but tried to read ${size} bytes.`
    );
  }

  setRawMode(): void {
    // Do nothing
  }
}

export class RawReadStream extends stream.Readable implements ReadStream {
  isRaw = false;

  isTTY = true;

  private index = 0;

  constructor(private chars: Array<string>) {
    super();
  }

  _read(size: number): void {
    if (!this.isRaw) {
      throw new Error(
        `Expected \`.setRawMode(true)\` to be called before reading, but tried to read ${size} bytes with \`.isRaw = false\`.`
      );
    }
    this.push(this.chars[this.index]);
    this.index++;
  }

  setRawMode(isRaw: boolean): void {
    this.isRaw = isRaw;
  }
}

export class MemoryWriteStream extends stream.Writable implements WriteStream {
  isTTY = true;

  content = "";

  _write(
    chunk: string | Buffer,
    _encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ): void {
    this.content += chunk.toString();
    callback();
  }
}

const cursorMove = /^\x1b\[(\d+)([ABCD])$/;
const split = /(\n|\x1b\[\d+[ABCD])/;

function parseCursorMove(
  num: number,
  char: string
): { dx: number; dy: number } {
  switch (char) {
    case "A":
      return { dx: 0, dy: -num };
    case "B":
      return { dx: 0, dy: num };
    case "C":
      return { dx: num, dy: 0 };
    case "D":
      return { dx: -num, dy: 0 };
    default:
      throw new Error(`Unknown cursor move char: ${char}`);
  }
}

export class CursorWriteStream extends stream.Writable implements WriteStream {
  isTTY = true;

  lines: Array<string> = [];

  cursor = { x: 0, y: 0 };

  _write(
    chunk: string | Buffer,
    _encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ): void {
    const parts = chunk.toString().split(split);
    for (const part of parts) {
      if (part === "\n") {
        this.cursor = { x: 0, y: this.cursor.y + 1 };
      } else {
        const match = cursorMove.exec(part);
        if (match !== null) {
          const { dx, dy } = parseCursorMove(Number(match[1]), match[2]);
          const cursor = { x: this.cursor.x + dx, y: this.cursor.y + dy };
          if (cursor.x < 0 || cursor.y < 0) {
            callback(
              new Error(
                `Cursor out of bounds: ${JSON.stringify(
                  this.cursor
                )} + ${JSON.stringify({ dx, dy })} = ${JSON.stringify(cursor)}`
              )
            );
          } else {
            this.cursor = cursor;
          }
        } else {
          const yDiff = this.cursor.y - this.lines.length + 1;
          if (yDiff > 0) {
            this.lines.push(...Array.from({ length: yDiff }, () => ""));
          }
          const line = this.lines[this.cursor.y];
          const xDiff = this.cursor.x - line.length;
          const paddedLine = xDiff > 0 ? line + " ".repeat(xDiff) : line;
          const nextLine =
            paddedLine.slice(0, this.cursor.x) +
            part +
            paddedLine.slice(this.cursor.x + part.length);
          this.lines[this.cursor.y] = nextLine;
          this.cursor = { x: this.cursor.x + part.length, y: this.cursor.y };
        }
      }
    }
    callback();
  }
}

export function clean(string: string): string {
  const { root } = path.parse(__dirname);

  // Replace start of absolute paths with hardcoded stuff so the tests pass on
  // more than one computer. Replace colors for snapshots.
  const cleaned = string
    .split(__dirname)
    .join(path.join(root, "Users", "you", "project"))
    .replace(/(?:\x1B\[0?m)?\x1B\[(?!0)\d+m/g, "⧙")
    .replace(/\x1B\[0?m/g, "⧘");

  // Convert Windows-style paths to Unix-style paths so we can use the same snapshots.
  return IS_WINDOWS
    ? cleaned
        .replace(/[A-Z]:((?:\\[\w.-]+)+\\?)/g, (_, fullPath: string) =>
          fullPath.replace(/\\/g, "/")
        )
        .replace(/\.exe\b/g, "")
    : cleaned;
}

// Make snapshots easier to read.
// Before: `"\\"string\\""`
// After: `"string"`
export const stringSnapshotSerializer = {
  test: (value: unknown): boolean => typeof value === "string",
  print: String,
};
