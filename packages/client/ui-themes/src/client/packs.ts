/**
 * Theme pack state and the import file format.
 *
 * A pack file is either one pack object or `{ "themes": [...] }`. Every pack
 * carries a name, a base color scheme, and a `--dsw-*` token map; the studio
 * applies those tokens over the base palette. Imported packs and the active
 * selection survive a reload through `localStorage` because the durable theme
 * settings only accept the built-in light/dark/system preferences.
 */
import type { ThemePack } from './themes.ts'
import { previewSwatches } from './themes.ts'

/** Imported-pack storage key. */
const PACKS_KEY = 'dsh.ui-themes.packs.v1'

/** Active-selection storage key. */
const ACTIVE_KEY = 'dsh.ui-themes.active.v1'

/** Longest accepted pack name. */
const MAX_NAME_LENGTH = 48

/** Longest accepted pack description. */
const MAX_DESCRIPTION_LENGTH = 160

/** Most token overrides one pack may carry. */
const MAX_PACK_TOKENS = 256

/** Longest accepted token variable name. */
const MAX_TOKEN_NAME_LENGTH = 80

/** Longest accepted token value. */
const MAX_TOKEN_VALUE_LENGTH = 240

/** Most packs one file may add. */
const MAX_IMPORT_PACKS = 8

/** Why an import file was rejected. */
export type ImportFailure = 'invalid-json' | 'invalid-shape' | 'limit' | 'read'

/** Import result: applied, or the reason the file was refused. */
export type ImportOutcome = 'ok' | ImportFailure

/** One validated pack parsed from an import file or stored state. */
export interface ParsedPack {
  /** Author-supplied name. */
  readonly name: string
  /** Optional author-supplied description. */
  readonly description?: string
  /** Base palette the tokens are drawn for. */
  readonly colorScheme: 'light' | 'dark'
  /** Validated `--dsw-*` token values. */
  readonly tokens: Readonly<Record<string, string>>
}

/** Parse result for one theme file. */
export type ParseResult =
  | { readonly ok: true; readonly packs: readonly ParsedPack[] }
  | { readonly ok: false; readonly reason: ImportFailure }

/** The two `localStorage` calls the pack store uses. */
export interface PackStorage {
  /** @param key - storage key. @returns the stored text, or null when absent. */
  getItem(key: string): string | null
  /** @param key - storage key. @param value - text to store. */
  setItem(key: string, value: string): void
}

/** Observable pack state handed to the studio through the inject `hooks` compartment. */
export interface PackStateSnapshot {
  /** Active pack id; empty selects the plain light/dark/system appearance. */
  readonly activeId: string
  /** Imported packs in import order; built-in packs are not repeated here. */
  readonly packs: readonly ThemePack[]
}

/** Pack selection state with its complete mutation API. */
export interface PackStore {
  /** @returns the current snapshot; the reference is stable between changes. */
  getSnapshot(): PackStateSnapshot
  /** @param listener - called after each published change. @returns unsubscribe. */
  subscribe(listener: () => void): () => void
  /** @param id - pack to select, or empty for no pack. */
  setActive(id: string): void
  /** @param packs - imported packs to append. */
  addPacks(packs: readonly ThemePack[]): void
  /** @param id - imported pack to drop; clears the selection when it was active. */
  removePack(id: string): void
}

/**
 * Narrow one JSON value to a plain object without asserting a type.
 * @param value - value read from JSON.
 * @returns whether the value is a non-null, non-array object.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Read the browser's `localStorage`.
 * @returns the store, or undefined when the browser withholds it (private mode, hardened contexts).
 */
export function browserStorage(): PackStorage | undefined {
  try {
    return globalThis.localStorage
  } catch {
    // Storage access itself throws when the browser blocks it; packs then last for this page only.
    return undefined
  }
}

/** Refused validation result shared by the pack parsers. */
type Refused = { readonly ok: false; readonly reason: ImportFailure }

/** Validate one pack's token map. */
function parseTokens(value: unknown): { readonly ok: true; readonly tokens: Record<string, string> } | Refused {
  if (!isRecord(value)) return { ok: false, reason: 'invalid-shape' }
  const entries = Object.entries(value)
  if (entries.length > MAX_PACK_TOKENS) return { ok: false, reason: 'limit' }
  if (entries.length === 0) return { ok: false, reason: 'invalid-shape' }
  const tokens: Record<string, string> = {}
  for (const [name, token] of entries) {
    if (!name.startsWith('--dsw-') || name.length > MAX_TOKEN_NAME_LENGTH) return { ok: false, reason: 'invalid-shape' }
    if (typeof token !== 'string' || token.length === 0 || token.length > MAX_TOKEN_VALUE_LENGTH) {
      return { ok: false, reason: 'invalid-shape' }
    }
    tokens[name] = token
  }
  return { ok: true, tokens }
}

/** Validate one pack object. */
function parsePack(value: unknown): { readonly ok: true; readonly pack: ParsedPack } | Refused {
  if (!isRecord(value)) return { ok: false, reason: 'invalid-shape' }
  const name = value.name
  if (typeof name !== 'string' || name.trim() === '' || name.length > MAX_NAME_LENGTH) return { ok: false, reason: 'invalid-shape' }
  const colorScheme = value.colorScheme
  if (colorScheme !== 'light' && colorScheme !== 'dark') return { ok: false, reason: 'invalid-shape' }
  const rawDescription = value.description
  if (rawDescription !== undefined && (typeof rawDescription !== 'string' || rawDescription.length > MAX_DESCRIPTION_LENGTH)) {
    return { ok: false, reason: 'invalid-shape' }
  }
  const parsedTokens = parseTokens(value.tokens)
  if (!parsedTokens.ok) return parsedTokens
  return {
    ok: true,
    pack: {
      name: name.trim(),
      colorScheme,
      tokens: parsedTokens.tokens,
      ...rawDescription === undefined || rawDescription.trim() === '' ? {} : { description: rawDescription.trim() },
    },
  }
}

/**
 * Parse one theme file.
 * @param text - file contents.
 * @returns the validated packs, or the reason the file was refused.
 */
export function parsePackFile(text: string): ParseResult {
  let value: unknown
  try {
    value = JSON.parse(text)
  } catch {
    // A file that is not JSON is the user's mistake, reported in the studio.
    return { ok: false, reason: 'invalid-json' }
  }
  const entries = Array.isArray(value) ? value : isRecord(value) && Array.isArray(value.themes) ? value.themes : [value]
  if (entries.length > MAX_IMPORT_PACKS) return { ok: false, reason: 'limit' }
  const packs: ParsedPack[] = []
  for (const entry of entries) {
    const parsed = parsePack(entry)
    if (!parsed.ok) return { ok: false, reason: parsed.reason }
    packs.push(parsed.pack)
  }
  return { ok: true, packs }
}

/**
 * Build a stable id for an imported pack.
 * @param name - author-supplied name.
 * @param taken - ids already in use.
 * @returns a lowercase slug prefixed with `custom-` and suffixed until unique.
 */
export function packId(name: string, taken: ReadonlySet<string>): string {
  const slug = name.toLowerCase().replaceAll(/[^a-z0-9]+/gu, '-').replaceAll(/^-|-$/gu, '').slice(0, 32)
  const base = `custom-${slug === '' ? 'theme' : slug}`
  let candidate = base
  let index = 2
  while (taken.has(candidate)) {
    candidate = `${base}-${String(index)}`
    index += 1
  }
  return candidate
}

/**
 * Build the pack record for one imported pack.
 * @param parsed - validated pack fields.
 * @param id - id assigned by {@link packId}.
 * @returns the selectable pack.
 */
export function importedPack(parsed: ParsedPack, id: string): ThemePack {
  return Object.freeze({
    id,
    colorScheme: parsed.colorScheme,
    tokens: Object.freeze({ ...parsed.tokens }),
    swatches: Object.freeze(previewSwatches(parsed.tokens)),
    builtin: false,
    name: parsed.name,
    ...parsed.description === undefined ? {} : { description: parsed.description },
  })
}

/** Serialize imported packs for storage. */
function serializePacks(packs: readonly ThemePack[]): string {
  return JSON.stringify(packs.map(pack => ({
    id: pack.id,
    name: pack.name ?? pack.id,
    ...pack.description === undefined ? {} : { description: pack.description },
    colorScheme: pack.colorScheme,
    tokens: pack.tokens,
  })))
}

/**
 * Restore imported packs from storage text.
 * @param text - stored JSON, or null when nothing was stored.
 * @returns the packs that still validate; invalid or duplicate entries are dropped.
 */
export function restorePacks(text: string | null): readonly ThemePack[] {
  if (text === null) return []
  let value: unknown
  try {
    value = JSON.parse(text)
  } catch {
    // Corrupt storage is not user-visible; the next import rewrites it.
    return []
  }
  if (!Array.isArray(value)) return []
  const packs: ThemePack[] = []
  const taken = new Set<string>()
  for (const entry of value.slice(0, MAX_IMPORT_PACKS)) {
    if (!isRecord(entry) || typeof entry.id !== 'string' || entry.id === '' || taken.has(entry.id)) continue
    const parsed = parsePack(entry)
    if (!parsed.ok) continue
    taken.add(entry.id)
    packs.push(importedPack(parsed.pack, entry.id))
  }
  return packs
}

/**
 * Restore the imported packs from storage.
 * @param storage - source store, or undefined when the browser withheld one.
 * @returns the packs that still validate; an unreadable store yields none.
 */
export function storedPacks(storage: PackStorage | undefined): readonly ThemePack[] {
  if (storage === undefined) return []
  try {
    return restorePacks(storage.getItem(PACKS_KEY))
  } catch {
    // Unreadable storage behaves like a first run; the next import rewrites it.
    return []
  }
}

/**
 * Persist the imported packs.
 * @param storage - target store, or undefined when the browser withheld one.
 * @param packs - imported packs in display order.
 */
export function storePacks(storage: PackStorage | undefined, packs: readonly ThemePack[]): void {
  if (storage === undefined) return
  try {
    storage.setItem(PACKS_KEY, serializePacks(packs))
  } catch {
    // A full or read-only store keeps the packs for this page; the selection still applies.
  }
}

/**
 * Read the persisted pack selection.
 * @param storage - source store, or undefined when the browser withheld one.
 * @returns the stored pack id, or empty when none was stored.
 */
export function storedActiveId(storage: PackStorage | undefined): string {
  if (storage === undefined) return ''
  try {
    return storage.getItem(ACTIVE_KEY) ?? ''
  } catch {
    // Unreadable storage behaves like an empty selection.
    return ''
  }
}

/**
 * Persist the pack selection.
 * @param storage - target store, or undefined when the browser withheld one.
 * @param id - selected pack id, or empty for no pack.
 */
export function storeActiveId(storage: PackStorage | undefined, id: string): void {
  if (storage === undefined) return
  try {
    storage.setItem(ACTIVE_KEY, id)
  } catch {
    // A full or read-only store keeps the selection for this page only.
  }
}

/**
 * Create the pack selection state.
 * @param initialPacks - imported packs restored at startup.
 * @param initialActiveId - selection restored at startup.
 * @returns the store handle shared by the plugin body and the studio registration.
 */
export function createPackStore(initialPacks: readonly ThemePack[], initialActiveId: string): PackStore {
  let snapshot: PackStateSnapshot = Object.freeze({ activeId: initialActiveId, packs: Object.freeze([...initialPacks]) })
  const listeners = new Set<() => void>()
  const publish = (next: PackStateSnapshot): void => {
    snapshot = next
    for (const listener of listeners) listener()
  }
  return {
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
    setActive: (id) => {
      if (snapshot.activeId === id) return
      publish(Object.freeze({ activeId: id, packs: snapshot.packs }))
    },
    addPacks: (packs) => {
      if (packs.length === 0) return
      publish(Object.freeze({ activeId: snapshot.activeId, packs: Object.freeze([...snapshot.packs, ...packs]) }))
    },
    removePack: (id) => {
      const packs = snapshot.packs.filter(pack => pack.id !== id)
      if (packs.length === snapshot.packs.length) return
      publish(Object.freeze({ activeId: snapshot.activeId === id ? '' : snapshot.activeId, packs: Object.freeze(packs) }))
    },
  }
}
