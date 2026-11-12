/** Locale-owned code renderer name and CodeBlock controls. */
import type {} from '@deepseek-ai/dsh-client-ui-slots'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Code document implementation name and copy controls. */
    sidebarCodePreview: keyof typeof zh
  }
}

/** Simplified Chinese dictionary and key source. */
export const zh = {
  title: '代码',
  copy: '复制',
  copied: '已复制',
  language: '高亮格式',
  automatic: '自动',
}

/** English dictionary with the same keys. */
export const en = {
  title: 'Code',
  copy: 'Copy',
  copied: 'Copied',
  language: 'Highlight format',
  automatic: 'Automatic',
} satisfies Record<keyof typeof zh, string>

/** Japanese copy, checked against the English keys. */
export const ja = {
  'title': 'コード',
  'copy': 'コピー',
  'copied': 'コピーしました',
  'language': 'ハイライト形式',
  'automatic': '自動',
} satisfies Record<keyof typeof en, string>

/** Spanish dictionary, checked against the English keys. */
export const es = {
  title: 'Código',
  copy: 'Copiar',
  copied: 'Copiado',
  language: 'Formato de resaltado',
  automatic: 'Automático',
} satisfies Record<keyof typeof en, string>

/** French dictionary, checked against the English keys. */
export const fr = {
  title: 'Coder',
  copy: 'Copier',
  copied: 'Copié',
  language: 'Format de coloration',
  automatic: 'Automatique',
} satisfies Record<keyof typeof en, string>

/** German dictionary, checked against the English keys. */
export const de = {
  title: 'Code',
  copy: 'Kopieren',
  copied: 'Kopiert',
  language: 'Hervorhebungsformat',
  automatic: 'Automatisch',
} satisfies Record<keyof typeof en, string>

/** Russian dictionary, checked against the English keys. */
export const ru = {
  title: 'Код',
  copy: 'Копировать',
  copied: 'Скопировано',
  language: 'Формат подсветки',
  automatic: 'Автоматически',
} satisfies Record<keyof typeof en, string>

/** Portuguese dictionary, checked against the English keys. */
export const pt = {
  title: 'Código',
  copy: 'Copiar',
  copied: 'Copiado',
  language: 'Formato de realce',
  automatic: 'Automático',
} satisfies Record<keyof typeof en, string>
