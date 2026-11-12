# Agent Note: Highlighting for extensionless files and a per-tab grammar choice

Status: implemented

English | [中文](2026-11-12-extensionless-code-highlighting.zh.md)

## Problem

The Sidebar's Code renderer picks its grammar from the path alone, through `languageForPath`. A name with no suffix (`Makefile`, `Dockerfile`, `script`) resolves to nothing, so the body renders plain text and the viewer menu offers only Plain text: the reader has no way to ask for highlighting. Names that name their language without a readable suffix (`CMakeLists.txt` misses on `txt`, `.bashrc` misses on `bashrc`) and dotfiles stay unclassified for the same reason, and a diff whose `---`/`+++` header names such a file keeps its row colors but loses the token colors inside each row.

## Decision

Classify three things more precisely, and let the reader override the result per tab.

### Whole filenames

`@deepseek-ai/dsh-util-code-language` gains a second table, [`LANGUAGE_FILENAMES`](../../../../packages/util/code-language/src/index.ts), matched against the lowercased final path segment before the extension is considered, and exported as `CODE_HIGHLIGHT_FILENAMES` so a preview registry can claim the same names. A name matches whole, so `notes.cmakelists.txt` stays unlisted. Dockerfile joins both tables: the Shiki module registers its grammar as `docker` with `dockerfile` as an alias, so the highlighter's alias table maps the language id onto that registered grammar.

### Extensionless claims

`DocumentPreviewDefinition` gains `names` (whole filenames) and `extensionless` (final segment carries no dot). The registry ranks a matched name like a suffix of the same length and keeps claiming a suffix first, so a specialized viewer still wins. The Code renderer claims each recognized suffix, each recognized filename, and every extensionless name, which is what puts Code in the viewer menu for a file no table classifies.

### Per-tab grammar choice

The Code body's toolbar heading becomes a grammar control: it names the effective grammar and opens a menu of `HIGHLIGHT_LANGUAGES` plus Automatic, which returns the tab to the filename's language. The preview store holds the choice as `TextTabState.language`, so switching viewers or remounting the body keeps it. `CodeBlock` gained `languageControl` for that heading, which keeps the choices and their copy in the owning surface's locale instead of the shared primitive.

## Alternatives considered

- **Content sniffing** — rejected: the shared table states that it never reads bytes, and a heuristic on the Host would make the language depend on how much of the file had been read.
- **A language parameter on the tab address** — rejected: the choice is view state, not content identity. A parameter would fork the address, split metadata sharing between two tabs of one file, and outlive the reader's intent on every reopen.
- **Keeping Plain text as the default for extensionless files** — rejected: `Makefile`, `Dockerfile`, and shell scripts are the common extensionless case, and the Code body is a superset of the plain body (line numbers, copy, wrap, scrollport), so Code becomes the default and Plain text stays one menu entry away.

## Consequences

Any extensionless file now opens with line numbers and a Code banner where it previously opened as plain text; readers of prose files such as `LICENSE` pay one menu selection to return to Plain text. The shared table grows a second kind of claim, so a preview plugin that declares only suffixes still behaves exactly as before, while a plugin that wants Code-like coverage must declare both. A diff of a file the table classifies keeps syntax colors on its rows; a diff of an unclassified path keeps only the row fills.

## Testing

- `packages/util/code-language/tests/code-language.spec.ts` — filename precedence, whole-name matching, dotfiles, and the persisted read hint for both tables.
- `packages/client/ui-sidebar-documentpreview/tests/document-registry.client.spec.ts` and `code-registration.client.spec.tsx` — name ranking, extensionless claims, and the Code definition's metadata.
- `packages/client/ui-sidebar-documentpreview/tests/code-body.client.spec.tsx` — choosing a grammar for an extensionless file, returning to Automatic, dismissing the menu, and rendering `.diff` rows.
- `packages/client/ui-sidebar-documentpreview/tests/store.client.spec.ts` — the per-tab choice and its removal.
- `packages/client/ui-primitives/tests/read-block.client.spec.tsx` — the Dockerfile grammar loading lazily through its alias; `tests/diff-fence.client.spec.tsx` — a diff header naming `Makefile` keeping token colors.
