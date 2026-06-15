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


## uDesign 2.2 design tokens

The package includes the complete uDesign 2.2 light and dark token sets. Set the
`theme` attribute on `body` to activate one of them:

```js
document.body.setAttribute('theme', 'uDesign2.2-light')
document.body.setAttribute('theme', 'uDesign2.2-dark')
```

The tokens use the `--swt-*` namespace and are loaded automatically with
`A2UIRenderer`. Consumers that only need the token stylesheet can import it
explicitly:

```js
import 'coworkUI/theme.css'
```
