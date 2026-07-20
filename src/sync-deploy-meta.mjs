import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const root = new URL("../", import.meta.url);
const workbooksPath = new URL("public/workbooks.json", root);
const outPath = new URL("public/deploy-meta.json", root);

// The Sequence repo's deploy script commits here with two message shapes:
//   "Deploy site: <timestamp>"               -> a full deploy (weekly)
//   "Deploy changed site files: <timestamp>" -> an incremental workbook sync
// Both embed a timestamp in the same trailing position.
const DEPLOY_SUBJECT = /^Deploy (?:site|changed site files):\s*(.+)$/;
const FIELD_SEP = "\x1f";

export function parseTimestamp(raw) {
  const date = new Date(raw.trim().replace(" ", "T"));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function runGitLog(cwd, extraArgs) {
  let output;
  try {
    output = execFileSync(
      "git",
      [
        "log",
        "--max-count=1",
        `--format=%H${FIELD_SEP}%s${FIELD_SEP}%cI`,
        ...extraArgs,
      ],
      { encoding: "utf8", cwd },
    ).trim();
  } catch (error) {
    console.warn("Unable to read git history for deploy metadata:", error.message);
    return null;
  }

  if (!output) return null;

  const [commit, subject, committerDate] = output.split(FIELD_SEP);
  const match = subject.match(DEPLOY_SUBJECT);
  const timestamp = (match && parseTimestamp(match[1])) ?? committerDate;

  return { commit, timestamp };
}

// The single most recent full deploy across the whole site.
export function findLastFullDeploy(cwd = new URL(".", root)) {
  return runGitLog(cwd, ["--extended-regexp", "--grep=^Deploy site:"]);
}

// The most recent commit (full deploy or incremental sync) that actually
// touched this workbook's own files, ignoring unrelated churn elsewhere
// (other workbooks' PDFs, graph.json's position noise, Links.json, etc.)
export function findLastWorkbookUpdate(cwd, files) {
  return runGitLog(cwd, ["--", ...files]);
}

function workbookFiles(workbook) {
  return [
    workbook.pdf,
    ...workbook.chapters.map((chapter) => `${chapter.id}.pdf`),
  ].map((name) => `public/${name}`);
}

async function main() {
  const cwd = new URL(".", root);
  const deploy = findLastFullDeploy(cwd);

  const workbooksRaw = await readFile(workbooksPath, "utf8");
  const workbooks = JSON.parse(workbooksRaw);

  const workbookUpdates = Object.fromEntries(
    workbooks.map((workbook) => {
      const update = findLastWorkbookUpdate(cwd, workbookFiles(workbook));
      return [workbook.num, update?.timestamp ?? null];
    }),
  );

  const payload = {
    lastFullDeploy: deploy?.timestamp ?? null,
    commit: deploy?.commit ?? null,
    workbooks: workbookUpdates,
  };

  await writeFile(outPath, `${JSON.stringify(payload, null, 2)}\n`);

  const missing = Object.values(workbookUpdates).filter((v) => v === null).length;
  console.log(
    deploy
      ? `Recorded last full deploy: ${payload.lastFullDeploy} (${deploy.commit.slice(0, 7)})`
      : "No full deploy commit found in git history; wrote empty deploy metadata.",
  );
  console.log(
    `Recorded per-workbook update times for ${workbooks.length} workbooks` +
      (missing > 0 ? ` (${missing} with no matching history).` : "."),
  );
}

const isMain = import.meta.url === pathToFileURL(process.argv[1] ?? "").href;
if (isMain) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
