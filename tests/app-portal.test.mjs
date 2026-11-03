import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
const source = readFileSync(
  new URL("../assets/app-portal.js", import.meta.url),
  "utf8",
);
function fixture({
  reduced = false,
  saveData = false,
  failVisual = false,
} = {}) {
  const handlers = {},
    events = {},
    timers = [],
    prefetched = [],
    navigations = [];
  const classes = new Set();
  const classList = {
    add: (c) => classes.add(c),
    remove: (c) => classes.delete(c),
  };
  const link = {
    href: "http://localhost/app",
    target: "",
    classList,
    addEventListener: (name, fn) => {
      handlers[name] = fn;
    },
    hasAttribute: () => false,
    getBoundingClientRect: () => {
      if (failVisual) throw Error("visual unavailable");
      return { left: 20, top: 10, width: 80, height: 44 };
    },
  };
  const document = {
    querySelectorAll: () => [link],
    head: { append: (e) => prefetched.push(e) },
    body: { classList, append: () => {} },
    getElementById: () => null,
    createElement: () => ({
      style: { setProperty() {} },
      setAttribute() {},
      remove() {},
    }),
  };
  runInNewContext(source, {
    document,
    window: {
      matchMedia: () => ({ matches: reduced }),
      location: { assign: (href) => navigations.push(href) },
      addEventListener: (name, fn) => {
        events[name] = fn;
      },
    },
    navigator: { connection: { saveData } },
    sessionStorage: { setItem() {} },
    setTimeout: (fn, delay) => {
      timers.push({ fn, delay });
      return timers.length;
    },
    clearTimeout() {},
    Date,
  });
  const click = (modifiers) => {
    let prevented = false;
    handlers.click({
      button: 0,
      preventDefault: () => {
        prevented = true;
      },
      ...modifiers,
    });
    return prevented;
  };
  return { handlers, events, timers, prefetched, navigations, classes, click };
}
test("prefetches only one document and one critical photo on intent", () => {
  const f = fixture();
  f.handlers.focus();
  f.handlers.pointerenter();
  assert.deepEqual(
    f.prefetched.map((e) => e.href),
    ["/app/", "/app/images/competitions/ecole-verticale.png"],
  );
  const saver = fixture({ saveData: true });
  saver.handlers.focus();
  assert.equal(saver.prefetched.length, 0);
});
test("modified clicks retain native navigation", () => {
  for (const modifier of ["metaKey", "ctrlKey", "shiftKey", "altKey"]) {
    const f = fixture();
    assert.equal(f.click({ [modifier]: true }), false);
    assert.equal(f.timers.length, 0);
  }
});
test("reduced motion preserves immediate navigation with no visual delay", () => {
  const f = fixture({ reduced: true });
  assert.equal(f.click(), false);
  assert.equal(f.timers.length, 0);
  assert.equal(f.classes.has("pi-portal-departure"), false);
});
test("normal activation uses the native link and cleans up on Back", () => {
  const f = fixture();
  assert.equal(f.click(), false);
  assert.equal(f.timers[0].delay, 1100);
  assert.deepEqual(f.navigations, []);
  assert.equal(f.classes.has("pi-portal-departure"), true);
  f.events.pageshow();
  assert.equal(f.classes.has("pi-portal-departure"), false);
});
test("a failed visual still navigates", () => {
  const f = fixture({ failVisual: true });
  assert.equal(f.click(), false);
  assert.deepEqual(f.navigations, []);
});
