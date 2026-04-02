/**
 * Component-level host/element defaults. Host selectors keep specificity predictable.
 */
export const componentSpecificStyles = `
.a2ui-surface .a2ui-node {
  transform-origin: top center;
  animation: a2ui-node-grow-in 360ms cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes a2ui-node-grow-in {
  0% {
    opacity: 0;
    transform: translateY(14px) scale(0.94);
    filter: blur(3px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
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

.a2ui-surface .hero_fact {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  padding: 5px;
}
`
