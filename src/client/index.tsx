/**
 * Model Picker Dialog, browser half: replaces the composer model-select seat
 * with a dialog picker (fuzzy search / collapsible provider groups /
 * favorites) plus a dedicated thinking-effort dropdown, both rendered
 * through @deepseek-ai/dsh-client-ui-primitives.
 *
 * The seat registration shadows the shipped ui-model-selection occupant
 * (priority -1 < 0); data rides the shared ModelDirectory service
 * (ctx.modelDirectories), so the /model popup stays in sync. Favorites
 * persist in localStorage (browser-owned user preference).
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: pulls the ui-conversation SlotMap merge (the seat declaration).
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
// Type-only: pulls the model-selection Context merge (ctx.modelDirectories).
import type {} from '@deepseek-ai/dsh-client-ui-model-selection/client'
import {
  IconCheckOutline14,
  IconChevronDownOutline14,
  IconCloseOutline16,
  IconRefreshOutline14,
  IconSearchOutline16,
  IconWarningOutline16,
  Menu,
  Modal,
  Tooltip,
  type MenuEntry,
} from '@deepseek-ai/dsh-client-ui-primitives'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import './style.css'

// ---------------------------------------------------------------------------
// client root context capture (services resolve lazily at interaction time)

let clientCtx: ClientContext | null = null

/** Resolve an optional cordis service from the client root context. */
function ctxGet(name: string): unknown {
  return clientCtx ? clientCtx.get(name) : undefined
}

// ---------------------------------------------------------------------------
// copy

const NS = 'model-picker'

const zh = {
  'title': '选择模型',
  'search.placeholder': '搜索模型名 / ID / 供应商…',
  'favs.only': '只看收藏',
  'favs.all': '显示全部',
  'empty.search': '没有匹配的模型',
  'empty.hint': '换个关键词试试',
  'empty.favs': '还没有收藏的模型',
  'empty.favsHint': '点击模型右侧的星标即可收藏',
  'empty.catalog': '模型目录为空',
  'loading': '正在加载模型目录…',
  'retry': '重试',
  'current': '当前',
  'noSelection': '尚未选择模型',
  'selectFailed': '切换失败',
  'effort.providerDefault': '默认',
  'effort.tip': '思考档位',
  'trigger.fallback': '选择模型',
  'trigger.tip': '选择模型',
  'close': '关闭',
  'clear': '清除搜索',
  'star.add': '收藏',
  'star.remove': '取消收藏',
  'unavailable': '当前会话不可切换模型',
  'group.toggle': '展开/收起',
} as const

const en: Record<keyof typeof zh, string> = {
  'title': 'Choose model',
  'search.placeholder': 'Search model name / ID / provider…',
  'favs.only': 'Favorites only',
  'favs.all': 'Show all',
  'empty.search': 'No matching models',
  'empty.hint': 'Try another query',
  'empty.favs': 'No favorites yet',
  'empty.favsHint': 'Click the star on a model row to favorite it',
  'empty.catalog': 'Model directory is empty',
  'loading': 'Loading model directory…',
  'retry': 'Retry',
  'current': 'Current',
  'noSelection': 'No model selected',
  'selectFailed': 'Failed to switch',
  'effort.providerDefault': 'Default',
  'effort.tip': 'Thinking effort',
  'trigger.fallback': 'Select model',
  'trigger.tip': 'Select model',
  'close': 'Close',
  'clear': 'Clear search',
  'star.add': 'Add to favorites',
  'star.remove': 'Remove from favorites',
  'unavailable': 'Model selection unavailable for this session',
  'group.toggle': 'Expand / collapse',
}

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The model picker's copy. */
    'model-picker': keyof typeof zh
  }
}

type T = (key: string) => string

// ---------------------------------------------------------------------------
// dialog store

interface DialogSnapshot { open: boolean; sessionId: string | null }
let dialogSnapshot: DialogSnapshot = { open: false, sessionId: null }
const dialogListeners = new Set<() => void>()
const subscribeDialog = (fn: () => void): (() => void) => {
  dialogListeners.add(fn)
  return () => { dialogListeners.delete(fn) }
}
const getDialog = (): DialogSnapshot => dialogSnapshot
function setDialog(open: boolean, sessionId: string | null): void {
  dialogSnapshot = { open, sessionId: sessionId || null }
  for (const fn of dialogListeners) fn()
}

// ---------------------------------------------------------------------------
// effort menu store

interface EffortSnapshot { open: boolean; sessionId: string | null }
let effortSnapshot: EffortSnapshot = { open: false, sessionId: null }
const effortListeners = new Set<() => void>()
const subscribeEffort = (fn: () => void): (() => void) => {
  effortListeners.add(fn)
  return () => { effortListeners.delete(fn) }
}
const getEffort = (): EffortSnapshot => effortSnapshot
function setEffortOpen(open: boolean, sessionId: string | null): void {
  effortSnapshot = { open, sessionId: sessionId || null }
  for (const fn of effortListeners) fn()
}

// ---------------------------------------------------------------------------
// favorites store (localStorage-persisted)

const FAV_KEY = 'dsh-model-picker.favorites'

interface FavSnapshot { ids: string[]; ready: boolean }
let favSnapshot: FavSnapshot = { ids: [], ready: false }
const favListeners = new Set<() => void>()
const subscribeFav = (fn: () => void): (() => void) => {
  favListeners.add(fn)
  return () => { favListeners.delete(fn) }
}
const getFav = (): FavSnapshot => favSnapshot
const notifyFav = (): void => { for (const fn of favListeners) fn() }

function loadFavs(): void {
  if (favSnapshot.ready) return
  favSnapshot = { ids: favSnapshot.ids, ready: true }
  try {
    const raw = window.localStorage.getItem(FAV_KEY)
    if (raw !== null) {
      const data: unknown = JSON.parse(raw)
      if (Array.isArray(data)) {
        favSnapshot = { ids: data.filter((x): x is string => typeof x === 'string'), ready: true }
      }
    }
  } catch (err) {
    console.error('[model-picker] favorites load failed:', err)
  }
  notifyFav()
}

function toggleFav(key: string): void {
  const has = favSnapshot.ids.includes(key)
  const ids = has ? favSnapshot.ids.filter((k) => k !== key) : favSnapshot.ids.concat([key])
  favSnapshot = { ids, ready: true }
  notifyFav()
  try {
    window.localStorage.setItem(FAV_KEY, JSON.stringify(ids))
  } catch (err) {
    console.error('[model-picker] favorites save failed:', err)
  }
}

// ---------------------------------------------------------------------------
// collapsed-groups store (per-session, module memory)

// DialogContent unmounts when the dialog closes, so local useState would
// forget collapsed groups on every reopen. Keep the per-session collapse
// sets in module memory instead (same useSyncExternalStore pattern as the
// dialog / effort / favorites stores above); re-opening the dialog restores
// them within the browser session.
const collapsedSnapshots = new Map<string, Set<string>>()
const collapsedListeners = new Set<() => void>()
const subscribeCollapsed = (fn: () => void): (() => void) => {
  collapsedListeners.add(fn)
  return () => { collapsedListeners.delete(fn) }
}
const getCollapsed = (sessionId: string): Set<string> => {
  let set = collapsedSnapshots.get(sessionId)
  if (set === undefined) {
    set = new Set()
    collapsedSnapshots.set(sessionId, set)
  }
  return set
}
const setCollapsed = (sessionId: string, next: Set<string>): void => {
  collapsedSnapshots.set(sessionId, next)
  for (const fn of collapsedListeners) fn()
}

// ---------------------------------------------------------------------------
// fuzzy search

function norm(s: unknown): string {
  return String(s == null ? '' : s).toLowerCase()
}

function scoreOne(hay: string, needle: string): number {
  const h = norm(hay)
  const n = norm(needle)
  if (n === '') return 0
  if (h === n) return 0
  if (h.indexOf(n) === 0) return 1
  if (h.indexOf(n) !== -1) return 2
  let i = 0
  for (let j = 0; j < h.length && i < n.length; j++) {
    if (h[j] === n[i]) i++
  }
  return i === n.length ? 3 : Infinity
}

function tokenScore(fields: string[], token: string): number {
  let best = Infinity
  for (const f of fields) {
    const s = scoreOne(f, token)
    if (s < best) best = s
  }
  return best
}

interface CatalogModel {
  id: string
  name: string
  description?: string
  reasoning?: {
    efforts: Array<{ id: string; name: string; description?: string }>
    defaultEffort?: string
  }
}
interface ProviderGroup { id: string; name: string; models: CatalogModel[] }
interface ModelRow { group: ProviderGroup; model: CatalogModel }
interface DirectoryState {
  current: { provider: string; model: string; reasoningEffort?: string } | null
  routable: boolean | null
  groups: ProviderGroup[]
  failures: Array<{ id: string; name: string; message: string }>
  status: 'idle' | 'loading' | 'ready' | 'selecting' | 'error'
  error: string | null
}

function buildRows(groups: ProviderGroup[], query: string): ModelRow[] {
  const rows: ModelRow[] = []
  for (const group of groups) {
    for (const model of group.models) rows.push({ group, model })
  }
  const tokens = norm(query).split(/\s+/).filter((s) => s !== '')
  if (tokens.length === 0) return rows
  const scored: Array<{ row: ModelRow; total: number }> = []
  for (const row of rows) {
    const fields = [row.model.name, row.model.id, row.group.name, row.group.id]
    let total = 0
    let ok = true
    for (const tok of tokens) {
      const s = tokenScore(fields, tok)
      if (s === Infinity) { ok = false; break }
      total += s
    }
    if (ok) scored.push({ row, total })
  }
  scored.sort((a, b) => a.total - b.total)
  return scored.map((x) => x.row)
}

function findHit(text: string, query: string): { before: string; hit: string; after: string } | null {
  const t = String(text == null ? '' : text)
  const tokens = norm(query).split(/\s+/).filter((s) => s !== '')
  for (const tok of tokens) {
    const idx = t.toLowerCase().indexOf(tok)
    if (idx !== -1) {
      return { before: t.slice(0, idx), hit: t.slice(idx, idx + tok.length), after: t.slice(idx + tok.length) }
    }
  }
  return null
}

// ---------------------------------------------------------------------------
// lucide star (user-specified glyph)

function StarIcon({ active }: { active: boolean }): ReactNode {
  return (
    <svg viewBox="0 0 24 24" width={15} height={15}
      fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// seat: model trigger + effort menu + dialog

interface SeatProps {
  locked: boolean
  sessionId: string
  useSession: <S>(sel: (s: unknown) => S) => S
  t: T
}

function Seat(props: SeatProps): ReactNode {
  const t: T = props.t
  const locked = props.locked === true
  const sessionId = props.sessionId
  const useSession = props.useSession
  const subagent = useSession((s: any) => (s ? s.subagent : null))
  const removed = useSession((s: any) => (s ? s.removed : false))
  const [dir, setDir] = useState<any>(null)
  const [supported, setSupported] = useState(true)
  const [effortError, setEffortError] = useState<string | null>(null)

  useEffect(() => {
    const models: any = ctxGet('modelDirectories')
    if (models === undefined) {
      setSupported(false)
      return
    }
    let d: any = null
    try {
      d = models.directoryFor(sessionId)
    } catch (err) {
      setSupported(false)
      return
    }
    setDir(d)
    if (subagent === null) d.load().catch(() => {})
    return () => {
      setDialog(false, null)
      setEffortOpen(false, null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  const store = dir === null ? null : dir.store
  const state = useSyncExternalStore<DirectoryState | null>(
    (fn) => (store === null ? () => {} : store.subscribe(fn)),
    () => (store === null ? null : store.getSnapshot() as DirectoryState),
  )
  const dlg = useSyncExternalStore(subscribeDialog, getDialog)
  const eff = useSyncExternalStore(subscribeEffort, getEffort)

  const available = subagent === null
  const disabled = locked || !available || removed || !supported
  const current = state === null ? null : state.current
  const groups = state === null ? [] : state.groups

  const choices = useMemo(() => {
    const out: Array<{ group: ProviderGroup; model: CatalogModel; selection: { provider: string; model: string; reasoningEffort?: string } }> = []
    for (const group of groups) {
      for (const model of group.models) {
        const selection: { provider: string; model: string; reasoningEffort?: string } = { provider: group.id, model: model.id }
        if (model.reasoning && model.reasoning.defaultEffort !== undefined) {
          selection.reasoningEffort = model.reasoning.defaultEffort
        }
        out.push({ group, model, selection })
      }
    }
    return out
  }, [groups])

  let currentChoice: { group: ProviderGroup; model: CatalogModel } | undefined
  if (current !== null) {
    currentChoice = choices.find((c) => c.selection.provider === current.provider && c.selection.model === current.model)
  }
  const reasoning = currentChoice ? currentChoice.model.reasoning : undefined
  let effectiveEffort: string | undefined
  if (current !== null) {
    effectiveEffort = current.reasoningEffort !== undefined ? current.reasoningEffort : (reasoning ? reasoning.defaultEffort : undefined)
  }
  const dialogOpen = dlg.open && dlg.sessionId === sessionId
  const effortOpen = eff.open && eff.sessionId === sessionId

  const openDialog = (): void => {
    if (disabled) return
    setEffortOpen(false, null)
    const models: any = ctxGet('modelDirectories')
    if (models === undefined) return
    let d: any = null
    try {
      d = models.directoryFor(sessionId)
    } catch (err) {
      return
    }
    if (available) d.load().catch(() => {})
    loadFavs()
    setDialog(true, sessionId)
  }

  const pickEffort = (id: string): void => {
    if (dir === null || current === null) return
    const effort = id === 'provider-default' ? undefined : id.slice('effort:'.length)
    const selection: { provider: string; model: string; reasoningEffort?: string } = { provider: current.provider, model: current.model }
    if (effort !== undefined) selection.reasoningEffort = effort
    setEffortError(null)
    dir.select(selection).then(() => {
      setEffortOpen(false, null)
    }).catch(() => {
      setEffortError(t('selectFailed'))
    })
  }

  let modelLabel: string | null = current === null ? null : current.model
  let modelCap: string | null = null
  let modelTip = t('trigger.tip')
  if (currentChoice) {
    modelLabel = currentChoice.model.name
    modelCap = currentChoice.group.name
    modelTip = modelLabel + ' · ' + modelCap
  } else if (current !== null) {
    modelTip = current.provider + '/' + current.model
  }

  const modelBtn = (
    <Tooltip label={modelTip} side="top" disabled={disabled && !removed}>
      <button
        type="button"
        className={'mpd-trigger' + (disabled ? ' is-disabled' : '')}
        onClick={openDialog}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={dialogOpen}
        aria-label={t('trigger.tip') + (current ? '：' + (modelLabel || current.model) : '')}
      >
        <span className="mpd-trigger-label">{current === null ? t('trigger.fallback') : modelLabel}</span>
        {modelCap === null ? null : <span className="mpd-trigger-cap">{modelCap}</span>}
        <IconChevronDownOutline14 className={'mpd-trigger-chev' + (dialogOpen ? ' is-open' : '')} />
      </button>
    </Tooltip>
  )

  const effortItems: MenuEntry[] = []
  const effortSelected = effectiveEffort === undefined ? 'provider-default' : 'effort:' + effectiveEffort
  if (reasoning) {
    if (reasoning.defaultEffort === undefined) {
      effortItems.push({ id: 'provider-default', label: t('effort.providerDefault') })
    }
    for (const e of reasoning.efforts) {
      effortItems.push({
        id: 'effort:' + e.id,
        label: (
          <span className="mpd-eff-item">
            {e.name}
            {e.description ? <span className="mpd-eff-detail">{e.description}</span> : null}
          </span>
        ),
      })
    }
  }

  let effortMenu: ReactNode = null
  if (reasoning) {
    let effortLabel: string = effectiveEffort as string
    if (effectiveEffort === undefined) {
      effortLabel = t('effort.providerDefault')
    } else {
      for (const e of reasoning.efforts) {
        if (e.id === effectiveEffort) {
          effortLabel = e.name
          break
        }
      }
    }
    const footerEntries: MenuEntry[] | undefined = effortError === null ? undefined : [{
      id: 'error',
      label: <span className="mpd-eff-error">{effortError}</span>,
      disabled: true,
    }]
    const effortTrigger = (
      <Tooltip label={t('effort.tip')} side="top">
        <button
          type="button"
          className={'mpd-trigger' + (effortOpen ? ' is-open' : '') + (disabled ? ' is-disabled' : '')}
          onClick={() => {
            if (disabled) return
            setDialog(false, null)
            setEffortOpen(!effortOpen, sessionId)
          }}
          disabled={disabled}
          aria-haspopup="menu"
          aria-expanded={effortOpen}
        >
          <span className="mpd-trigger-label">{effortLabel}</span>
          <IconChevronDownOutline14 className={'mpd-trigger-chev' + (effortOpen ? ' is-open' : '')} />
        </button>
      </Tooltip>
    )
    effortMenu = (
      <Menu
        open={effortOpen}
        anchor={effortTrigger}
        items={effortItems}
        selectedId={effortSelected}
        footer={footerEntries}
        onSelect={pickEffort}
        onClose={() => { setEffortOpen(false, null) }}
        align="end"
        side="top"
        portal
        dense
      />
    )
  }

  return (
    <div className="mpd-seat">
      {modelBtn}
      {effortMenu}
      {dialogOpen ? (
        <Modal
          open
          onClose={() => setDialog(false, null)}
          title={t('title')}
          closeLabel={t('close')}
          headless
          className="mpd-modal"
        >
          <DialogContent sessionId={sessionId} t={t} />
        </Modal>
      ) : null}
    </div>
  )
}

// ---------------------------------------------------------------------------
// dialog content (rendered inside primitives Modal)

interface DialogContentProps {
  sessionId: string
  t: T
}

function DialogContent({ sessionId, t }: DialogContentProps): ReactNode {
  const [dir, setDir] = useState<any>(null)
  useEffect(() => {
    const models: any = ctxGet('modelDirectories')
    if (models === undefined) return
    let d: any = null
    try {
      d = models.directoryFor(sessionId)
    } catch (err) {
      return
    }
    setDir(d)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  const store = dir === null ? null : dir.store
  const state = useSyncExternalStore<DirectoryState | null>(
    (fn) => (store === null ? () => {} : store.subscribe(fn)),
    () => (store === null ? null : store.getSnapshot() as DirectoryState),
  )
  const favs = useSyncExternalStore(subscribeFav, getFav)
  const [query, setQuery] = useState('')
  const [favOnly, setFavOnly] = useState(false)
  const collapsed = useSyncExternalStore(subscribeCollapsed, () => getCollapsed(sessionId))
  const [cursor, setCursor] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const rowRefs = useRef<Array<HTMLDivElement | null>>([])
  const listRef = useRef<HTMLDivElement>(null)
  const cursorByKeyboard = useRef(false)

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [])

  const groups = state === null ? [] : state.groups
  const current = state === null ? null : state.current
  const status = state === null ? 'loading' : state.status
  const failures = state === null ? [] : state.failures
  const loadErr = state === null ? null : state.error
  const searching = query.trim() !== ''
  const favKey = (r: ModelRow): string => r.group.id + '/' + r.model.id

  const allRows = useMemo(() => {
    let list = buildRows(groups, query)
    if (favOnly) list = list.filter((r) => favSnapshot.ids.includes(favKey(r)))
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups, query, favOnly, favs])

  const keyboardRows = useMemo(() => {
    if (searching) return allRows
    return allRows.filter((r) => !collapsed.has(r.group.id))
  }, [allRows, searching, collapsed])

  useEffect(() => {
    // List reflows (query / favorites / collapse / rows) reset the cursor to
    // the top. This is not keyboard navigation, so reset the scroll position
    // explicitly instead of relying on the cursor effect's scrollIntoView.
    cursorByKeyboard.current = false
    setCursor(0)
    if (listRef.current) listRef.current.scrollTop = 0
  }, [query, favOnly, collapsed, keyboardRows.length])
  useEffect(() => {
    // Only keyboard navigation scrolls the hovered row into view. Mouse
    // hover must never scroll: a partially visible row under the pointer
    // would otherwise trigger scrollIntoView on every mouseenter, making
    // the list jump/chase the pointer during fast sweeps.
    if (!cursorByKeyboard.current) return
    const el = rowRefs.current[cursor]
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' })
  }, [cursor])

  const pick = (row: ModelRow): void => {
    if (dir === null || busy) return
    const selection: { provider: string; model: string; reasoningEffort?: string } = { provider: row.group.id, model: row.model.id }
    if (row.model.reasoning && row.model.reasoning.defaultEffort !== undefined) {
      selection.reasoningEffort = row.model.reasoning.defaultEffort
    }
    setBusy(true)
    setError(null)
    dir.select(selection).then(() => {
      setDialog(false, null)
    }).catch(() => {
      setError(t('selectFailed'))
      setBusy(false)
    })
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.isComposing) return
      if (e.key === 'ArrowDown') {
        if (keyboardRows.length === 0) return
        e.preventDefault()
        cursorByKeyboard.current = true
        setCursor((c) => Math.min(c + 1, keyboardRows.length - 1))
        return
      }
      if (e.key === 'ArrowUp') {
        if (keyboardRows.length === 0) return
        e.preventDefault()
        cursorByKeyboard.current = true
        setCursor((c) => Math.max(c - 1, 0))
        return
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        const row = keyboardRows[Math.min(cursor, keyboardRows.length - 1)]
        if (row) pick(row)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  const stripMessages: string[] = []
  if (error) stripMessages.push(error)
  if (loadErr) stripMessages.push(loadErr)
  for (const f of failures) stripMessages.push(f.name + ': ' + f.message)
  const stripEl = stripMessages.length === 0 ? null : (
    <div className="mpd-strip">
      <IconWarningOutline16 className="mpd-strip-ico" />
      <span>{stripMessages[0]}</span>
      <button
        type="button"
        className="mpd-retry"
        onClick={() => { if (dir !== null) dir.load().catch(() => {}) }}
      >
        <IconRefreshOutline14 />
        {t('retry')}
      </button>
    </div>
  )

  const rowEl = (row: ModelRow, i: number): ReactNode => {
    const selected = current !== null && current.provider === row.group.id && current.model === row.model.id
    const nameHit = findHit(row.model.name, query) ?? findHit(row.model.id, query)
    const fav = favSnapshot.ids.includes(favKey(row))
    let nameNode: ReactNode = row.model.name
    if (nameHit) {
      nameNode = (
        <>
          {nameHit.before}
          <mark className="mpd-mark">{nameHit.hit}</mark>
          {nameHit.after}
        </>
      )
    }
    // Provider name lives in the group header while browsing; only search
    // results (flat list, no headers) carry the provider prefix.
    const subText = searching
      ? row.group.name + (row.model.description ? ' · ' + row.model.description : '')
      : (row.model.description || '')
    return (
      <div
        key={i}
        ref={(el) => { rowRefs.current[i] = el }}
        className={'mpd-row' + (selected ? ' is-current' : '') + (i === cursor ? ' is-cursor' : '')}
        onMouseEnter={() => {
          cursorByKeyboard.current = false
          setCursor(i)
        }}
        onMouseDown={(e) => {
          if (e.button === 0) pick(row)
        }}
      >
        <div className="mpd-row-main">
          <div className="mpd-row-name">{nameNode}</div>
          {subText === '' ? null : <div className="mpd-row-sub">{subText}</div>}
        </div>
        <div className="mpd-row-side">
          {selected ? <span className="mpd-check" title={t('current')}><IconCheckOutline14 /></span> : null}
          <button
            type="button"
            className={'mpd-star-btn' + (fav ? ' is-fav' : '')}
            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation() }}
            onClick={(e) => { e.stopPropagation(); toggleFav(favKey(row)) }}
            title={fav ? t('star.remove') : t('star.add')}
            aria-label={fav ? t('star.remove') : t('star.add')}
          >
            <StarIcon active={fav} />
          </button>
        </div>
      </div>
    )
  }

  const groupEl = (g: ProviderGroup, rowsOfGroup: ModelRow[], startIndex: number, isCollapsed: boolean): ReactNode => (
    <div key={g.id}>
      <button
        type="button"
        className={'mpd-group-head' + (isCollapsed ? ' is-collapsed' : '')}
        onClick={() => {
          const prev = getCollapsed(sessionId)
          const next = new Set(prev)
          if (next.has(g.id)) next.delete(g.id)
          else next.add(g.id)
          setCollapsed(sessionId, next)
        }}
        aria-expanded={!isCollapsed}
        title={t('group.toggle') + '：' + g.name}
      >
        <IconChevronDownOutline14 className="mpd-group-chev" />
        <span className="mpd-group-name">{g.name}</span>
        <span className="mpd-group-count">
          {favOnly ? String(rowsOfGroup.length) + '/' + String(g.models.length) : String(g.models.length)}
        </span>
      </button>
      {isCollapsed ? null : (
        <div className="mpd-group-body">
          {rowsOfGroup.map((row, i) => rowEl(row, startIndex + i))}
        </div>
      )}
    </div>
  )

  let bodyEl: ReactNode
  if (status === 'loading' && groups.length === 0) {
    bodyEl = (
      <div className="mpd-loading">
        <div className="mpd-spin" />
        {t('loading')}
      </div>
    )
  } else if (allRows.length === 0) {
    let emptyTitle = t('empty.catalog')
    let emptyHint = ''
    if (query) { emptyTitle = t('empty.search'); emptyHint = t('empty.hint') }
    else if (favOnly) { emptyTitle = t('empty.favs'); emptyHint = t('empty.favsHint') }
    bodyEl = (
      <div className="mpd-empty">
        <div className="mpd-empty-strong">{emptyTitle}</div>
        {emptyHint ? <span>{emptyHint}</span> : null}
      </div>
    )
  } else {
    let rowIndex = 0
    const inner: ReactNode[] = []
    if (searching) {
      for (const row of keyboardRows) inner.push(rowEl(row, rowIndex++))
    } else {
      for (const g of groups) {
        const rowsOfGroup = allRows.filter((r) => r.group.id === g.id)
        if (rowsOfGroup.length === 0) continue
        const isCollapsed = collapsed.has(g.id)
        inner.push(groupEl(g, rowsOfGroup, rowIndex, isCollapsed))
        rowIndex += isCollapsed ? 0 : rowsOfGroup.length
      }
    }
    bodyEl = <div ref={listRef} className="mpd-list">{inner}</div>
  }

  return (
    <div className="mpd-modal-content">
      <div className="mpd-head">
        <h2 className="mpd-title">{t('title')}</h2>
        <div className="mpd-head-actions">
          <button
            type="button"
            className={'mpd-fav-btn' + (favOnly ? ' is-active' : '')}
            onClick={() => setFavOnly((v) => !v)}
            title={favOnly ? t('favs.all') : t('favs.only')}
            aria-pressed={favOnly}
            aria-label={favOnly ? t('favs.all') : t('favs.only')}
          >
            <StarIcon active={favOnly} />
            {favOnly ? t('favs.all') : t('favs.only')}
          </button>
          <button
            type="button"
            className="mpd-icon-btn"
            onClick={() => setDialog(false, null)}
            title={t('close')}
            aria-label={t('close')}
          >
            <IconCloseOutline16 size={14} />
          </button>
        </div>
      </div>
      <div className="mpd-search">
        <IconSearchOutline16 className="mpd-search-ico" />
        <input
          ref={inputRef}
          className="mpd-search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search.placeholder')}
          spellCheck={false}
          autoComplete="off"
        />
        {query === '' ? null : (
          <button
            type="button"
            className="mpd-clear"
            onClick={() => setQuery('')}
            aria-label={t('clear')}
            title={t('clear')}
          >
            <IconCloseOutline16 size={14} />
          </button>
        )}
      </div>
      {stripEl}
      {bodyEl}
      <div className="mpd-foot">
        <div className="mpd-foot-current">
          <span className="mpd-foot-label">{t('current')}</span>
          {current === null
            ? <span className="mpd-foot-model">{t('noSelection')}</span>
            : <span className="mpd-foot-model">{current.provider + '/' + current.model}</span>}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// plugin

/**
 * Required services (cordis fiber inject): 'conversation' is an ordering
 * edge — 'conversation.input.model' is declared by ui-conversation's apply,
 * and register() into an undeclared slot throws.
 */
export const inject = ['slots', 'locale', 'conversation', 'modelDirectories']

/**
 * Client plugin body: register the `model-picker` dictionaries and the
 * composer model seat (trigger + effort menu + dialog).
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  clientCtx = ctx
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'model-picker: dictionaries')

  ctx.inject(['slots', 'locale', 'conversation', 'modelDirectories'], (scope: ClientContext) => {
    scope.effect(
      () => scope.slots.register(
        { name: 'conversation.input.model', priority: -1, registrant: 'model-picker', locale: NS },
        Seat as never,
      ),
      'model-picker: composer seat',
    )
  })
}
