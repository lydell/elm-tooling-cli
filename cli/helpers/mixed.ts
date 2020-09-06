import * as fs from "fs";
import * as path from "path";

export type NonEmptyArray<T> = [T, ...T[]];

export type ElmTooling = {
  entrypoints?: NonEmptyArray<string>;
  tools?: {
    [name: string]: string;
  };
};

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function findClosest(
  name: string,
  dir: string = process.cwd()
): string | undefined {
  const file = path.join(dir, name);
  return fs.existsSync(file)
    ? file
    : dir === path.parse(dir).root
    ? undefined
    : findClosest(name, path.dirname(dir));
}

export type Either<Left, Right> =
  | { tag: "Left"; value: Left }
  | { tag: "Right"; value: Right };

export function partitionMap<T, Left, Right>(
  items: Array<T>,
  f: (item: T, index: number) => Either<Left, Right>
): [Array<Left>, Array<Right>] {
  const left: Array<Left> = [];
  const right: Array<Right> = [];

  for (const [index, item] of items.entries()) {
    const either = f(item, index);
    switch (either.tag) {
      case "Left":
        left.push(either.value);
        break;
      case "Right":
        right.push(either.value);
        break;
    }
  }

  return [left, right];
}

const NO_COLOR = "NO_COLOR" in process.env;
const RESET_COLOR = "\x1B[0m";

export function bold(string: string): string {
  return NO_COLOR ? string : `${RESET_COLOR}\x1B[1m${string}${RESET_COLOR}`;
}

export function dim(string: string): string {
  return NO_COLOR ? string : `${RESET_COLOR}\x1B[2m${string}${RESET_COLOR}`;
}

export function indent(string: string): string {
  return string.replace(/^/gm, "    ");
}

export const elmToolingJsonDocumentationLink = `${dim(
  "Documentation:"
)}\n    https://github.com/lydell/elm-tooling.json`;

export function printNumErrors(numErrors: number): string {
  return `${bold(numErrors.toString())} error${numErrors === 1 ? "" : "s"}`;
}