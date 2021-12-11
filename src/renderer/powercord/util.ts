import {DiscordModules} from "@modules";

export const sleep = (time) => new Promise(f => setTimeout(f, time));

export function findInTree(tree = {}, filter = _ => _, {ignore = [], walkable = [], maxProperties = 100} = {}): any {
    let stack = [tree];
    const wrapFilter = function (...args) {
        try { return Reflect.apply(filter, this, args); }
        catch { return false; }
    };

    while (stack.length && maxProperties) {
        const node = stack.shift();
        if (wrapFilter(node)) return node;
        if (Array.isArray(node)) stack.push(...node);
        else if (typeof node === "object" && node !== null) {
            if (walkable.length) {
                for (const key in node) {
                    const value = node[key];
                    if (~walkable.indexOf(key) && !~ignore.indexOf(key)) {
                        stack.push(value);
                    }
                }
            } else {
                for (const key in node) {
                    const value = node[key];
                    if (node && ~ignore.indexOf(key)) continue;

                    stack.push(value);
                }
            }
        }
        maxProperties--;
    }
};

export function findInReactTree(tree, filter, options = {}) {
    return findInTree(tree, filter, {...options, walkable: ["props", "children"]});
};

export function getReactInstance(node: any) {
    return node["__reactFiber$"];
};

export function getOwnerInstance(node, filter = _ => true) {
    if (!node) return null;
    const fiber = getReactInstance(node);
    let current = fiber;

    const matches = function () {
        const isInstanceOf = current?.stateNode instanceof DiscordModules.React.Component;
        return isInstanceOf && filter(current?.stateNode);
    }

    while (!matches()) {
        current = current?.return;
    }

    return current?.stateNode ?? null;
};

export function forceUpdateElement(selector: string) {
    getOwnerInstance(document.querySelector(selector))?.forceUpdate();
};

export async function waitFor(selector: string) {
    let element;

    while (!(element = document.querySelector(selector))) {
        await sleep(1);
    }

    return element;
};