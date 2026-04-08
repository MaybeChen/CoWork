/**
 * Browser default reset for A2UI surfaces (Light DOM parity with A2UI React renderer).
 */
export const resetStyles = `
@layer a2ui-reset {
  :where(.a2ui-surface) :where(*):not(svg):not(svg *):not(foreignObject):not(foreignObject *) {
    all: revert;
    box-sizing: border-box;
  }
}
`
