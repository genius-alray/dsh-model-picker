//#region src/index.ts
/**
* Model Picker Dialog plugin, node half. Pure UI plugin: the empty apply
* exists so the plugin appears in the host cordis.yml / Loader; the browser
* half ships via exports["./client"], discovered through the package.json
* dsh.client declaration. Favorites persist in the browser (localStorage),
* so the host side carries no runtime state.
*/
/** Host plugin body — no host-side behavior for this surface plugin. */
function apply() {}
//#endregion
export { apply };
