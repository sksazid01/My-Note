## `ngOnChanges` in Angular

`ngOnChanges` is a **lifecycle hook** that runs whenever an `@Input()` property changes in a component.

### How It Works

```
Parent Component
     │
     │  @Input() address = newValue   ← parent changes this
     ▼
Child Component
     │
     ▼
ngOnChanges(changes) fires automatically
```

### Breaking Down Your Code

```typescript
ngOnChanges(changes: SimpleChanges): void {
```
`SimpleChanges` is an object containing all changed inputs, keyed by property name.

```typescript
  if (changes['address']
```
Checks if specifically the `address` input was part of this change cycle (other inputs may have changed too).

```typescript
    && changes['address'].currentValue) {
```
Checks that the new value is not `null`/`undefined`/falsy.

```typescript
      this.prepareForm(this.address);
    }
  }
```
Only rebuilds the form when a real address value arrives.

### The `SimpleChanges` Object

Each entry gives you:

| Property | Description | Example |
|---|---|---|
| `currentValue` | The new value | `{ street: '123 Main' }` |
| `previousValue` | The old value | `undefined` |
| `firstChange` | Is this the first time? | `true` / `false` |

### Common Patterns

```typescript
ngOnChanges(changes: SimpleChanges): void {
  const addressChange = changes['address'];

  if (addressChange) {
    // First time the input is set
    if (addressChange.firstChange) {
      this.initializeForm(addressChange.currentValue);
      return;
    }

    // Subsequent updates — only if value actually differs
    if (addressChange.currentValue !== addressChange.previousValue) {
      this.prepareForm(addressChange.currentValue);
    }
  }
}
```

### Key Rules

- The component must implement `OnChanges` interface
- `ngOnChanges` fires **before** `ngOnInit` on the first change
- Only triggered by `@Input()` changes — internal property changes do NOT trigger it
- For object/array inputs, it only detects **reference changes**, not deep mutations

```typescript
// ✅ triggers ngOnChanges (new reference)
this.address = { ...this.address, street: 'New St' };

// ❌ does NOT trigger ngOnChanges (same reference)
this.address.street = 'New St';
```



## How `.get()` Works in Angular Reactive Forms

### What `.get()` Does

`.get()` is a method on `FormGroup` that **retrieves a specific control** by its name (or path).

```typescript
this.addressForm          // the FormGroup
    .get('countryId')     // returns the FormControl named 'countryId'
    .valueChanges         // Observable that emits on every value change
    .subscribe(...)       // react to those changes
```

---

### The Form Structure Behind It

Your `addressForm` is likely built like this:

```typescript
this.addressForm = this.fb.group({
  countryId:  [null, Validators.required],
  divisionId: [null],
  cityId:     [null],
  street:     [''],
});
```

`.get('countryId')` reaches into the group and hands back that one `FormControl`.

---

### What `.get()` Returns

| Scenario | Returns |
|---|---|
| Control found | `AbstractControl` (FormControl / FormGroup / FormArray) |
| Control not found | `null` |

Since it returns `AbstractControl`, you get access to:

```typescript
.get('countryId').value          // current value
.get('countryId').valueChanges   // Observable of changes
.get('countryId').statusChanges  // Observable of validity changes
.get('countryId').valid          // boolean
.get('countryId').setValue(x)    // set a value
.get('countryId').reset()        // reset the control
```

---

### The Full Flow of Your Code

```typescript
this.addressForm.get('countryId')   // 1. grab the control
    .valueChanges                   // 2. tap into its Observable stream
    .subscribe(() => {              // 3. every time user picks a country...
        this.clearCountryDependentFields();  // 4. wipe division/city fields
        this.fetchDivisions();               // 5. load new divisions
    });
```

```
User selects a country
        │
        ▼
FormControl emits new value
        │
        ▼
valueChanges Observable fires
        │
        ├──▶ clearCountryDependentFields()  → resets divisionId, cityId
        └──▶ fetchDivisions()               → API call with new countryId
```

---

### Accessing the New Value in Subscribe

The callback receives the emitted value directly:

```typescript
this.addressForm.get('countryId')
    .valueChanges
    .subscribe((newCountryId) => {        // ← value passed here
        this.fetchDivisions(newCountryId); // use it directly
    });
```

---

### Nested Path Access

`.get()` also supports **dot notation** for nested form groups:

```typescript
this.addressForm = this.fb.group({
  location: this.fb.group({
    countryId: [null],
    city: ['']
  })
});

// Access nested control
this.addressForm.get('location.countryId')   // dot path
this.addressForm.get(['location', 'countryId']) // array path
```

---

### Safe Access (Avoiding null errors)

Since `.get()` can return `null`, a safer pattern is:

```typescript
this.addressForm.get('countryId')?.valueChanges
    .subscribe(() => {
        this.clearCountryDependentFields();
        this.fetchDivisions();
    });
```

The `?.` prevents a crash if the control name has a typo or doesn't exist yet.


## Breaking Down `resetControl()`

### The Method Itself

```typescript
resetControl(controls: string[]) {
```
Accepts an **array of strings** — each string is a form control name.

---

### Guard Clause

```typescript
if (!controls || !controls.length) { return; };
```

Two safety checks before doing anything:

| Check | Protects Against |
|---|---|
| `!controls` | `null` or `undefined` being passed in |
| `!controls.length` | Empty array `[]` being passed in |

If either is true → **bail out early**, do nothing.

---

### The Loop

```typescript
controls.forEach(control => {
    this.addressForm.get(control).reset();
});
```

Iterates over each string name → finds the control → resets it.

```
['divisionId', 'cityId']
       │
       ▼
  loop iteration 1 → addressForm.get('divisionId').reset()
  loop iteration 2 → addressForm.get('cityId').reset()
```

### What `.reset()` Does to a Control

```typescript
this.addressForm.get('divisionId').reset();
```

| Property | Before reset | After reset |
|---|---|---|
| `value` | `'some-id'` | `null` |
| `dirty` | `true` | `false` |
| `touched` | `true` | `false` |
| `valid/invalid` | depends | re-evaluated |

---

### How It's Used

```typescript
private clearCountryDependentFields(): void {
    this.clearDivisionDependentFields();  // 1. clear city-level fields first
    this.resetControl(['divisionId']);    // 2. then reset division control
    this.divisions = [];                  // 3. clear the divisions dropdown list
}
```

### The Cascade Pattern

```
User changes Country
        │
        ▼
clearCountryDependentFields()
        │
        ├──▶ clearDivisionDependentFields()
        │           │
        │           └──▶ resetControl(['cityId', ...])  ← city depends on division
        │
        ├──▶ resetControl(['divisionId'])   ← division depends on country
        │
        └──▶ this.divisions = []           ← empty the dropdown options
```

Clears **bottom-up** — city first, then division — so dependent fields are always wiped before their parents.

---

### Why an Array Instead of a Single String

Reusable for resetting **one or many** controls with the same method:

```typescript
// reset one
this.resetControl(['divisionId']);

// reset many at once
this.resetControl(['divisionId', 'cityId', 'streetId']);

// vs doing it manually each time — messy
this.addressForm.get('divisionId').reset();
this.addressForm.get('cityId').reset();
this.addressForm.get('streetId').reset();
```


## Does Change Detection Fire Automatically?

**Yes** — automatically, thanks to **Zone.js**

---

## What is Zone.js?

Angular ships with a library called **Zone.js** that **monkey-patches** (wraps) all async browser APIs and intercepts them.

```
Zone.js wraps:
├── setTimeout / setInterval
├── HTTP requests (fetch, XMLHttpRequest)
├── DOM events (click, input, change)
├── Promises
└── Observable subscriptions
```

So whenever any of these happen, Zone.js **notifies Angular** → Angular runs Change Detection.

---

## The Automatic Flow

```
Any of these happen:
├── User clicks a button
├── User types in input
├── HTTP response arrives
├── setTimeout fires
└── Promise resolves
        │
        ▼
Zone.js intercepts it
        │
        ▼
Notifies Angular: "something happened!"
        │
        ▼
Angular runs Change Detection automatically
        │
        ▼
DOM updates ✅
```

---

## Real Example

```typescript
// .ts file
divisions: any[] = [];

fetchDivisions() {
  this.http.get('/api/divisions')
    .subscribe(data => {
      this.divisions = data;   // ← you just assign the value
      // NO need to manually trigger anything
      // Zone.js sees the HTTP response arrived
      // Angular automatically runs Change Detection
      // *ngFor in HTML re-renders automatically ✅
    });
}
```

---

## When It Does NOT Fire Automatically

Some cases Zone.js **cannot** detect:

```typescript
// ❌ Change outside Angular zone
this.divisions = [];   // inside setTimeout from 3rd party lib

// ❌ Manual object mutation (same reference)
this.divisions.push(newItem);  // sometimes not detected
// ✅ fix: reassign reference
this.divisions = [...this.divisions, newItem];
```

---

## Manually Triggering Change Detection

For those edge cases, Angular provides manual options:

```typescript
import { ChangeDetectorRef } from '@angular/core';

constructor(private cdr: ChangeDetectorRef) {}

// Option 1 — check and update this component
this.cdr.detectChanges();

// Option 2 — mark as dirty, update on next cycle
this.cdr.markForCheck();
```

---

## Running Outside Zone (Performance)

Sometimes you want to **skip** Change Detection for heavy tasks:

```typescript
import { NgZone } from '@angular/core';

constructor(private ngZone: NgZone) {}

// run outside zone = no Change Detection triggered
this.ngZone.runOutsideAngular(() => {
  setInterval(() => {
    // heavy calculation — won't trigger Change Detection
  }, 100);
});

// bring back inside zone when you need UI update
this.ngZone.run(() => {
  this.result = finalValue;  // now Change Detection fires ✅
});
```

---

## Summary

| Trigger | Auto? | Why |
|---|---|---|
| User clicks/types | ✅ Yes | Zone.js wraps DOM events |
| HTTP response | ✅ Yes | Zone.js wraps fetch/XHR |
| setTimeout fires | ✅ Yes | Zone.js wraps timers |
| Promise resolves | ✅ Yes | Zone.js wraps Promises |
| 3rd party lib changes | ❌ No | Outside Angular's zone |
| Same object reference mutation | ❌ No | Zone.js can't detect it |
| `runOutsideAngular()` | ❌ No | Intentionally skipped |

> **Zone.js is the magic** that makes Angular "just work" without you manually telling it to update the UI every time.
