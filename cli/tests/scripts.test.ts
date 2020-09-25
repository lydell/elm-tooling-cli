/* eslint-disable jest/expect-expect */

import { run as runAllDownloads } from "../scripts/test-all-downloads";
import { run as runIntegration } from "../scripts/test-integration";

jest.setTimeout(20000);

function wrap(f: () => Promise<unknown>): () => Promise<void> {
  return async () => {
    await f();
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  };
}

const ENV_NAME = "SCRIPTS_COVERAGE";

if (ENV_NAME in process.env) {
  test("test-all-downloads.ts", wrap(runAllDownloads));
  test("test-integration.ts", wrap(runIntegration));
} else {
  test(`scripts.test.ts is a no-op unless the env var ${ENV_NAME} is set`, () => {
    // Do nothing
  });
}
