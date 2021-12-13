import {promise} from "@modules/discord";
import {getSettings} from "@powercord/classes/settings";

export let store = null;

export let settings = new Map();

export let tabs = settings;

Object.defineProperty(settings, "hasOwnProperty", {
    value: settings.has.bind(settings),
    configurable: true,
    writable: false
});

promise.then(() => {
    store = Object.assign(getSettings("powercord"), {
        // powerCord momento
        _fluxProps(id: string) {return getSettings(id).makeProps();}
    });
});

export function registerSettings(id: string, options: any) {
    id = id || options.category;

    options.render = connectStores(id)(options.render);
    settings.set(id, options);
};

export function unregisterSettings(id: string) {
    settings.delete(id);
};

export function _fluxProps(id: string) {
    return getSettings(id)?.makeProps();
};


export function connectStores(id: string) {
    return getSettings(id)?.connectStore();
};