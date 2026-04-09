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

.a2ui-surface .hero_fact .a2-column{
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
  width: fit-content;
  min-width:120px;
  border-radius: 22px;
  padding: 22px 22px 18px;
  background: radial-gradient(circle at 10% 0%, rgba(113, 124, 255, 0.12), transparent 40%), linear-gradient(180deg, rgba(11, 20, 38, 0.88), rgba(8, 15, 29, 0.86));
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.a2ui-surface .hero_fact .a2-column:hover{
  transform: translateY(-5px);
}

.a2ui-surface .hero_fact .a2-column .a2ui-text:first-child{
  color:rgba(255, 255, 255, 0.4);
}

.a2ui-surface .hero_fact .a2-column .a2ui-text:last-child{
  font-weight: bold;
  font-size: 120%;
}
`
