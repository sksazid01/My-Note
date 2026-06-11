# PrimeNG SelectButton Angular 17 Migration Note

## Core Issue

This is not an Angular form bug. The behavior changed because the project moved from the old PrimeNG SelectButton implementation to PrimeNG 17.

In PrimeNG 17, `p-selectButton` has this default:

```ts
allowEmpty = true;
```

That means clicking the currently selected button clears the value and writes `null`. Visually, no option has `.p-highlight`, so both buttons can look deselected.

In the old Angular 6 version, the same screen behaved like a required radio group: one option stayed selected. The old theme also styled selected and unselected buttons differently, so both buttons appeared colored.

## Affected Local Usages

```html
src/app/modules/admin/components/sanction-branch-limit-config/form2/branch.product.limit.config.form.component.html
```

```html
src/app/modules/sanction/components/sanction-list/sanction.list.component.html
```

```html
src/app/modules/sanction/components/sancion-form/form/collateral-reference-mapping/components/collateral.reference.mapping.component.html
```

## Minimal Behavior Fix

Use `[allowEmpty]="false"` when the SelectButton must always keep one selected value.

```html
<p-selectButton
    [options]="maxLimitTypes"
    formControlName="maxLimitType"
    [allowEmpty]="false"
    (onChange)="onMaxLimitTypeSelect($event.value)">
</p-selectButton>
```

This is the smallest correct fix for the deselect issue.

## Minimal Event Fix

Prefer PrimeNG's `(onChange)` instead of DOM `(click)`.

Before:

```html
<p-selectButton
    [options]="maxLimitTypes"
    #maxLimitType
    formControlName="maxLimitType"
    (click)="onMaxLimitTypeSelect(maxLimitType.value)">
</p-selectButton>
```

After:

```html
<p-selectButton
    [options]="maxLimitTypes"
    formControlName="maxLimitType"
    [allowEmpty]="false"
    (onChange)="onMaxLimitTypeSelect($event.value)">
</p-selectButton>
```

Why: `(click)` can run before or outside the final PrimeNG value update. `(onChange)` receives the actual selected value from PrimeNG.

## Defensive TypeScript Fix

If existing code treats every non-first value as the second option, guard against `null`.

Before:

```ts
onMaxLimitTypeSelect(maxLimitType) {
    if (maxLimitType === 'PRODUCT_MAX_LIMIT') {
        this.branchProductLimitConfigForm.get('useProductMaxLimit').setValue(true);
    } else {
        this.branchProductLimitConfigForm.get('useProductMaxLimit').setValue(false);
    }
}
```

After:

```ts
onMaxLimitTypeSelect(maxLimitType) {
    if (!maxLimitType) {
        return;
    }

    if (maxLimitType === 'PRODUCT_MAX_LIMIT') {
        this.branchProductLimitConfigForm.get('useProductMaxLimit').setValue(true);
    } else if (maxLimitType === 'INDIVIDUAL_MAX_LIMITS') {
        this.branchProductLimitConfigForm.get('useProductMaxLimit').setValue(false);
    }
}
```

This is optional if `[allowEmpty]="false"` is always applied, but it protects the form from future template regressions.

## Minimal Color Fix

PrimeNG 17 uses `.p-highlight` for the selected button. If the expected old UI is:

- selected: yellow-green
- unselected: teal/bluish

then add a local style scoped to the affected component.

```ts
@Component({
    selector: 'branch-product-limit-config',
    templateUrl: './branch.product.limit.config.form.component.html',
    styles: [`
        :host ::ng-deep p-selectbutton.select-button > .p-selectbutton > .p-button {
            background: #009688;
            border-color: #009688;
            color: #ffffff;
        }

        :host ::ng-deep p-selectbutton.select-button > .p-selectbutton > .p-button:not(.p-disabled):not(.p-highlight):hover {
            background: #00897b;
            border-color: #00897b;
            color: #ffffff;
        }

        :host ::ng-deep p-selectbutton.select-button > .p-selectbutton > .p-button.p-highlight {
            background: #cde62e;
            border-color: #cde62e;
            color: #000000;
        }

        :host ::ng-deep p-selectbutton.select-button > .p-selectbutton > .p-button.p-highlight:hover {
            background: #c4dc28;
            border-color: #c4dc28;
            color: #000000;
        }
    `]
})
```

This keeps the change inside `src/app/modules` and avoids a global `src/styles.scss` override.

## Possible Minimal Solutions

### Solution 1: Behavior only

Add only:

```html
[allowEmpty]="false"
```

Use this when the current theme color is acceptable and the only issue is full deselection.

### Solution 2: Behavior plus correct event

Add:

```html
[allowEmpty]="false"
(onChange)="handler($event.value)"
```

Remove:

```html
(click)="handler(templateRef.value)"
```

Use this when the handler depends on the selected value.

### Solution 3: Behavior plus old color parity

Add `[allowEmpty]="false"` in the template and local component styles for `.p-button` and `.p-highlight`.

Use this when Angular 17 must visually match the Angular 6 screenshot.

### Solution 4: Reusable module-level CSS

Create a SCSS file under `src/app/modules`, import it from module-owned styles, and put the same `p-selectbutton.select-button` rules there.

Use this only if many module screens need the same old SelectButton look.

### Solution 5: Handler guard only

Add a `null` guard in the TypeScript handler.

Use this only as a safety net. It does not stop the UI from briefly clearing unless `[allowEmpty]="false"` is also used.

## Recommended Minimal Patch

For required single-select buttons:

```html
<p-selectButton
    class="select-button"
    [options]="options"
    formControlName="controlName"
    [allowEmpty]="false"
    (onChange)="onSelect($event.value)">
</p-selectButton>
```

If old Angular 6 color parity is required, add local component styles targeting:

```scss
:host ::ng-deep p-selectbutton.select-button > .p-selectbutton > .p-button
:host ::ng-deep p-selectbutton.select-button > .p-selectbutton > .p-button.p-highlight
```

## What Not To Do

Do not fix this in `src/styles.scss` unless the whole application intentionally wants all SelectButtons to use the old Angular 6 color behavior.

Do not rely on `Validators.required` alone. It marks the form invalid after the value becomes `null`, but it does not prevent PrimeNG from clearing the selected button.

Do not use DOM `(click)` when PrimeNG already provides `(onChange)` with the actual selected value.
