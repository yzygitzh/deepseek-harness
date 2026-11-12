/**
 * Incrementally highlighted source; the document owner supplies the accumulated
 * text, the wrap preference, and the tab's grammar choice.
 *
 * The toolbar's heading is this renderer's language control: the effective
 * grammar id opens a menu of every grammar the highlighter registers plus
 * Automatic, which returns the tab to the filename's language. A filename the
 * extension and name tables do not classify therefore still highlights once the
 * reader names its grammar, and the choice survives viewer switches because the
 * preview store holds it per tab.
 */
import { useState } from 'react'
import type { ReactNode } from 'react'
import type { PropsLocale, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
import {
  CodeBlock, HIGHLIGHT_LANGUAGES, IconChevronDownOutlineRegular, Menu, languageForPath,
} from '@deepseek-ai/dsh-client-ui-primitives'
import { parseFileAddress } from '@deepseek-ai/dsh-util-workspace-path'
import type { DocumentPreviewProps } from '../document/contract.ts'
import type { TextStore } from '../store.ts'
import type {} from './locales.ts'
import css from './CodeBody.module.css'

/** Menu id of the row returning a tab to its filename's grammar. */
const AUTOMATIC = 'automatic'

/** Document owner props, the tab's store, and this renderer's localized controls. */
export type CodeBodyProps = DocumentPreviewProps & PropsStore<TextStore> & PropsLocale<'sidebarCodePreview'>

/**
 * @param props - accumulated document contents, the preview store, and framework props.
 * @returns one stable CodeBlock, or no body for byte contents.
 */
export function CodeBody({
  resourceAddress, content, wrap, scrollportRef, t, useTabInfo, useStore, actions,
}: CodeBodyProps): ReactNode {
  const { tab } = useTabInfo()
  const chosen = useStore(state => state.byTab[tab.id]?.language)
  const [menuOpen, setMenuOpen] = useState(false)
  if (content.kind !== 'text') return null
  const file = parseFileAddress(resourceAddress)
  if (file === undefined) throw new Error(`ui-sidebar-documentpreview: not a file address "${resourceAddress}"`)
  const language = chosen ?? languageForPath(file.path)
  const languageControl = (
    <Menu
      open={menuOpen}
      anchor={(
        <button
          type="button"
          className={css.language}
          aria-label={t('language')}
          title={t('language')}
          data-code-language-menu
          onClick={() => { setMenuOpen(value => !value) }}
        >
          {language ?? t('codeBlock.title')}
          <IconChevronDownOutlineRegular size={12} />
        </button>
      )}
      items={[
        { id: AUTOMATIC, label: t('automatic') },
        ...HIGHLIGHT_LANGUAGES.map(id => ({ id, label: id })),
      ]}
      selectedId={chosen ?? AUTOMATIC}
      onSelect={(id) => {
        actions.languageSelected(tab.id, id === AUTOMATIC ? undefined : id)
        setMenuOpen(false)
      }}
      onClose={() => { setMenuOpen(false) }}
      align="end"
      portal
      dense
    />
  )
  return (
    <div className={css.renderer} data-code-preview data-wrap={wrap}>
      <CodeBlock
        className={css.code}
        contentRef={scrollportRef}
        code={content.text}
        lang={language}
        languageControl={languageControl}
        streaming={!content.eof}
        wrap={wrap}
        lineNumbers
        copyLabel={t('copy')}
        copiedLabel={t('copied')}
        toolbarLabels={{ codeLabel: t('codeBlock.title'), wrapLabel: t('codeBlock.wrap'), unwrapLabel: t('codeBlock.unwrap') }}
      />
    </div>
  )
}
