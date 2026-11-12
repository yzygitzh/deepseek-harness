---
description: "Single file-extension to syntax-highlighting language table shared by the Client code surfaces and the Host read card."
kind: "package-library"
---

# dsh-util-code-language

English | [中文](README.zh.md)

## Summary

The repository's one filename to syntax-highlighting language table, shared by the Client's document Code preview and diff review, and by the Host read tool's persisted `lang` hint. `languageForPath` maps a path to a canonical grammar id case-insensitively, matching a recognized whole filename before its extension; `CODE_HIGHLIGHT_EXTENSIONS` lists every suffix and `CODE_HIGHLIGHT_FILENAMES` every whole filename a preview registry can claim. `readLangHintForPath` projects the read card's short ids over the same table, so a recorded session keeps its persisted value and other suffixes take their language's short name. The package is browser-safe, stateless, and leaves tokenization to the Client highlighter.

## Table of Contents

- [Language selection](#language-selection)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

-----

<a id="language-selection"></a>
## Language selection

The table lives in [`src/index.ts`](src/index.ts). Each key is a canonical language id — the grammar id the Client highlighter resolves — and each value is the lowercase extensions without the dot that select it. `languageForPath(path)` takes the text after the last dot of the final path segment, lowercases it, and looks it up in a `Map`; a `Map` keeps a filename such as `foo.constructor` from resolving an `Object.prototype` member. An unlisted dotfile (`.gitignore`), an absent extension, a trailing dot, and an unknown suffix all return `undefined`, which every consumer renders as plain text; a leading dot is still the separator, so `.env` resolves to `dotenv`. Both `/` and `\` separate path segments, so a Windows path resolves like a POSIX one.

A second table, [`LANGUAGE_FILENAMES`](src/index.ts), lists whole filenames that name their language without a suffix the extension table reads: `Makefile`, `GNUmakefile`, `Dockerfile`, `Containerfile`, `CMakeLists.txt`, `Gemfile`, `Rakefile`, `Jenkinsfile`, `Snakefile`, `SConstruct`, `PKGBUILD`, `APKBUILD`, and the shell dotfiles (`.bashrc`, `.bash_profile`, `.bash_aliases`, `.zshrc`, `.zprofile`). A match compares the lowercased final path segment against the whole declared name and wins over the extension, so `CMakeLists.txt` resolves to `cmake` rather than missing on `txt`; a name matches whole, so `notes.cmakelists.txt` stays unlisted. `CODE_HIGHLIGHT_FILENAMES` lists those names for a preview registry, which claims them beside the suffixes so such a file still offers a Code view.

The set is curated for common source, config, script, data, and markup extensions rather than mirroring a full language registry. Extensions with no matching grammar map to the nearest one (`properties` to `ini`, whose registration carries the `properties` alias); certificate and lock extensions (`pem`, `crt`, `key`, `cer`, `lock`) stay unlisted. CSV maps to `csv`; preview registries place specialized viewers before Code so Spreadsheet remains its default preview. `readLangHintForPath` is a projection over this table: a suffix whose value a recorded session already holds returns that persisted short id, any other suffix returns its language's short name (`powershell` to `ps1`), and an unrecognized suffix returns `undefined` — so the persisted field holds one style, a short name; for `kotlin`, `swift`, `yaml`, `json`, and similar that name is also the grammar id, and the suffixes whose own name is the better label (`tsx`, `tf`, `tfvars`, `gradle`) keep it. A consumer that needs the Client highlighter to actually tokenize a language still depends on that grammar being registered there — an id without a loaded grammar renders as plain text rather than failing.

-----

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- **Listed names only** — a whole filename resolves only when [`LANGUAGE_FILENAMES`](src/index.ts) lists it, so a name known by convention elsewhere (`.gitignore`, `.editorconfig`, `Justfile`) stays plain until it is added there.
- **No content sniffing** — a file with an absent or unknown extension stays plain text even when its bytes are unambiguous; the table never inspects content.
- **Curated, not exhaustive** — the table is smaller than Shiki's grammar catalog and GitHub linguist; adding a language means adding both the extension entry and the Client grammar registration.


<a id="dev-note"></a>
### Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

None.

</details>
