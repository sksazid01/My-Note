# Sanction Limit Save Workflow and Rate Payload Issue

## Text Render Source

The visible text `Funded Account Properties:` is rendered from:

- `src/app/modules/sanction/components/limit-tree/form/product-info/limit.product.info.component.html`

```html
<mat-card-title><span *ngIf="customProductGroupType === 'MIXED' || customProductGroupType === 'SINGLE_AND_NON_FUNDED'">Funded </span>Account Properties:</mat-card-title>
```

The same title also exists in the read-only/details view:

- `src/app/modules/sanction/components/limit-tree/details/limit.tree.view.component.html`

The edit screen in the screenshot is using the form component, not the details component.

## Important Components

- Save button and parent form: `limit.tree.form.component.html`
- Save workflow and payload assembly: `limit.tree.form.component.ts`
- Funded account properties UI and product form values: `product-info/limit.product.info.component.html`
- Funded account properties form controls: `product-info/limit.product.info.component.ts`
- API call service: `sanction.information.service.ts`

## Save Button Workflow

1. User clicks `Save Sanction`.

```html
<button data-elementName="saveSanctionBtn" (click)="done(true)" label="Save Sanction"></button>
```

File:

```text
src/app/modules/sanction/components/limit-tree/form/limit.tree.form.component.html
```

2. `done(true)` runs in `LimitTreeFormComponent`.

It does these main steps:

- Fetches root-to-base exchange rate if needed.
- Checks whether the selected node and product form are valid.
- Calls `updateLimitInformationFromFormValues(this.selectedNode)`.
- Calls `setSessionStorage()`.
- Checks invalid nodes.
- Checks charge/security validations.
- Opens confirmation dialog.
- Calls `saveSanction()` if confirmed.

3. `updateLimitInformationFromFormValues(node)` builds the selected node payload.

```ts
const limit = this.aggregateFormsValues();
node.data.limit = Object.assign(node.data.limit, limit);
```

4. `aggregateFormsValues()` merges two form value objects.

```ts
return {
  ...this.sanctionLimitInformationForm.value,
  ...this.productInfo.getFormValue()
};
```

5. `productInfo.getFormValue()` returns the product/account-properties form value.

Current code:

```ts
getFormValue() {
    return this.limitProductInfoForm.value;
}
```

6. `setSessionStorage()` updates the whole sanction object.

```ts
const changedSanctionLimit = LimitHelper.getTree(this.rootNode);
this.sanctionInformation.sanctionLimitInformation = changedSanctionLimit;
sessionStorage.setItem('sanctionInformation', JSON.stringify(this.sanctionInformation));
```

7. `saveSanction()` sends the network request.

For create:

```ts
this.sanctionInformationService.createSanctionInformation(sanctionInfo, urlSearchParams)
```

For amendment:

```ts
this.sanctionInformationService.amendmentSanctionInformation(...)
```

The create service method posts the whole `sanctionInformation` object:

```ts
return this.http.post(endpoints.CREATE_SANCTION_INFORMATION, sanctionInformation, options);
```

## Why Final Profit Rate Can Be Missing

In `limit.product.info.component.ts`, `profitRate` is created as a disabled reactive form control:

```ts
this.limitProductInfoForm.addControl(
  'profitRate',
  new FormControl({ value: sli.profitRate, disabled: true })
);
```

and in another product path:

```ts
this.limitProductInfoForm.addControl(
  'profitRate',
  new FormControl({ value: sli.profitRate || product.defaultRate, disabled: true })
);
```

Angular reactive forms exclude disabled controls from `form.value`.

So this method:

```ts
return this.limitProductInfoForm.value;
```

will not include `profitRate`, `referenceRate`, or `referenceRateName` when they are disabled.

That means `Final Profit Rate` can appear in the browser but disappear from the object passed into the network call.

## Why Account Rate May Also Be Missing

`accountRate` is normally created as an enabled control:

```ts
this.limitProductInfoForm.addControl('accountRate', new FormControl(sli.accountRate));
```

So `accountRate` should be included in `this.limitProductInfoForm.value`.

If `accountRate` is missing from the network request, check these paths:

1. `multiRate` is enabled.

When `multiRate` becomes true, the code clears `accountRate` and removes its validators:

```ts
this.limitProductInfoForm.get('accountRate').setValue(null);
this.limitProductInfoForm.get('accountRate').clearValidators();
this.limitProductInfoForm.get('profitRate').setValue(null);
this.limitProductInfoForm.get('profitRate').clearValidators();
```

2. The selected node was not updated as expected.

The value only reaches the request after this method runs:

```ts
updateLimitInformationFromFormValues(this.selectedNode)
```

Inside that method, the update is skipped if the form value modification id does not match the selected tree node:

```ts
if (limit && limit.modificationId !== node.data.modificationId) { return; }
```

3. The form is invalid.

The screenshot shows required errors. `done(true)` still calls `updateLimitInformationFromFormValues`, but later invalid-node checks can stop the API call. If no API call happens, the issue is validation. If the API call happens but rates are missing, the issue is payload assembly.

## Recommended Fix

Use `getRawValue()` when collecting product/account-properties form data.

Change:

```ts
getFormValue() {
    return this.limitProductInfoForm.value;
}
```

To:

```ts
getFormValue() {
    return this.limitProductInfoForm.getRawValue();
}
```

File:

```text
src/app/modules/sanction/components/limit-tree/form/product-info/limit.product.info.component.ts
```

This includes disabled controls such as `profitRate`, `referenceRate`, and `referenceRateName`.

## Safer Optional Fix

If the backend should not receive every disabled control, return only the needed disabled rate fields explicitly:

```ts
getFormValue() {
    return {
        ...this.limitProductInfoForm.value,
        profitRate: this.limitProductInfoForm.get('profitRate')?.value,
        referenceRate: this.limitProductInfoForm.get('referenceRate')?.value,
        referenceRateName: this.limitProductInfoForm.get('referenceRateName')?.value
    };
}
```

Use this version if there are disabled UI-only fields that must not be submitted.

## Debug Checklist

Add temporary breakpoints or logs at these points:

1. `productInfo.getFormValue()`

Check whether it contains:

```text
accountRate
profitRate
```

2. `aggregateFormsValues()`

Check the merged `limit` object.

3. `updateLimitInformationFromFormValues(node)`

Check `node.data.limit.accountRate` and `node.data.limit.profitRate` after `Object.assign`.

4. `setSessionStorage()`

Check `this.sanctionInformation.sanctionLimitInformation`.

5. Browser network request payload.

Check:

```text
sanctionLimitInformation.accountRate
sanctionLimitInformation.profitRate
```

## Summary

The title comes from `limit.product.info.component.html`.

The save button calls `done(true)`, then updates the selected tree node, rebuilds `sanctionInformation.sanctionLimitInformation`, and posts the full sanction object.

The likely root cause for missing `Final Profit Rate` is that the component uses `form.value`, while `profitRate` is disabled. Angular excludes disabled controls from `form.value`. Use `getRawValue()` or explicitly add disabled rate fields in `getFormValue()`.
