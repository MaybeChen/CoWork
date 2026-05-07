# Theming & Scope Guide

## Runtime options

`createCoworkUI(options)` supports:

- `themeName`: default theme name (`light`/`dark`).
- `themes`: allowed theme list.
- `attrName`: theme attribute name (default `data-theme`).
- `scope`: DOM node for theme attribute.
- `namespace`: css namespace prefix (default `coworkui`).
- `workspaceClass`: workspace scope class (default `${namespace}-workspace`).

## Scope strategy

A2UI runtime CSS is scoped with workspace selector.
`A2UIRenderer` always includes default `coworkui-workspace` class and also appends configured `workspaceClass` for host-side customization.

## Theme files

- `src/a2ui-runtime/style/common.css`: structure/non-theme behavior
- `src/a2ui-runtime/style/light.css`: light tokens
- `src/a2ui-runtime/style/dark.css`: dark tokens
