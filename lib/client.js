window.__ModuleLoader__.load({
	id: "dsh-model-picker",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region \0dsh-css:/home/alray/Projects/dsh-plugins-dev/model-picker/src/client/style.css.mjs
		const css = "/* Model Picker Dialog surface styles — chrome comes from\n   @deepseek-ai/dsh-client-ui-primitives; only surface layout lives here.\n   All colors use the dsw design tokens. */\n\n.mpd-seat {\n  display: inline-flex;\n  align-items: center;\n  gap: 12px;\n  max-width: 100%;\n}\n\n/* composer trigger pills (same family as PermissionSelect) */\n.mpd-trigger {\n  min-width: 0;\n  max-width: 220px;\n  height: 28px;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n  background: transparent;\n  border: none;\n  border-radius: 24px;\n  outline: none;\n  align-items: center;\n  gap: 4px;\n  padding: 0 4px 0 8px;\n  font-size: 13px;\n  font-weight: 500;\n  line-height: 20px;\n  display: inline-flex;\n}\n.mpd-trigger:hover:not(:disabled) {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n.mpd-trigger:focus-visible {\n  box-shadow: 0 0 0 2px var(--dsw-alias-border-l3);\n}\n.mpd-trigger:disabled {\n  color: var(--dsw-alias-label-dimmed);\n  cursor: default;\n}\n.mpd-trigger-label {\n  flex: 1 1 0;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.mpd-trigger-cap {\n  flex: 0 1 auto;\n  min-width: 0;\n  max-width: 140px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: var(--dsw-alias-label-caption);\n  font-size: 12px;\n  font-weight: 400;\n}\n.mpd-trigger-chev {\n  color: var(--dsw-alias-label-caption);\n  flex: none;\n  display: inline-flex;\n  transition: transform 0.12s;\n}\n.mpd-trigger-chev.is-open {\n  transform: rotate(180deg);\n}\n\n/* dialog (card chrome from primitives Modal) */\n.mpd-modal {\n  width: min(640px, 100%);\n}\n.mpd-modal-content {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n  min-height: 0;\n}\n.mpd-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  padding: 22px 14px 12px 24px;\n}\n.mpd-title {\n  margin: 0;\n  font-size: 16px;\n  line-height: 24px;\n  font-weight: 500;\n  color: var(--dsw-alias-label-primary);\n}\n.mpd-head-actions {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n}\n.mpd-icon-btn {\n  width: 28px;\n  height: 28px;\n  display: grid;\n  place-items: center;\n  border: none;\n  border-radius: 8px;\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n  transition: background 0.12s ease, color 0.12s ease;\n}\n.mpd-icon-btn:hover {\n  background: var(--dsw-alias-interactive-bg-hover);\n  color: var(--dsw-alias-label-primary);\n}\n.mpd-fav-btn {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  height: 28px;\n  padding: 0 10px;\n  border: none;\n  border-radius: 14px;\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 12.5px;\n  cursor: pointer;\n  transition: background 0.12s ease, color 0.12s ease;\n}\n.mpd-fav-btn:hover {\n  background: var(--dsw-alias-interactive-bg-hover);\n  color: var(--dsw-alias-label-primary);\n}\n.mpd-fav-btn.is-active {\n  color: var(--dsw-alias-state-warn-primary);\n}\n\n/* search field (popupSelect pattern) */\n.mpd-search {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin: 0 24px;\n  padding: 0 10px;\n  border: 1px solid var(--dsw-alias-border-inverted);\n  border-radius: 8px;\n  background: transparent;\n  transition: border-color 0.12s ease;\n}\n.mpd-search:focus-within {\n  border-color: var(--dsw-alias-border-l2);\n}\n.mpd-search-ico {\n  color: var(--dsw-alias-label-tertiary);\n  flex: none;\n  display: inline-flex;\n}\n.mpd-search-input {\n  flex: 1;\n  min-width: 0;\n  height: 34px;\n  background: transparent;\n  border: none;\n  outline: none;\n  color: var(--dsw-alias-label-primary);\n  font-size: 13px;\n}\n.mpd-search-input::placeholder {\n  color: var(--dsw-alias-label-tertiary);\n}\n.mpd-clear {\n  flex: none;\n  width: 20px;\n  height: 20px;\n  display: grid;\n  place-items: center;\n  border: none;\n  background: transparent;\n  color: var(--dsw-alias-label-tertiary);\n  border-radius: 6px;\n  cursor: pointer;\n}\n.mpd-clear:hover {\n  background: var(--dsw-alias-interactive-bg-hover);\n  color: var(--dsw-alias-label-primary);\n}\n\n/* error strip */\n.mpd-strip {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin: 0 24px;\n  padding: 8px 12px;\n  border-radius: 8px;\n  font-size: 12px;\n  background: var(--dsw-alias-state-error-secondary);\n  color: var(--dsw-alias-state-error-primary);\n}\n.mpd-strip-ico {\n  flex: none;\n  display: inline-flex;\n}\n.mpd-retry {\n  margin-left: auto;\n  flex: none;\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  border: 1px solid currentColor;\n  border-radius: 999px;\n  padding: 3px 10px;\n  font-size: 11.5px;\n  background: transparent;\n  color: inherit;\n  cursor: pointer;\n  transition: background 0.12s ease, color 0.12s ease;\n}\n.mpd-retry:hover {\n  background: currentColor;\n  color: var(--dsw-alias-bg-layer-2);\n}\n\n/* model list */\n.mpd-list {\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n  margin: 0 24px;\n  max-height: min(460px, calc(100vh - 340px));\n  --dsh-scrollbar-thumb: var(--dsw-alias-scrollbar-bg-l2);\n  --dsh-scrollbar-thumb-hover: var(--dsw-alias-scrollbar-hover-l2);\n}\n.mpd-group-head {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  width: 100%;\n  height: 32px;\n  padding: 0 8px;\n  border: none;\n  border-radius: 8px;\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 12.5px;\n  font-weight: 600;\n  letter-spacing: 0.02em;\n  cursor: pointer;\n  transition: background 0.12s ease;\n}\n.mpd-group-head:hover {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n.mpd-group-chev {\n  color: var(--dsw-alias-label-caption);\n  flex: none;\n  display: inline-flex;\n  transition: transform 0.12s;\n  transform: rotate(-90deg);\n}\n.mpd-group-head:not(.is-collapsed) .mpd-group-chev {\n  transform: rotate(0deg);\n}\n.mpd-group-name {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  min-width: 0;\n}\n.mpd-group-count {\n  flex: none;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 11.5px;\n  font-weight: 500;\n}\n.mpd-group-body {\n  padding: 2px 0 4px;\n}\n.mpd-row {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 7px 8px;\n  border-radius: 8px;\n  cursor: pointer;\n}\n.mpd-row.is-cursor {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n.mpd-row.is-current .mpd-row-name {\n  color: var(--dsw-alias-brand-primary);\n}\n.mpd-row-main {\n  flex: 1;\n  min-width: 0;\n}\n.mpd-row-name {\n  font-size: 13.5px;\n  font-weight: 500;\n  line-height: 1.35;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.mpd-row-sub {\n  font-size: 11.5px;\n  line-height: 1.4;\n  color: var(--dsw-alias-label-tertiary);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.mpd-mark {\n  background: var(--dsw-alias-interactive-bg-hover-accent);\n  color: var(--dsw-alias-brand-primary);\n  border-radius: 3px;\n  padding: 0 1px;\n}\n.mpd-row-side {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  flex: none;\n}\n.mpd-check {\n  color: var(--dsw-alias-brand-primary);\n  display: inline-flex;\n}\n.mpd-star-btn {\n  width: 26px;\n  height: 26px;\n  display: grid;\n  place-items: center;\n  border: none;\n  background: transparent;\n  border-radius: 8px;\n  color: var(--dsw-alias-label-tertiary);\n  cursor: pointer;\n  transition: color 0.12s ease, background 0.12s ease, transform 0.12s ease;\n}\n.mpd-star-btn:hover {\n  background: var(--dsw-alias-interactive-bg-hover);\n  color: var(--dsw-alias-label-primary);\n}\n.mpd-star-btn.is-fav {\n  color: var(--dsw-alias-state-warn-primary);\n}\n.mpd-star-btn.is-fav:hover {\n  transform: scale(1.08);\n}\n\n/* empty / loading */\n.mpd-empty {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 6px;\n  height: 160px;\n  margin: 0 24px;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 12.5px;\n  text-align: center;\n  padding: 0 24px;\n}\n.mpd-empty-strong {\n  color: var(--dsw-alias-label-secondary);\n  font-size: 13px;\n}\n.mpd-loading {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 10px;\n  height: 160px;\n  margin: 0 24px;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 12.5px;\n}\n.mpd-spin {\n  width: 18px;\n  height: 18px;\n  border: 2px solid var(--dsw-alias-border-l2);\n  border-top-color: var(--dsw-alias-brand-primary);\n  border-radius: 50%;\n  animation: mpd-rot 0.7s linear infinite;\n}\n@keyframes mpd-rot {\n  to { transform: rotate(360deg); }\n}\n\n/* footer line */\n.mpd-foot {\n  display: flex;\n  align-items: center;\n  padding: 0 24px;\n}\n.mpd-foot-current {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  min-width: 0;\n  font-size: 12px;\n}\n.mpd-foot-label {\n  color: var(--dsw-alias-label-tertiary);\n  flex: none;\n}\n.mpd-foot-model {\n  color: var(--dsw-alias-label-primary);\n  font-weight: 500;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n/* effort menu extras */\n.mpd-eff-item {\n  display: inline-flex;\n  align-items: baseline;\n  gap: 6px;\n  min-width: 0;\n}\n.mpd-eff-detail {\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 12px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.mpd-eff-error {\n  color: var(--dsw-alias-state-error-primary);\n  font-size: 12.5px;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .mpd-spin {\n    animation-duration: 1.4s;\n  }\n}\n";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=\"dsh-model-picker/style.css\"]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-model-picker";
			tag.dataset.pluginCss = "dsh-model-picker/style.css";
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region src/client/index.tsx
		let clientCtx = null;
		/** Resolve an optional cordis service from the client root context. */
		function ctxGet(name) {
			return clientCtx ? clientCtx.get(name) : void 0;
		}
		const NS = "model-picker";
		const zh = {
			"title": "选择模型",
			"search.placeholder": "搜索模型名 / ID / 供应商…",
			"favs.only": "只看收藏",
			"favs.all": "显示全部",
			"empty.search": "没有匹配的模型",
			"empty.hint": "换个关键词试试",
			"empty.favs": "还没有收藏的模型",
			"empty.favsHint": "点击模型右侧的星标即可收藏",
			"empty.catalog": "模型目录为空",
			"loading": "正在加载模型目录…",
			"retry": "重试",
			"current": "当前",
			"noSelection": "尚未选择模型",
			"selectFailed": "切换失败",
			"effort.providerDefault": "默认",
			"effort.tip": "思考档位",
			"trigger.fallback": "选择模型",
			"trigger.tip": "选择模型",
			"close": "关闭",
			"clear": "清除搜索",
			"star.add": "收藏",
			"star.remove": "取消收藏",
			"unavailable": "当前会话不可切换模型",
			"group.toggle": "展开/收起"
		};
		const en = {
			"title": "Choose model",
			"search.placeholder": "Search model name / ID / provider…",
			"favs.only": "Favorites only",
			"favs.all": "Show all",
			"empty.search": "No matching models",
			"empty.hint": "Try another query",
			"empty.favs": "No favorites yet",
			"empty.favsHint": "Click the star on a model row to favorite it",
			"empty.catalog": "Model directory is empty",
			"loading": "Loading model directory…",
			"retry": "Retry",
			"current": "Current",
			"noSelection": "No model selected",
			"selectFailed": "Failed to switch",
			"effort.providerDefault": "Default",
			"effort.tip": "Thinking effort",
			"trigger.fallback": "Select model",
			"trigger.tip": "Select model",
			"close": "Close",
			"clear": "Clear search",
			"star.add": "Add to favorites",
			"star.remove": "Remove from favorites",
			"unavailable": "Model selection unavailable for this session",
			"group.toggle": "Expand / collapse"
		};
		let dialogSnapshot = {
			open: false,
			sessionId: null
		};
		const dialogListeners = /* @__PURE__ */ new Set();
		const subscribeDialog = (fn) => {
			dialogListeners.add(fn);
			return () => {
				dialogListeners.delete(fn);
			};
		};
		const getDialog = () => dialogSnapshot;
		function setDialog(open, sessionId) {
			dialogSnapshot = {
				open,
				sessionId: sessionId || null
			};
			for (const fn of dialogListeners) fn();
		}
		let effortSnapshot = {
			open: false,
			sessionId: null
		};
		const effortListeners = /* @__PURE__ */ new Set();
		const subscribeEffort = (fn) => {
			effortListeners.add(fn);
			return () => {
				effortListeners.delete(fn);
			};
		};
		const getEffort = () => effortSnapshot;
		function setEffortOpen(open, sessionId) {
			effortSnapshot = {
				open,
				sessionId: sessionId || null
			};
			for (const fn of effortListeners) fn();
		}
		const FAV_KEY = "dsh-model-picker.favorites";
		let favSnapshot = {
			ids: [],
			ready: false
		};
		const favListeners = /* @__PURE__ */ new Set();
		const subscribeFav = (fn) => {
			favListeners.add(fn);
			return () => {
				favListeners.delete(fn);
			};
		};
		const getFav = () => favSnapshot;
		const notifyFav = () => {
			for (const fn of favListeners) fn();
		};
		function loadFavs() {
			if (favSnapshot.ready) return;
			favSnapshot = {
				ids: favSnapshot.ids,
				ready: true
			};
			try {
				const raw = window.localStorage.getItem(FAV_KEY);
				if (raw !== null) {
					const data = JSON.parse(raw);
					if (Array.isArray(data)) favSnapshot = {
						ids: data.filter((x) => typeof x === "string"),
						ready: true
					};
				}
			} catch (err) {
				console.error("[model-picker] favorites load failed:", err);
			}
			notifyFav();
		}
		function toggleFav(key) {
			const ids = favSnapshot.ids.includes(key) ? favSnapshot.ids.filter((k) => k !== key) : favSnapshot.ids.concat([key]);
			favSnapshot = {
				ids,
				ready: true
			};
			notifyFav();
			try {
				window.localStorage.setItem(FAV_KEY, JSON.stringify(ids));
			} catch (err) {
				console.error("[model-picker] favorites save failed:", err);
			}
		}
		const collapsedSnapshots = /* @__PURE__ */ new Map();
		const collapsedListeners = /* @__PURE__ */ new Set();
		const subscribeCollapsed = (fn) => {
			collapsedListeners.add(fn);
			return () => {
				collapsedListeners.delete(fn);
			};
		};
		const getCollapsed = (sessionId) => {
			let set = collapsedSnapshots.get(sessionId);
			if (set === void 0) {
				set = /* @__PURE__ */ new Set();
				collapsedSnapshots.set(sessionId, set);
			}
			return set;
		};
		const setCollapsed = (sessionId, next) => {
			collapsedSnapshots.set(sessionId, next);
			for (const fn of collapsedListeners) fn();
		};
		function norm(s) {
			return String(s == null ? "" : s).toLowerCase();
		}
		function scoreOne(hay, needle) {
			const h = norm(hay);
			const n = norm(needle);
			if (n === "") return 0;
			if (h === n) return 0;
			if (h.indexOf(n) === 0) return 1;
			if (h.indexOf(n) !== -1) return 2;
			let i = 0;
			for (let j = 0; j < h.length && i < n.length; j++) if (h[j] === n[i]) i++;
			return i === n.length ? 3 : Infinity;
		}
		function tokenScore(fields, token) {
			let best = Infinity;
			for (const f of fields) {
				const s = scoreOne(f, token);
				if (s < best) best = s;
			}
			return best;
		}
		function buildRows(groups, query) {
			const rows = [];
			for (const group of groups) for (const model of group.models) rows.push({
				group,
				model
			});
			const tokens = norm(query).split(/\s+/).filter((s) => s !== "");
			if (tokens.length === 0) return rows;
			const scored = [];
			for (const row of rows) {
				const fields = [
					row.model.name,
					row.model.id,
					row.group.name,
					row.group.id
				];
				let total = 0;
				let ok = true;
				for (const tok of tokens) {
					const s = tokenScore(fields, tok);
					if (s === Infinity) {
						ok = false;
						break;
					}
					total += s;
				}
				if (ok) scored.push({
					row,
					total
				});
			}
			scored.sort((a, b) => a.total - b.total);
			return scored.map((x) => x.row);
		}
		function findHit(text, query) {
			const t = String(text == null ? "" : text);
			const tokens = norm(query).split(/\s+/).filter((s) => s !== "");
			for (const tok of tokens) {
				const idx = t.toLowerCase().indexOf(tok);
				if (idx !== -1) return {
					before: t.slice(0, idx),
					hit: t.slice(idx, idx + tok.length),
					after: t.slice(idx + tok.length)
				};
			}
			return null;
		}
		function StarIcon({ active }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				viewBox: "0 0 24 24",
				width: 15,
				height: 15,
				fill: active ? "currentColor" : "none",
				stroke: "currentColor",
				strokeWidth: 2,
				strokeLinecap: "round",
				strokeLinejoin: "round",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" })
			});
		}
		function Seat(props) {
			const t = props.t;
			const locked = props.locked === true;
			const sessionId = props.sessionId;
			const useSession = props.useSession;
			const subagent = useSession((s) => s ? s.subagent : null);
			const removed = useSession((s) => s ? s.removed : false);
			const [dir, setDir] = (0, react.useState)(null);
			const [supported, setSupported] = (0, react.useState)(true);
			const [effortError, setEffortError] = (0, react.useState)(null);
			(0, react.useEffect)(() => {
				const models = ctxGet("modelDirectories");
				if (models === void 0) {
					setSupported(false);
					return;
				}
				let d = null;
				try {
					d = models.directoryFor(sessionId);
				} catch (err) {
					setSupported(false);
					return;
				}
				setDir(d);
				if (subagent === null) d.load().catch(() => {});
				return () => {
					setDialog(false, null);
					setEffortOpen(false, null);
				};
			}, [sessionId]);
			const store = dir === null ? null : dir.store;
			const state = (0, react.useSyncExternalStore)((fn) => store === null ? () => {} : store.subscribe(fn), () => store === null ? null : store.getSnapshot());
			const dlg = (0, react.useSyncExternalStore)(subscribeDialog, getDialog);
			const eff = (0, react.useSyncExternalStore)(subscribeEffort, getEffort);
			const available = subagent === null;
			const disabled = locked || !available || removed || !supported;
			const current = state === null ? null : state.current;
			const groups = state === null ? [] : state.groups;
			const choices = (0, react.useMemo)(() => {
				const out = [];
				for (const group of groups) for (const model of group.models) {
					const selection = {
						provider: group.id,
						model: model.id
					};
					if (model.reasoning && model.reasoning.defaultEffort !== void 0) selection.reasoningEffort = model.reasoning.defaultEffort;
					out.push({
						group,
						model,
						selection
					});
				}
				return out;
			}, [groups]);
			let currentChoice;
			if (current !== null) currentChoice = choices.find((c) => c.selection.provider === current.provider && c.selection.model === current.model);
			const reasoning = currentChoice ? currentChoice.model.reasoning : void 0;
			let effectiveEffort;
			if (current !== null) effectiveEffort = current.reasoningEffort !== void 0 ? current.reasoningEffort : reasoning ? reasoning.defaultEffort : void 0;
			const dialogOpen = dlg.open && dlg.sessionId === sessionId;
			const effortOpen = eff.open && eff.sessionId === sessionId;
			const openDialog = () => {
				if (disabled) return;
				setEffortOpen(false, null);
				const models = ctxGet("modelDirectories");
				if (models === void 0) return;
				let d = null;
				try {
					d = models.directoryFor(sessionId);
				} catch (err) {
					return;
				}
				if (available) d.load().catch(() => {});
				loadFavs();
				setDialog(true, sessionId);
			};
			const pickEffort = (id) => {
				if (dir === null || current === null) return;
				const effort = id === "provider-default" ? void 0 : id.slice(7);
				const selection = {
					provider: current.provider,
					model: current.model
				};
				if (effort !== void 0) selection.reasoningEffort = effort;
				setEffortError(null);
				dir.select(selection).then(() => {
					setEffortOpen(false, null);
				}).catch(() => {
					setEffortError(t("selectFailed"));
				});
			};
			let modelLabel = current === null ? null : current.model;
			let modelCap = null;
			let modelTip = t("trigger.tip");
			if (currentChoice) {
				modelLabel = currentChoice.model.name;
				modelCap = currentChoice.group.name;
				modelTip = modelLabel + " · " + modelCap;
			} else if (current !== null) modelTip = current.provider + "/" + current.model;
			const modelBtn = /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
				label: modelTip,
				side: "top",
				disabled: disabled && !removed,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "mpd-trigger" + (disabled ? " is-disabled" : ""),
					onClick: openDialog,
					disabled,
					"aria-haspopup": "dialog",
					"aria-expanded": dialogOpen,
					"aria-label": t("trigger.tip") + (current ? "：" + (modelLabel || current.model) : ""),
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "mpd-trigger-label",
							children: current === null ? t("trigger.fallback") : modelLabel
						}),
						modelCap === null ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "mpd-trigger-cap",
							children: modelCap
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutline14, { className: "mpd-trigger-chev" + (dialogOpen ? " is-open" : "") })
					]
				})
			});
			const effortItems = [];
			const effortSelected = effectiveEffort === void 0 ? "provider-default" : "effort:" + effectiveEffort;
			if (reasoning) {
				if (reasoning.defaultEffort === void 0) effortItems.push({
					id: "provider-default",
					label: t("effort.providerDefault")
				});
				for (const e of reasoning.efforts) effortItems.push({
					id: "effort:" + e.id,
					label: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: "mpd-eff-item",
						children: [e.name, e.description ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "mpd-eff-detail",
							children: e.description
						}) : null]
					})
				});
			}
			let effortMenu = null;
			if (reasoning) {
				let effortLabel = effectiveEffort;
				if (effectiveEffort === void 0) effortLabel = t("effort.providerDefault");
				else for (const e of reasoning.efforts) if (e.id === effectiveEffort) {
					effortLabel = e.name;
					break;
				}
				const footerEntries = effortError === null ? void 0 : [{
					id: "error",
					label: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "mpd-eff-error",
						children: effortError
					}),
					disabled: true
				}];
				const effortTrigger = /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
					label: t("effort.tip"),
					side: "top",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "mpd-trigger" + (effortOpen ? " is-open" : "") + (disabled ? " is-disabled" : ""),
						onClick: () => {
							if (disabled) return;
							setDialog(false, null);
							setEffortOpen(!effortOpen, sessionId);
						},
						disabled,
						"aria-haspopup": "menu",
						"aria-expanded": effortOpen,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "mpd-trigger-label",
							children: effortLabel
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutline14, { className: "mpd-trigger-chev" + (effortOpen ? " is-open" : "") })]
					})
				});
				effortMenu = /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
					open: effortOpen,
					anchor: effortTrigger,
					items: effortItems,
					selectedId: effortSelected,
					footer: footerEntries,
					onSelect: pickEffort,
					onClose: () => {
						setEffortOpen(false, null);
					},
					align: "end",
					side: "top",
					portal: true,
					dense: true
				});
			}
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "mpd-seat",
				children: [
					modelBtn,
					effortMenu,
					dialogOpen ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
						open: true,
						onClose: () => setDialog(false, null),
						title: t("title"),
						closeLabel: t("close"),
						headless: true,
						className: "mpd-modal",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(DialogContent, {
							sessionId,
							t
						})
					}) : null
				]
			});
		}
		function DialogContent({ sessionId, t }) {
			const [dir, setDir] = (0, react.useState)(null);
			(0, react.useEffect)(() => {
				const models = ctxGet("modelDirectories");
				if (models === void 0) return;
				let d = null;
				try {
					d = models.directoryFor(sessionId);
				} catch (err) {
					return;
				}
				setDir(d);
			}, [sessionId]);
			const store = dir === null ? null : dir.store;
			const state = (0, react.useSyncExternalStore)((fn) => store === null ? () => {} : store.subscribe(fn), () => store === null ? null : store.getSnapshot());
			const favs = (0, react.useSyncExternalStore)(subscribeFav, getFav);
			const [query, setQuery] = (0, react.useState)("");
			const [favOnly, setFavOnly] = (0, react.useState)(false);
			const collapsed = (0, react.useSyncExternalStore)(subscribeCollapsed, () => getCollapsed(sessionId));
			const [cursor, setCursor] = (0, react.useState)(0);
			const [error, setError] = (0, react.useState)(null);
			const [busy, setBusy] = (0, react.useState)(false);
			const inputRef = (0, react.useRef)(null);
			const rowRefs = (0, react.useRef)([]);
			const listRef = (0, react.useRef)(null);
			const cursorByKeyboard = (0, react.useRef)(false);
			(0, react.useEffect)(() => {
				if (inputRef.current) inputRef.current.focus();
			}, []);
			const groups = state === null ? [] : state.groups;
			const current = state === null ? null : state.current;
			const status = state === null ? "loading" : state.status;
			const failures = state === null ? [] : state.failures;
			const loadErr = state === null ? null : state.error;
			const searching = query.trim() !== "";
			const favKey = (r) => r.group.id + "/" + r.model.id;
			const allRows = (0, react.useMemo)(() => {
				let list = buildRows(groups, query);
				if (favOnly) list = list.filter((r) => favSnapshot.ids.includes(favKey(r)));
				return list;
			}, [
				groups,
				query,
				favOnly,
				favs
			]);
			const keyboardRows = (0, react.useMemo)(() => {
				if (searching) return allRows;
				return allRows.filter((r) => !collapsed.has(r.group.id));
			}, [
				allRows,
				searching,
				collapsed
			]);
			(0, react.useEffect)(() => {
				cursorByKeyboard.current = false;
				setCursor(0);
				if (listRef.current) listRef.current.scrollTop = 0;
			}, [
				query,
				favOnly,
				collapsed,
				keyboardRows.length
			]);
			(0, react.useEffect)(() => {
				if (!cursorByKeyboard.current) return;
				const el = rowRefs.current[cursor];
				if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest" });
			}, [cursor]);
			const pick = (row) => {
				if (dir === null || busy) return;
				const selection = {
					provider: row.group.id,
					model: row.model.id
				};
				if (row.model.reasoning && row.model.reasoning.defaultEffort !== void 0) selection.reasoningEffort = row.model.reasoning.defaultEffort;
				setBusy(true);
				setError(null);
				dir.select(selection).then(() => {
					setDialog(false, null);
				}).catch(() => {
					setError(t("selectFailed"));
					setBusy(false);
				});
			};
			(0, react.useEffect)(() => {
				const onKey = (e) => {
					if (e.isComposing) return;
					if (e.key === "ArrowDown") {
						if (keyboardRows.length === 0) return;
						e.preventDefault();
						cursorByKeyboard.current = true;
						setCursor((c) => Math.min(c + 1, keyboardRows.length - 1));
						return;
					}
					if (e.key === "ArrowUp") {
						if (keyboardRows.length === 0) return;
						e.preventDefault();
						cursorByKeyboard.current = true;
						setCursor((c) => Math.max(c - 1, 0));
						return;
					}
					if (e.key === "Enter") {
						e.preventDefault();
						const row = keyboardRows[Math.min(cursor, keyboardRows.length - 1)];
						if (row) pick(row);
					}
				};
				document.addEventListener("keydown", onKey);
				return () => document.removeEventListener("keydown", onKey);
			});
			const stripMessages = [];
			if (error) stripMessages.push(error);
			if (loadErr) stripMessages.push(loadErr);
			for (const f of failures) stripMessages.push(f.name + ": " + f.message);
			const stripEl = stripMessages.length === 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "mpd-strip",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconWarningOutline16, { className: "mpd-strip-ico" }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: stripMessages[0] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "mpd-retry",
						onClick: () => {
							if (dir !== null) dir.load().catch(() => {});
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconRefreshOutline14, {}), t("retry")]
					})
				]
			});
			const rowEl = (row, i) => {
				const selected = current !== null && current.provider === row.group.id && current.model === row.model.id;
				const nameHit = findHit(row.model.name, query) ?? findHit(row.model.id, query);
				const fav = favSnapshot.ids.includes(favKey(row));
				let nameNode = row.model.name;
				if (nameHit) nameNode = /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
					nameHit.before,
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("mark", {
						className: "mpd-mark",
						children: nameHit.hit
					}),
					nameHit.after
				] });
				const subText = searching ? row.group.name + (row.model.description ? " · " + row.model.description : "") : row.model.description || "";
				return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					ref: (el) => {
						rowRefs.current[i] = el;
					},
					className: "mpd-row" + (selected ? " is-current" : "") + (i === cursor ? " is-cursor" : ""),
					onMouseEnter: () => {
						cursorByKeyboard.current = false;
						setCursor(i);
					},
					onMouseDown: (e) => {
						if (e.button === 0) pick(row);
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "mpd-row-main",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "mpd-row-name",
							children: nameNode
						}), subText === "" ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "mpd-row-sub",
							children: subText
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "mpd-row-side",
						children: [selected ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "mpd-check",
							title: t("current"),
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCheckOutline14, {})
						}) : null, /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mpd-star-btn" + (fav ? " is-fav" : ""),
							onMouseDown: (e) => {
								e.preventDefault();
								e.stopPropagation();
							},
							onClick: (e) => {
								e.stopPropagation();
								toggleFav(favKey(row));
							},
							title: fav ? t("star.remove") : t("star.add"),
							"aria-label": fav ? t("star.remove") : t("star.add"),
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(StarIcon, { active: fav })
						})]
					})]
				}, i);
			};
			const groupEl = (g, rowsOfGroup, startIndex, isCollapsed) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "mpd-group-head" + (isCollapsed ? " is-collapsed" : ""),
				onClick: () => {
					const prev = getCollapsed(sessionId);
					const next = new Set(prev);
					if (next.has(g.id)) next.delete(g.id);
					else next.add(g.id);
					setCollapsed(sessionId, next);
				},
				"aria-expanded": !isCollapsed,
				title: t("group.toggle") + "：" + g.name,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutline14, { className: "mpd-group-chev" }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "mpd-group-name",
						children: g.name
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "mpd-group-count",
						children: favOnly ? String(rowsOfGroup.length) + "/" + String(g.models.length) : String(g.models.length)
					})
				]
			}), isCollapsed ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "mpd-group-body",
				children: rowsOfGroup.map((row, i) => rowEl(row, startIndex + i))
			})] }, g.id);
			let bodyEl;
			if (status === "loading" && groups.length === 0) bodyEl = /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "mpd-loading",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: "mpd-spin" }), t("loading")]
			});
			else if (allRows.length === 0) {
				let emptyTitle = t("empty.catalog");
				let emptyHint = "";
				if (query) {
					emptyTitle = t("empty.search");
					emptyHint = t("empty.hint");
				} else if (favOnly) {
					emptyTitle = t("empty.favs");
					emptyHint = t("empty.favsHint");
				}
				bodyEl = /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "mpd-empty",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "mpd-empty-strong",
						children: emptyTitle
					}), emptyHint ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: emptyHint }) : null]
				});
			} else {
				let rowIndex = 0;
				const inner = [];
				if (searching) for (const row of keyboardRows) inner.push(rowEl(row, rowIndex++));
				else for (const g of groups) {
					const rowsOfGroup = allRows.filter((r) => r.group.id === g.id);
					if (rowsOfGroup.length === 0) continue;
					const isCollapsed = collapsed.has(g.id);
					inner.push(groupEl(g, rowsOfGroup, rowIndex, isCollapsed));
					rowIndex += isCollapsed ? 0 : rowsOfGroup.length;
				}
				bodyEl = /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					ref: listRef,
					className: "mpd-list",
					children: inner
				});
			}
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "mpd-modal-content",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "mpd-head",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
							className: "mpd-title",
							children: t("title")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "mpd-head-actions",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "mpd-fav-btn" + (favOnly ? " is-active" : ""),
								onClick: () => setFavOnly((v) => !v),
								title: favOnly ? t("favs.all") : t("favs.only"),
								"aria-pressed": favOnly,
								"aria-label": favOnly ? t("favs.all") : t("favs.only"),
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(StarIcon, { active: favOnly }), favOnly ? t("favs.all") : t("favs.only")]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "mpd-icon-btn",
								onClick: () => setDialog(false, null),
								title: t("close"),
								"aria-label": t("close"),
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, { size: 14 })
							})]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "mpd-search",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSearchOutline16, { className: "mpd-search-ico" }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								ref: inputRef,
								className: "mpd-search-input",
								value: query,
								onChange: (e) => setQuery(e.target.value),
								placeholder: t("search.placeholder"),
								spellCheck: false,
								autoComplete: "off"
							}),
							query === "" ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "mpd-clear",
								onClick: () => setQuery(""),
								"aria-label": t("clear"),
								title: t("clear"),
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, { size: 14 })
							})
						]
					}),
					stripEl,
					bodyEl,
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "mpd-foot",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "mpd-foot-current",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "mpd-foot-label",
								children: t("current")
							}), current === null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "mpd-foot-model",
								children: t("noSelection")
							}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "mpd-foot-model",
								children: current.provider + "/" + current.model
							})]
						})
					})
				]
			});
		}
		/**
		* Required services (cordis fiber inject): 'conversation' is an ordering
		* edge — 'conversation.input.model' is declared by ui-conversation's apply,
		* and register() into an undeclared slot throws.
		*/
		const inject = [
			"slots",
			"locale",
			"conversation",
			"modelDirectories"
		];
		/**
		* Client plugin body: register the `model-picker` dictionaries and the
		* composer model seat (trigger + effort menu + dialog).
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			clientCtx = ctx;
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "model-picker: dictionaries");
			ctx.inject([
				"slots",
				"locale",
				"conversation",
				"modelDirectories"
			], (scope) => {
				scope.effect(() => scope.slots.register({
					name: "conversation.input.model",
					priority: -1,
					registrant: "model-picker",
					locale: NS
				}, Seat), "model-picker: composer seat");
			});
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
