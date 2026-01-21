This repository contains the live state of the Kontinua Foundation Sequence.

The Kontinua Foundation Sequence is a structured, four-year learning curriculum designed to be completed sequentially. Each workbook builds on the previous ones, reinforcing foundational concepts while progressively reaching different topics and levels of depth. See [Sequence](https://github.com/KontinuaFoundation/sequence) for more.

This repository is a GitHub page that students and authors alike can access to see the state of all workbooks, a live preview of each draft chapter, and all included digital resources (YouTube videos, Wikipedia articles, etc). This live state can be viewed [here](https://kontinuafoundation.github.io/).

## How is this built?
This repository is auto-deployed via a Python and Bash script run by authors in the Sequence Repository. Running that script requires this repository to be cloned in the same folder, such that the structure is as follows:

```perl
<workspace>/
├─ sequence/                       # Source-of-truth authoring repository
│  ├─ Build/
│  │  └─ deploy_to_kontinua.py                 # Script that generates, builds, and transfers content
│  ├─ Chapters/
│  └─ ...
└─ kontinuafoundation.github.io/   # Generated GitHub Pages repository
```

## Editing & Source of Truth

This repository is a **generated, read-only view** of the Kontinua Foundation Sequence.

- **Do not edit content directly in this repository**
- All authored content lives in the [Sequence repository](https://github.com/KontinuaFoundation/sequence)
- Changes are propagated here automatically via the build and deployment scripts in Sequence

> ⚠️ Note: This repository reflects an active, evolving curriculum.  
> Content may change at any time as chapters are drafted, revised, or reorganized.

## Who is this repository for?
This repository is an open-source view of the open-source resources developed by the authors and writers of the Kontinua Foundation. Additionally,

- **Students** trying out the Sequence for the first time
- **Authors** reviewing the live rendered state of draft chapters
- **Editors and Publishers** writing and checking structure, flow, and progression
- **The public and interested communities** seeking transparency into the Kontinua Foundation Sequence

## Feedback & Issues

If an issue of the live state is found, please create a GitHub issue as this helps our organization greatly, addressing issues as they come up. Specifically
- Report broken links or rendering errors
- Flag inconsistencies between source and live content
- Design, style, and frontend code improvements

_Curriculum design feedback should be directed to the main Sequence repository._
