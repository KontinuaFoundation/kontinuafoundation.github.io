import { readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const workbooksPath = new URL("public/workbooks.json", root);
const graphPath = new URL("public/graph.json", root);
const checkOnly = process.argv.includes("--check");

function stableHash(value) {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function stableUnit(value) {
  return stableHash(value) / 0xffffffff;
}

function hasPosition(node) {
  return Number.isFinite(node?.x) && Number.isFinite(node?.y);
}

function dedupe(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function derivePrereqs(chapter, topicToChapterId, chapterIds, missingRequires) {
  const prereqs = [];

  for (const requiredTopic of chapter.requires ?? []) {
    const prereqChapter =
      topicToChapterId.get(requiredTopic) ??
      (chapterIds.has(requiredTopic) ? requiredTopic : null);

    if (!prereqChapter) {
      missingRequires.push({ chapter: chapter.id, requiredTopic });
      continue;
    }

    if (prereqChapter !== chapter.id) {
      prereqs.push(prereqChapter);
    }
  }

  return dedupe(prereqs);
}

function createPosition(chapterId, workbookNum, prereqs, positionLookup) {
  const positionedPrereqs = prereqs
    .map((prereq) => positionLookup.get(prereq))
    .filter(hasPosition);

  if (positionedPrereqs.length > 0) {
    const center = positionedPrereqs.reduce(
      (acc, node) => ({
        x: acc.x + node.x / positionedPrereqs.length,
        y: acc.y + node.y / positionedPrereqs.length,
      }),
      { x: 0, y: 0 },
    );
    const angle = stableUnit(`${chapterId}:angle`) * Math.PI * 2;
    const radius = 14 + stableUnit(`${chapterId}:radius`) * 18;

    return {
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius,
    };
  }

  const workbookIndex = Number.parseInt(workbookNum, 10) || 0;
  const workbookAngle = (workbookIndex / 36) * Math.PI * 2;
  const jitterAngle = (stableUnit(`${chapterId}:jitter-angle`) - 0.5) * 0.9;
  const radius = 36 + stableUnit(`${chapterId}:jitter-radius`) * 54;
  const angle = workbookAngle + jitterAngle;

  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

function normalizeNode(node, workbookNum, prereqs, chapterId, positionLookup) {
  const position = hasPosition(node)
    ? { x: node.x, y: node.y }
    : createPosition(chapterId, workbookNum, prereqs, positionLookup);

  return {
    workbook: workbookNum,
    prereqs,
    x: position.x,
    y: position.y,
  };
}

async function main() {
  const [workbooksRaw, graphRaw] = await Promise.all([
    readFile(workbooksPath, "utf8"),
    readFile(graphPath, "utf8").catch((error) => {
      if (error.code === "ENOENT") return "{}";
      throw error;
    }),
  ]);

  const workbooks = JSON.parse(workbooksRaw);
  const currentGraph = JSON.parse(graphRaw);
  const topicToChapterId = new Map();
  const chapterIds = new Set();
  const chapters = [];

  for (const workbook of workbooks) {
    for (const chapter of workbook.chapters ?? []) {
      chapterIds.add(chapter.id);
      chapters.push({ workbookNum: workbook.num, chapter });

      for (const topic of chapter.covers ?? []) {
        if (!topicToChapterId.has(topic.id)) {
          topicToChapterId.set(topic.id, chapter.id);
        }
      }
    }
  }

  const nextGraph = {};
  const positionLookup = new Map(
    Object.entries(currentGraph)
      .filter(([, node]) => hasPosition(node))
      .map(([id, node]) => [id, { x: node.x, y: node.y }]),
  );
  const added = [];
  const removed = Object.keys(currentGraph).filter((id) => !chapterIds.has(id));
  const missingRequires = [];

  for (const { workbookNum, chapter } of chapters) {
    const prereqs = derivePrereqs(
      chapter,
      topicToChapterId,
      chapterIds,
      missingRequires,
    );
    const existingNode = currentGraph[chapter.id];
    const nextNode = normalizeNode(
      existingNode,
      workbookNum,
      prereqs,
      chapter.id,
      positionLookup,
    );

    nextGraph[chapter.id] = nextNode;
    positionLookup.set(chapter.id, { x: nextNode.x, y: nextNode.y });

    if (!existingNode) {
      added.push(chapter.id);
    }
  }

  const nextGraphRaw = `${JSON.stringify(nextGraph, null, 2)}\n`;

  if (nextGraphRaw !== graphRaw) {
    if (checkOnly) {
      console.error(
        `public/graph.json is out of sync with public/workbooks.json (${added.length} added, ${removed.length} removed).`,
      );
      process.exitCode = 1;
    } else {
      await writeFile(graphPath, nextGraphRaw);
      console.log(
        `Synced public/graph.json (${added.length} added, ${removed.length} removed).`,
      );
    }
  } else {
    console.log("public/graph.json is already in sync.");
  }

  if (added.length > 0) {
    console.log(`Added chapters: ${added.join(", ")}`);
  }

  if (removed.length > 0) {
    console.log(`Removed stale chapters: ${removed.join(", ")}`);
  }

  if (missingRequires.length > 0) {
    const examples = missingRequires
      .slice(0, 10)
      .map(({ chapter, requiredTopic }) => `${chapter} -> ${requiredTopic}`)
      .join(", ");
    console.warn(
      `Warning: ${missingRequires.length} required topic(s) are not covered by any chapter: ${examples}`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
