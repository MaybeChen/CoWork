import { createComponentRegistry } from './registry'

import TextComponent from './components/content/TextComponent.vue'
import ImageComponent from './components/content/ImageComponent.vue'
import IconComponent from './components/content/IconComponent.vue'
import DividerComponent from './components/content/DividerComponent.vue'
import VideoComponent from './components/content/VideoComponent.vue'
import AudioPlayerComponent from './components/content/AudioPlayerComponent.vue'
import FlowDiagramComponent from './components/content/FlowDiagramComponent.vue'
import TableComponent from './components/content/TableComponent.vue'
import LineChartComponent from './components/content/LineChartComponent.vue'
import PieChartComponent from './components/content/PieChartComponent.vue'

import RowComponent from './components/layout/RowComponent.vue'
import ColumnComponent from './components/layout/ColumnComponent.vue'
import ListComponent from './components/layout/ListComponent.vue'
import CardComponent from './components/layout/CardComponent.vue'
import TabsComponent from './components/layout/TabsComponent.vue'
import ModalComponent from './components/layout/ModalComponent.vue'
import TimelineComponent from './components/layout/TimelineComponent.vue'
import TimelineItemComponent from './components/layout/TimelineItemComponent.vue'

import ButtonComponent from './components/interactive/ButtonComponent.vue'
import TextFieldComponent from './components/interactive/TextFieldComponent.vue'
import CheckBoxComponent from './components/interactive/CheckBoxComponent.vue'
import SliderComponent from './components/interactive/SliderComponent.vue'
import DateTimeInputComponent from './components/interactive/DateTimeInputComponent.vue'
import MultipleChoiceComponent from './components/interactive/MultipleChoiceComponent.vue'

export const defaultRegistry = createComponentRegistry({
  Text: TextComponent,
  Image: ImageComponent,
  Icon: IconComponent,
  Divider: DividerComponent,
  Video: VideoComponent,
  AudioPlayer: AudioPlayerComponent,
  FlowDiagram: FlowDiagramComponent,
  Table: TableComponent,
  LineChart: LineChartComponent,
  PieChart: PieChartComponent,

  Row: RowComponent,
  Column: ColumnComponent,
  List: ListComponent,
  Card: CardComponent,
  Tabs: TabsComponent,
  Modal: ModalComponent,
  Timeline: TimelineComponent,
  TimelineItem: TimelineItemComponent,

  Button: ButtonComponent,
  TextField: TextFieldComponent,
  CheckBox: CheckBoxComponent,
  Slider: SliderComponent,
  DateTimeInput: DateTimeInputComponent,
  MultipleChoice: MultipleChoiceComponent,
})
