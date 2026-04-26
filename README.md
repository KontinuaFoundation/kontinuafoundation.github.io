# Kontinua Foundation — Live State

This repository contains the live state of the Kontinua Foundation Sequence rendered as an interactive web application.

The Kontinua Foundation Sequence is a structured, four-year learning curriculum designed to be completed sequentially. Each workbook builds on the previous ones, reinforcing foundational concepts while progressively reaching different topics and levels of depth. See [Sequence](https://github.com/KontinuaFoundation/sequence) for more.

This live state can be viewed at [kontinuafoundation.github.io](https://kontinuafoundation.github.io/).

## How is this built?

This repository is auto-deployed via a Bash script run by authors in the [Sequence Repository](https://github.com/KontinuaFoundation/sequence). Running that script requires this repository to be cloned in the same folder, such that the structure is as follows:

```
<workspace>/
├─ sequence/                       # Source-of-truth authoring repository
│  ├─ Build/
│  │  ├─ deploy.bash              # Script that generates and deploys content
│  │  └─ Resources-en_US/         # Generated HTML, PDFs, and workbooks
│  ├─ Chapters/
│  └─ ...
└─ kontinuafoundation.github.io/   # Generated GitHub Pages repository (this repo)
```

## Technology Stack

- **Frontend**: Svelte + TypeScript + Vite
- **Package Manager**: Bun
- **Graph Visualization**: Sigma + Graphology
- **Styling**: MVP.css framework with custom theme
- **Deployment**: GitHub Actions → GitHub Pages

## Development

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## Editing & Source of Truth

This repository is a **generated, read-only view** of the Kontinua Foundation Sequence.

- **Do not edit content directly in this repository**
- All authored content lives in the [Sequence repository](https://github.com/KontinuaFoundation/sequence)
- Changes are propagated here automatically via the build and deployment scripts in Sequence

> ⚠️ **Note**: This repository reflects an active, evolving curriculum. Content may change at any time as chapters are drafted, revised, or reorganized.

## Who is this repository for?

This repository is an open-source view of the open-source resources developed by the authors and writers of the Kontinua Foundation:

- **Students** trying out the Sequence for the first time
- **Authors** reviewing the live rendered state of draft chapters
- **Editors** writing and checking structure, flow, and progression
- **The public and interested communities** seeking transparency into the Kontinua Foundation Sequence

## Feedback & Issues

If an issue with the live state is found, please create a [GitHub issue](https://github.com/KontinuaFoundation/kontinuafoundation.github.io/issues) as this helps our organization greatly. Please report:

- Broken links or rendering errors
- Inconsistencies between source and live content
- Design, style, and frontend code improvements

_Curriculum design feedback should be directed to the [Sequence repository](https://github.com/KontinuaFoundation/sequence)._
