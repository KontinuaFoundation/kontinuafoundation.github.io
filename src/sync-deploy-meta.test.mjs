import { afterEach, describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import {
  findLastFullDeploy,
  findLastWorkbookUpdate,
  parseTimestamp,
} from "./sync-deploy-meta.mjs";

let repoDir;

afterEach(async () => {
  if (repoDir) await rm(repoDir, { recursive: true, force: true });
  repoDir = undefined;
});

function git(args) {
  return execFileSync("git", args, { cwd: repoDir, encoding: "utf8" });
}

function commit(message) {
  git(["commit", "--allow-empty", "-q", "-m", message]);
}

async function commitFiles(paths, message) {
  for (const path of paths) {
    const fullPath = join(repoDir, path);
    await mkdir(dirname(fullPath), { recursive: true });
    // Content must differ each call so every commit actually changes the file.
    await writeFile(fullPath, `${message}\n`);
  }
  git(["add", ...paths]);
  commit(message);
}

async function makeRepo() {
  repoDir = await mkdtemp(join(tmpdir(), "deploy-meta-test-"));
  git(["init", "-q"]);
  git(["config", "user.email", "test@example.com"]);
  git(["config", "user.name", "Test"]);
}

describe("findLastFullDeploy", () => {
  test("picks the last full deploy and ignores later incremental syncs", async () => {
    await makeRepo();
    commit("chore: init");
    commit("Deploy site: 2026-07-06 04:36:29Z");
    commit("chore: sync graph data");
    commit("Deploy changed site files: 2026-07-08 02:47:02Z");
    commit("chore: sync graph data");
    commit("Deploy changed site files: 2026-07-09 21:30:34Z");

    const result = findLastFullDeploy(repoDir);

    expect(result).not.toBeNull();
    expect(result.timestamp).toBe("2026-07-06T04:36:29.000Z");
  });

  test("does not mistake 'Deploy changed site files:' for a full deploy", async () => {
    await makeRepo();
    commit("chore: init");
    commit("Deploy changed site files: 2026-07-09 21:30:34Z");
    commit("chore: sync graph data");

    expect(findLastFullDeploy(repoDir)).toBeNull();
  });

  test("returns the most recent of several full deploys", async () => {
    await makeRepo();
    commit("Deploy site: 2026-06-17 10:45:09Z");
    commit("chore: sync graph data");
    commit("Deploy site: 2026-06-28 07:47:03Z");
    commit("Deploy changed site files: 2026-07-01 22:06:39Z");

    const result = findLastFullDeploy(repoDir);

    expect(result.timestamp).toBe("2026-06-28T07:47:03.000Z");
  });

  test("falls back to the commit's committer date when the message timestamp doesn't parse", async () => {
    await makeRepo();
    commit("Deploy site: not-a-real-timestamp");
    const committerDate = git(["log", "-1", "--format=%cI"]).trim();

    const result = findLastFullDeploy(repoDir);

    expect(result.timestamp).toBe(committerDate);
  });

  test("returns null for a repo with no deploy commits at all", async () => {
    await makeRepo();
    commit("chore: init");

    expect(findLastFullDeploy(repoDir)).toBeNull();
  });
});

describe("findLastWorkbookUpdate", () => {
  test("a full deploy sets every workbook's last-updated time", async () => {
    await makeRepo();
    await commitFiles(
      ["public/workbook-01.pdf", "public/intro.pdf", "public/workbook-02.pdf", "public/other.pdf"],
      "Deploy site: 2026-06-28 07:47:03Z",
    );

    const wb01 = findLastWorkbookUpdate(repoDir, ["public/workbook-01.pdf", "public/intro.pdf"]);
    const wb02 = findLastWorkbookUpdate(repoDir, ["public/workbook-02.pdf", "public/other.pdf"]);

    expect(wb01.timestamp).toBe("2026-06-28T07:47:03.000Z");
    expect(wb02.timestamp).toBe("2026-06-28T07:47:03.000Z");
  });

  test("a later incremental sync only advances the workbook it actually touched", async () => {
    await makeRepo();
    await commitFiles(
      ["public/workbook-01.pdf", "public/intro.pdf", "public/workbook-02.pdf", "public/other.pdf"],
      "Deploy site: 2026-06-28 07:47:03Z",
    );
    await commitFiles(
      ["public/workbook-02.pdf"],
      "Deploy changed site files: 2026-07-09 21:30:34Z",
    );

    const wb01 = findLastWorkbookUpdate(repoDir, ["public/workbook-01.pdf", "public/intro.pdf"]);
    const wb02 = findLastWorkbookUpdate(repoDir, ["public/workbook-02.pdf", "public/other.pdf"]);

    expect(wb01.timestamp).toBe("2026-06-28T07:47:03.000Z");
    expect(wb02.timestamp).toBe("2026-07-09T21:30:34.000Z");
  });

  test("ignores commits that only touch unrelated global files like graph.json", async () => {
    await makeRepo();
    await commitFiles(["public/workbook-01.pdf"], "Deploy site: 2026-06-28 07:47:03Z");
    await commitFiles(["public/graph.json"], "Deploy changed site files: 2026-07-09 21:30:34Z");

    const wb01 = findLastWorkbookUpdate(repoDir, ["public/workbook-01.pdf"]);

    expect(wb01.timestamp).toBe("2026-06-28T07:47:03.000Z");
  });

  test("returns null when none of the given files were ever committed", async () => {
    await makeRepo();
    commit("chore: init");

    expect(findLastWorkbookUpdate(repoDir, ["public/workbook-99.pdf"])).toBeNull();
  });
});

describe("parseTimestamp", () => {
  test("parses the 'YYYY-MM-DD HH:MM:SSZ' shape used by deploy commit messages", () => {
    expect(parseTimestamp("2026-07-06 04:36:29Z")).toBe("2026-07-06T04:36:29.000Z");
  });

  test("returns null for text that isn't a valid date", () => {
    expect(parseTimestamp("not-a-date")).toBeNull();
  });
});
