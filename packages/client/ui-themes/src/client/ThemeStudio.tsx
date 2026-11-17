/**
 * Sidebar paintbrush launcher and its theme studio.
 *
 * The launcher sits in the sidebar foot above Settings, so the control the
 * user asked for is exactly where the column keeps its chrome. The studio
 * lists the default appearance, the four shipped packs, and every imported
 * pack, and loads new packs from a JSON file. All copy arrives through the
 * `sidebar.themes` locale seat; pack state arrives through the inject
 * `hooks` compartment.
 */
import { useRef, useState } from 'react'
import type { ChangeEvent, CSSProperties } from 'react'
import clsx from 'clsx'
import {
  Button, IconCloseOutlineRegular, IconPlusOutlineRegular, Modal, Tooltip,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { HostObservable, InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type { ImportFailure, ImportOutcome, PackStateSnapshot } from './packs.ts'
import type { ThemePack } from './themes.ts'
import { BUILTIN_PACKS } from './themes.ts'
import type { ThemeKey } from './locales.ts'
import { BrushIcon } from './BrushIcon.tsx'
import css from './ThemeStudio.module.css'

/** Business face injected into the launcher. */
export type ThemeStudioInjected = {
  /** Select a pack, or the default appearance for the empty id.
   * @param id - pack id.
   */
  selectPack: (id: string) => void
  /** Read and import one theme file.
   * @param file - file the user picked.
   * @returns the import outcome.
   */
  importFile: (file: File) => Promise<ImportOutcome>
  /** Drop one imported pack.
   * @param id - imported pack id.
   */
  removePack: (id: string) => void
  /** Registrant-private pack state, bound to `usePacks`. */
  hooks: { packs: HostObservable<PackStateSnapshot> }
}

/** Composed props of the sidebar-foot launcher. */
export type ThemeStudioProps =
  PropsRuntime<'sidebar.footer.action'> & InjectFace<ThemeStudioInjected> & PropsLocale<'sidebar.themes'>

/** Studio copy for each refused import. */
const FAILURE_KEYS = {
  'invalid-json': 'error.json',
  'invalid-shape': 'error.shape',
  limit: 'error.limit',
  read: 'error.read',
} as const satisfies Record<ImportFailure, ThemeKey>

interface PackCardProps {
  /** Localized pack title. */
  name: string
  /** Localized or author-written supporting line. */
  detail: string
  /** Whether this card is the active pack. */
  selected: boolean
  /** Three preview colors; absent for the default tile, which reads live tokens. */
  swatches?: readonly [string, string, string] | undefined
  /** Choose this pack. */
  onSelect: () => void
  /** Drop this imported pack; absent for built-in cards. */
  onRemove?: (() => void) | undefined
  /** Localized accessible name of the remove control. */
  removeLabel?: string | undefined
}

/**
 * Render one selectable pack card.
 * @param props - card content, selection state, and actions.
 * @returns the card element.
 */
function PackCard({ name, detail, selected, swatches, onSelect, onRemove, removeLabel }: PackCardProps) {
  const style = swatches === undefined
    ? undefined
    : {
      '--theme-swatch-1': swatches[0],
      '--theme-swatch-2': swatches[1],
      '--theme-swatch-3': swatches[2],
    } as CSSProperties
  return (
    <div className={clsx(css.card, selected && css.cardSelected, onRemove !== undefined && css.cardRemovable)}>
      <button type="button" className={css.select} aria-pressed={selected} onClick={onSelect}>
        <span
          className={clsx(css.swatches, swatches === undefined ? css.defaultSwatches : css.packSwatches)}
          style={style}
          aria-hidden="true"
        >
          <span className={css.swatch} />
          <span className={css.swatch} />
          <span className={css.swatch} />
        </span>
        <span className={css.cardBody}>
          <span className={css.cardName}>{name}</span>
          {detail !== '' && <span className={css.cardDetail}>{detail}</span>}
        </span>
      </button>
      {onRemove !== undefined && removeLabel !== undefined && (
        <Tooltip label={removeLabel} side="top">
          <button type="button" className={css.remove} aria-label={removeLabel} onClick={onRemove}>
            <IconCloseOutlineRegular size={12} />
          </button>
        </Tooltip>
      )}
    </div>
  )
}

/**
 * Render the sidebar launcher and the theme studio dialog.
 * @param props - composed slot props.
 * @returns the launcher row and its portaled dialog.
 */
export function ThemeStudio({
  wide, selectPack, importFile, removePack, usePacks, t,
}: ThemeStudioProps) {
  const [open, setOpen] = useState(false)
  const [failure, setFailure] = useState<ImportFailure | undefined>(undefined)
  const fileInput = useRef<HTMLInputElement>(null)
  const activeId = usePacks(snapshot => snapshot.activeId)
  const imported = usePacks(snapshot => snapshot.packs)

  const close = (): void => {
    setOpen(false)
    setFailure(undefined)
  }

  const nameOf = (pack: ThemePack): string => {
    if (pack.nameKey !== undefined) return t(pack.nameKey)
    /* v8 ignore next -- importedPack cannot produce a nameless pack: parsePack requires a non-empty name. */
    return pack.name ?? pack.id
  }
  const detailOf = (pack: ThemePack): string => {
    if (pack.descriptionKey !== undefined) return t(pack.descriptionKey)
    return pack.description ?? ''
  }

  const onFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (file === undefined) return
    void importFile(file).then((outcome) => { setFailure(outcome === 'ok' ? undefined : outcome) })
  }

  return (
    <>
      <div className={clsx(css.row, !wide && css.railRow)}>
        <Tooltip label={t('trigger')} side="top">
          <button
            type="button"
            className={clsx(css.trigger, !wide && css.rail)}
            aria-label={t('trigger')}
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => { setOpen(true) }}
          >
            <BrushIcon size={16} />
            {wide && <span className={css.triggerLabel}>{t('trigger')}</span>}
          </button>
        </Tooltip>
      </div>
      <Modal
        open={open}
        onClose={close}
        title={t('studio.title')}
        description={t('studio.description')}
        closeLabel={t('studio.close')}
        className={css.dialog as string}
        footer={<Button variant="primary" onClick={close}>{t('studio.done')}</Button>}
      >
        <div className={css.scroll}>
          <div className={css.grid}>
            <PackCard
              name={t('pack.default.name')}
              detail={t('pack.default.description')}
              selected={activeId === ''}
              onSelect={() => { selectPack('') }}
            />
            {BUILTIN_PACKS.map(pack => (
              <PackCard
                key={pack.id}
                name={nameOf(pack)}
                detail={detailOf(pack)}
                swatches={pack.swatches}
                selected={activeId === pack.id}
                onSelect={() => { selectPack(pack.id) }}
              />
            ))}
            {imported.map(pack => (
              <PackCard
                key={pack.id}
                name={nameOf(pack)}
                detail={detailOf(pack)}
                swatches={pack.swatches}
                selected={activeId === pack.id}
                onSelect={() => { selectPack(pack.id) }}
                onRemove={() => { removePack(pack.id) }}
                removeLabel={t('remove', { name: nameOf(pack) })}
              />
            ))}
          </div>
        </div>
        {failure !== undefined && <p className={css.failure} role="alert">{t(FAILURE_KEYS[failure])}</p>}
        <div className={css.importRow}>
          <Button
            variant="outline"
            size="sm"
            icon={<IconPlusOutlineRegular size={14} />}
            onClick={() => { fileInput.current?.click() }}
          >
            {t('import.action')}
          </Button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            className={css.fileInput}
            onChange={onFileChange}
            tabIndex={-1}
            aria-hidden="true"
          />
        </div>
      </Modal>
    </>
  )
}
