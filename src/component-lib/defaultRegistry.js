import { createComponentRegistry } from './registry'

import TextComponent from './components/TextComponent.vue'
import ImageComponent from './components/ImageComponent.vue'
import IconComponent from './components/IconComponent.vue'
import DividerComponent from './components/DividerComponent.vue'
import VideoComponent from './components/VideoComponent.vue'
import AudioPlayerComponent from './components/AudioPlayerComponent.vue'

import RowComponent from './components/RowComponent.vue'
import ColumnComponent from './components/ColumnComponent.vue'
import ListComponent from './components/ListComponent.vue'
import CardComponent from './components/CardComponent.vue'
import TabsComponent from './components/TabsComponent.vue'
import ModalComponent from './components/ModalComponent.vue'
import FlowDiagramComponent from './components/FlowDiagramComponent.vue'

import ButtonComponent from './components/ButtonComponent.vue'
import TextFieldComponent from './components/TextFieldComponent.vue'
import CheckBoxComponent from './components/CheckBoxComponent.vue'
import SliderComponent from './components/SliderComponent.vue'
import DateTimeInputComponent from './components/DateTimeInputComponent.vue'
import MultipleChoiceComponent from './components/MultipleChoiceComponent.vue'

export const defaultRegistry = createComponentRegistry({
  Text: TextComponent,
  Image: ImageComponent,
  Icon: IconComponent,
  Divider: DividerComponent,
  Video: VideoComponent,
  AudioPlayer: AudioPlayerComponent,

  Row: RowComponent,
  Column: ColumnComponent,
  List: ListComponent,
  Card: CardComponent,
  Tabs: TabsComponent,
  Modal: ModalComponent,
  FlowDiagram: FlowDiagramComponent,

  Button: ButtonComponent,
  TextField: TextFieldComponent,
  CheckBox: CheckBoxComponent,
  Slider: SliderComponent,
  DateTimeInput: DateTimeInputComponent,
  MultipleChoice: MultipleChoiceComponent,
})
