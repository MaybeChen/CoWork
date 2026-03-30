/**
 * Component-level host/element defaults. Host selectors keep specificity predictable.
 */
export const componentSpecificStyles = `
.a2ui-surface .a2ui-node {
}

.a2ui-surface .a2-card,
.a2ui-surface .a2-modal,
.a2ui-surface .a2-list,
.a2ui-surface .a2-row,
.a2ui-surface .a2-column,
.a2ui-surface .a2-tabs,
.a2ui-surface .a2-tf,
.a2ui-surface .a2ui-text {
  flex: var(--weight, initial);
}

:where(.a2ui-surface .a2-image) img,
:where(.a2ui-surface .a2-video) video,
:where(.a2ui-surface .a2-audio) audio {
  display: block;
  width: 100%;
  max-width: 100%;
}

:where(.a2ui-surface .a2-text) p {
  margin: 0;
}
`
