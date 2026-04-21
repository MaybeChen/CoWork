const baseComponents = {
  AudioPlayer: {},
  Button: {
    'layout-pt-2': true, 'layout-pb-2': true, 'layout-pl-3': true, 'layout-pr-3': true,
    'border-br-12': true, 'border-bw-0': true, 'border-bs-s': true, 'color-bgc-p30': true,
    'behavior-ho-70': true, 'typography-w-400': true,
  },
  Card: { 'border-br-9': true, 'layout-p-4': true, 'color-bgc-n100': true },
  CheckBox: { container: { 'layout-dsp-iflex': true, 'layout-al-c': true }, label: { 'color-c-p30': true }, element: { 'layout-m-0': true, 'layout-mr-2': true } },
  Column: { 'layout-g-2': true },
  DateTimeInput: { container: { 'layout-w-100': true, 'layout-g-2': true }, label: { 'color-c-p30': true }, element: { 'border-br-2': true, 'border-bw-1': true } },
  Divider: {},
  Image: { all: { 'border-br-5': true, 'layout-el-cv': true, 'layout-w-100': true, 'layout-h-100': true }, avatar: { 'is-avatar': true }, header: {}, icon: {}, largeFeature: {}, mediumFeature: {}, smallFeature: {} },
  Icon: {},
  List: { 'layout-g-4': true, 'layout-p-2': true },
  LineChart: {},
  Modal: { backdrop: { 'color-bbgc-p60_20': true }, element: { 'border-br-2': true, 'layout-p-4': true, 'border-bw-1': true } },
  MultipleChoice: { container: {}, label: {}, element: {} },
  Row: { 'layout-g-4': true },
  Slider: { container: {}, label: {}, element: {} },
  Table: {},
  Tabs: { container: {}, controls: { all: {}, selected: {} }, element: {} },
  Text: {
    all: { 'layout-w-100': true, 'layout-g-2': true },
    h1: { 'typography-sz-hs': true },
    h2: { 'typography-sz-tl': true },
    h3: { 'typography-sz-tl': true },
    h4: { 'typography-sz-bl': true },
    h5: { 'typography-sz-bm': true },
    body: {}, caption: {}, warning: { 'color-c-warning': true },
  },
  TextField: { container: { 'layout-w-100': true, 'layout-g-2': true }, label: { 'color-c-p30': true }, element: { 'border-br-2': true, 'border-bw-1': true } },
  Video: { 'border-br-5': true, 'layout-el-cv': true },
}

export const darkTheme = {
  additionalStyles: {
    Button: {
      '--n-35': 'var(--n-100)',
      '--n-10': 'var(--n-0)',
      background: 'linear-gradient(135deg, #818cf8 0%, #3b82f6 100%)',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
      padding: '12px 28px',
      textTransform: 'uppercase',
    },
    Text: {
      h1: { color: 'transparent', background: 'linear-gradient(135deg, #818cf8 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' },
      h2: {},
      h3: {},
      h4: {}, h5: {}, body: {}, caption: {}, warning: { color: '#facc15' },
    },
    Card: {},
    TextField: {
      '--p-0': '#1e293b',
    },
  },
  components: baseComponents,
}

export const lightTheme = {
  additionalStyles: {
    Button: {
      '--n-35': '#ffffff',
      '--n-10': '#eff6ff',
      background: 'linear-gradient(135deg, #60a5fa 0%, #22d3ee 100%)',
      boxShadow: '0 6px 14px rgba(56, 189, 248, 0.25)',
      padding: '12px 28px',
      textTransform: 'uppercase',
    },
    Text: {
      h1: { color: 'transparent', background: 'linear-gradient(135deg, #60a5fa 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' },
      h2: { color: '#0f172a' },
      h3: { color: '#1e293b' },
      h4: { color: '#334155' },
      h5: { color: '#334155' },
      body: { color: '#334155' },
      caption: { color: '#64748b' },
      warning: { color: '#b45309' },
    },
    Card: {
      background: '#ffffff',
      border: '1px solid #dbeafe',
      boxShadow: '0 10px 24px rgba(148, 163, 184, 0.12)',
    },
    TextField: {
      '--p-0': '#f8fafc',
      color: '#334155',
    },
  },
  components: baseComponents,
}

export const themes = {
  dark: darkTheme,
  light: lightTheme,
}

export function resolveTheme(themeName = 'light') {
  return themes[themeName] || lightTheme
}

export const defaultTheme = lightTheme
