/** Code preview metadata and body registered through the public document extension points. */
import type { Context } from '@deepseek-ai/cordis'
import { CODE_HIGHLIGHT_EXTENSIONS, CODE_HIGHLIGHT_FILENAMES } from '@deepseek-ai/dsh-client-ui-primitives'
import type {} from '../index.ts'
import type { TextStore } from '../store.ts'
import { CodeBody } from './CodeBody.tsx'
import { en, ja, es, fr, de, ru, pt, zh } from './locales.ts'

const ID = '@deepseek-ai/dsh-client-ui-sidebar-documentpreview/code'
const NS = 'sidebarCodePreview'

/**
 * @param ctx - owning plugin context.
 * @param store - the preview store the body reads and writes its grammar choice in.
 */
export function apply(ctx: Context, store: TextStore): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en, ja, es, fr, de, ru, pt }))
  const t = ctx.locale.bind(NS)
  ctx.effect(() => ctx.documentPreviews.register({
    id: ID,
    extensions: CODE_HIGHLIGHT_EXTENSIONS,
    names: CODE_HIGHLIGHT_FILENAMES,
    extensionless: true,
    priority: 'builtin',
    title: () => t('title'),
    loading: 'text-pages',
    wrap: true,
    sourceLines: true,
  }))
  ctx.effect(() => ctx.slots.inject('sidebar.right.tab.document', () => ctx.slots.register(
    { name: 'sidebar.right.tab.document', key: ID, locale: NS, store }, CodeBody,
  )))
}
