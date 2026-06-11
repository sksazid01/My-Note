## `#maxLimitType` — Template Reference Variable

In the old code:
```html
<p-selectButton #maxLimitType ...>
```
`#maxLimitType` is a **template reference variable** — it gives you a direct reference to the `p-selectButton` component instance in the template.

It was used to **manually grab the value**:
```html
(click)="onMaxLimitTypeSelect(maxLimitType.value)"
```
So `maxLimitType.value` reads the selected value **directly from the component instance**.

---

## Why It Was Needed in PrimeNG 6

In PrimeNG 6, `(click)` is a **native DOM event** — it fires on every click but **doesn't give you the selected value automatically**. So `#maxLimitType` was a workaround to grab the value manually.

---

## Why It's Removed in PrimeNG 17

In PrimeNG 17, `(onChange)` is a **PrimeNG event** that automatically provides the selected value:
```html
(onChange)="onMaxLimitTypeSelect($event.value)"
```
`$event.value` already contains the selected value — so there's **no need** to reference the component manually via `#maxLimitType`.

---

## Side-by-Side

| | PrimeNG 6 | PrimeNG 17 |
|---|---|---|
| Event | `(click)` — native DOM | `(onChange)` — PrimeNG event |
| Get value | `#maxLimitType.value` — manual ref | `$event.value` — automatic |
| Template ref needed | ✅ Yes | ❌ No |

---

## Short Answer

> `#maxLimitType` was a **workaround** to read the value manually because `(click)` doesn't provide it. In PrimeNG 17, `(onChange)` provides `$event.value` directly — making the template reference variable completely unnecessary.
