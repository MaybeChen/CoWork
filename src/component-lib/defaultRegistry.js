import { createComponentRegistry } from './registry'
import SweetRow from './components/SweetRow.vue'
import SweetColumn from './components/SweetColumn.vue'
import SweetCardBuiltin from './components/SweetCardBuiltin.vue'
import SweetTextBuiltin from './components/SweetTextBuiltin.vue'

export const defaultRegistry = createComponentRegistry({
  Row: SweetRow,
  Column: SweetColumn,
  Card: SweetCardBuiltin,
  Text: SweetTextBuiltin,
})
