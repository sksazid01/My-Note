# Branch Product Limit Config `getRawValue()` QA Notes

## Changed Code

File:

`src/app/modules/admin/components/sanction-branch-limit-config/form2/branch.product.limit.config.form.component.ts`

Staged Git change:

```ts
- newConfig = this.branchProductLimitConfigForm.value;
+ newConfig = this.branchProductLimitConfigForm.getRawValue();
```

This change affects the save payload. Angular `form.value` excludes disabled controls, but `form.getRawValue()` includes disabled controls.

## Main Checking Rule

The issue search should focus on disabled controls inside `branchProductLimitConfigForm`.

Current form controls:

```ts
branchId
branchIdList
allProducts
useProductMaxLimit
maxLimitType
```

Disabled controls:

```ts
branchId: disabled when createMode && !configId
branchIdList: disabled when configId exists
```

## Field Impact Analysis

| Field | Disabled Condition | Included Before With `form.value` | Included Now With `getRawValue()` | Risk |
| --- | --- | --- | --- | --- |
| `branchId` | Create mode when `configId` is absent | No | Yes | Medium |
| `branchIdList` | Edit/update mode when `configId` exists | No | Yes | Low to Medium |
| `allProducts` | Not disabled | Yes | Yes | No direct change |
| `useProductMaxLimit` | Not disabled | Yes | Yes | No direct change |
| `maxLimitType` | Not disabled | Yes | Yes | Existing payload field, not caused by this change |
| `productsLimit` | Not part of reactive form, assigned manually | Yes, assigned manually | Yes, assigned manually | No direct change |

## Potential Issues

### 1. Create Payload May Include Disabled `branchId`

In create mode, `branchId` is disabled:

```ts
branchId: new FormControl({ value: formData.branchId, disabled: this.createMode && !this.configId }, Validators.required)
```

Before this change, create payload did not include `branchId`.

After this change, create payload includes `branchId`, usually as `null`.

Possible problem:

```json
{
  "branchId": null,
  "branchIdList": [101, 102],
  "allProducts": false,
  "useProductMaxLimit": true,
  "maxLimitType": "PRODUCT_MAX_LIMIT",
  "productsLimit": [...]
}
```

If backend create logic expects only `branchIdList`, the extra `branchId: null` may be harmless. If backend validation rejects null fields or chooses `branchId` over `branchIdList`, create can fail or create wrong data.

### 2. Copy Configuration Flow Can Put a Value Into Disabled `branchId`

In copy config flow:

```ts
selectedConfig.branchId = this.configBranchId ? this.configBranchId : null;
this.prepareForm(selectedConfig);
```

Then create-mode `branchId` remains disabled, but `getRawValue()` will include it.

This is the most important QA case.

Possible problem:

```json
{
  "branchId": 55,
  "branchIdList": [101],
  "allProducts": true,
  "useProductMaxLimit": true,
  "productsLimit": [...]
}
```

If `branchId` and `branchIdList` point to different branches, backend behavior can become incorrect or ambiguous.

### 3. Update Payload May Include Disabled `branchIdList`

In edit mode, `branchIdList` is disabled:

```ts
branchIdList: new FormControl({ value: formData.branchIdList, disabled: this.configId }, Validators.required)
```

Before this change, update payload did not include `branchIdList`.

After this change, update payload can include `branchIdList`.

Most fetched edit data likely uses `branchId`, not `branchIdList`, so this may become `undefined` and may not appear in JSON. But if correction/task payload includes `branchIdList`, update payload shape can change.

Possible problem:

```json
{
  "branchId": 101,
  "branchIdList": [101, 102],
  "allProducts": false,
  "useProductMaxLimit": false,
  "productsLimit": [...]
}
```

Backend update may reject `branchIdList`, ignore it, or accidentally process it.

### 4. `maxLimitType` Is Still Sent

`maxLimitType` is a UI helper field. It maps to `useProductMaxLimit`.

This field was already included before because it is enabled, so it is not a new `getRawValue()` issue.

Still, during QA, confirm backend ignores it safely.

## QA Workflow

Use browser DevTools Network tab and inspect the request body for `POST /limit-config` and `PUT /limit-config/{configId}`.

For every test, compare these payload fields:

```text
branchId
branchIdList
allProducts
useProductMaxLimit
maxLimitType
productsLimit
```

## UI Test Cases

### Case 1: Normal Create With Selected Branches

Goal: Check whether disabled `branchId` is submitted as `null`.

Steps:

1. Open Branch Product Limit Configuration create page.
2. Do not enable copy configuration.
3. Select one or more branches from Branch multi-select.
4. Select one or more products.
5. Keep `Use Product Max Limit`.
6. Click Save.
7. Inspect create request payload.

Expected:

```json
{
  "branchIdList": ["selected branch ids"],
  "productsLimit": ["selected products"]
}
```

Check carefully:

```text
Does payload now include branchId: null?
Does backend accept it?
Is configuration created for all selected branches?
```

Create an issue if:

```text
Save fails because branchId is null.
Only one branch is configured.
Wrong branch is configured.
Backend validation error mentions branchId.
```

### Case 2: Create With Copy Configuration Enabled

Goal: Check whether copied config puts stale/wrong value into disabled `branchId`.

Steps:

1. Open create page.
2. Enable `Copy configuration from another branch`.
3. Select a configured branch from the dropdown.
4. Select target branch from Branch multi-select if required by UI.
5. Click Save.
6. Inspect create request payload.

Check carefully:

```text
Does branchId appear?
Does branchId match copied branch, target branch, or null?
Does branchIdList contain the actual selected target branches?
```

Create an issue if:

```text
The new config is created for copied/source branch instead of target branch.
Payload has branchId and branchIdList with conflicting values.
Backend rejects the request due to branchId/branchIdList conflict.
```

### Case 3: Create, Toggle Copy On Then Off

Goal: Check whether disabled field data is cleared after changing UI state.

Steps:

1. Open create page.
2. Enable copy configuration.
3. Select a configured branch.
4. Disable copy configuration.
5. Select fresh branches and products manually.
6. Click Save.
7. Inspect payload.

Expected:

```text
branchId should be null or absent.
branchIdList should contain only manually selected target branches.
productsLimit should match manually selected products.
```

Create an issue if:

```text
Payload still contains copied branchId.
Copied products remain after copy is turned off.
Wrong branch/product configuration is saved.
```

### Case 4: Edit Existing Configuration

Goal: Check whether disabled `branchIdList` appears in update payload.

Steps:

1. Open an existing branch product limit configuration in edit mode.
2. Change product selection or max limit type.
3. Click Save.
4. Inspect update request payload.

Check carefully:

```text
Does branchIdList appear?
If branchIdList appears, is it empty, null, or populated?
Does backend accept it?
```

Create an issue if:

```text
Update fails because branchIdList is present.
Update changes branch mapping unexpectedly.
Backend validation error mentions branchIdList.
```

### Case 5: Correction/Approval Task Update

Goal: Check payload shape from task payload data.

Steps:

1. Open the configuration from a correction or approval task URL.
2. Make a small valid change.
3. Click Save.
4. Inspect update request payload.

Check carefully:

```text
Does task payload provide branchIdList?
Does getRawValue include disabled branchIdList?
Does backend accept the correction request?
```

Create an issue if:

```text
Correction save fails after adding branchIdList.
Correction changes branch data unexpectedly.
```

### Case 6: All Products Toggle

Goal: Confirm no side effect from `getRawValue()` while products are managed outside the form.

Steps:

1. Open create or edit page.
2. Check `Applied to all products`.
3. Save.
4. Inspect payload.
5. Reopen and uncheck `Applied to all products`.
6. Select a smaller product list and save again.

Expected:

```text
productsLimit should match all products when checked.
productsLimit should match selected products when unchecked.
```

Create an issue if:

```text
productsLimit contains stale all-product data after unchecking.
productsLimit is empty when allProducts is true.
```

### Case 7: Product Max Limit vs Individual Max Limit

Goal: Confirm `useProductMaxLimit` and `productsLimit.productMaxLimit` behavior is unchanged.

Steps:

1. Select `Individual Max Limit`.
2. Enter product max limits.
3. Save and inspect payload.
4. Reopen or retry.
5. Select `Use Product Max Limit`.
6. Save and inspect payload.

Expected:

```text
When Individual Max Limit is selected, useProductMaxLimit should be false and productMaxLimit should be present.
When Use Product Max Limit is selected, useProductMaxLimit should be true and productMaxLimit should be cleared/null.
```

Create an issue if:

```text
Old individual productMaxLimit values are still sent after switching to Use Product Max Limit.
Required individual max limit validation does not work.
Backend saves stale productMaxLimit values.
```

## Best Way To Confirm The Difference

Temporarily log both values before save in local testing:

```ts
console.log('form.value', this.branchProductLimitConfigForm.value);
console.log('form.getRawValue()', this.branchProductLimitConfigForm.getRawValue());
```

Do not commit this logging.

Expected difference:

```text
form.value excludes disabled controls.
form.getRawValue includes disabled controls.
```

## Issue Template

Use this structure when creating a bug:

```md
## Summary
Saving Branch Product Limit Config sends disabled field `<fieldName>` after changing form.value to getRawValue().

## Steps
1. Open `<create/edit/correction>` page.
2. Perform `<specific UI operation>`.
3. Click Save.
4. Inspect request payload / saved result.

## Actual Result
`<actual payload or wrong UI/backend behavior>`

## Expected Result
Disabled/stale field should not affect save payload or saved configuration.

## Evidence
- Request URL:
- Request payload:
- Response:
- Screenshot:

## Suspected Cause
`getRawValue()` includes disabled controls, while previous `form.value` excluded them.
```

## Final Risk Summary

Highest risk:

```text
Create with copy configuration, because disabled branchId can be included in payload.
```

Medium risk:

```text
Normal create, because branchId may now be sent as null.
```

Lower risk:

```text
Edit/update, because branchIdList may be included only if data exists in the form.
```

---

# All Changed Files: `value` / `getRawValue()` Impact

Git was checked inside the nested modules repo:

```bash
git -C src/app/modules status --short
git -C src/app/modules diff --cached
git -C src/app/modules diff
```

There is one staged runtime change and several unstaged runtime/comment changes.

## Summary Table

| File | Change Type | Runtime Behavior Changed? | Main Risk |
| --- | --- | --- | --- |
| `admin/components/sanction-branch-limit-config/form2/branch.product.limit.config.form.component.ts` | `value` to `getRawValue()` | Yes | Disabled `branchId` / `branchIdList` now included |
| `collateral-security/collateral-information/collateral-components/form/collateral.information.form.component.ts` | `value` to `getRawValue()` in save paths | Yes | Low, no TS-disabled controls found in this form |
| `collateral-security/collateral-information/mort-hypo-component/hypothecation/create.hypothecation.component.ts` | `value` to `getRawValue()` | Yes | Low, no TS-disabled controls found |
| `collateral-security/collateral-information/mort-hypo-component/mortgage/create.mortgage.component.ts` | `value` to `getRawValue()` | Yes | Medium, disabled `securityCategory` now included |
| `collateral-security/collateral-information/security-details/form/security.details.form.component.ts` | `value` to `getRawValue()` | Yes | Low, no TS-disabled controls found |
| `collateral-security/guarantor-assessment/components/form/guarantor.form.component.ts` | `value` to `getRawValue()` | Yes | Low, no TS-disabled controls found |
| `collateral-type/components/form/collateral-type.form.component.ts` | Comment only | No | No runtime issue from current diff |
| `product-group/components/create/product.group.form.component.ts` | `value` to `getRawValue()` | Yes | Low, no TS-disabled controls found |
| `sanction/components/limit-tree/form/account-properties/limit.account.properties.component.ts` | `value` to `getRawValue()` | Yes | Medium, disabled account property controls can now be included |
| `sanction/components/limit-tree/form/product-info/limit.product.info.component.ts` | `value` to `getRawValue()` | Yes | High, disabled product/rate fields now included |
| `sanction/components/limit-tree/form/limit.tree.form.component.ts` | Comment only on `.value` line | No direct runtime change | Still worth checking because child `productInfo.getFormValue()` changed |
| `sanction/components/limit-tree/merge/limit.tree.merge.component.ts` | Comment only | No | No runtime issue from current diff |
| `sanction/components/limit-tree/validators/group.customer.drawing.power.validation.ts` | Comment only | No | No runtime issue from current diff |
| `sanction/components/limit-tree/validators/group.customer.limit.amount.validation.ts` | Comment only | No | No runtime issue from current diff |
| `sanction/components/sancion-form/form/sanction.form.component.ts` | Comment only | No | No runtime issue from current diff |

## General QA Rule For All Files

For every changed save path:

```text
1. Find disabled controls in the FormGroup.
2. Perform the UI operation that disables or auto-populates that control.
3. Save.
4. Inspect the request payload or emitted data.
5. Confirm the disabled field is expected by backend/parent component.
6. Create an issue if stale, null, conflicting, or previously omitted data changes behavior.
```

Use this temporary local debugging pattern when needed:

```ts
console.log('value', form.value);
console.log('raw', form.getRawValue());
```

Do not commit this logging.

## 1. Branch Product Limit Config

File:

`src/app/modules/admin/components/sanction-branch-limit-config/form2/branch.product.limit.config.form.component.ts`

Changed:

```ts
this.branchProductLimitConfigForm.value
this.branchProductLimitConfigForm.getRawValue()
```

Disabled controls:

```text
branchId: disabled in create mode
branchIdList: disabled in edit mode
```

Main QA:

```text
Create normally.
Create using copy configuration.
Turn copy on, select copied config, then turn copy off.
Edit existing configuration.
Open correction/approval task and save.
```

Create issue if:

```text
branchId is submitted as null and backend rejects it.
branchId conflicts with branchIdList.
Copied/source branch is saved instead of target branch.
branchIdList appears in update and changes branch mapping.
```

## 2. Collateral Information Form

File:

`src/app/modules/collateral-security/collateral-information/collateral-components/form/collateral.information.form.component.ts`

Changed save paths:

```ts
this.collateralForm.value
this.collateralForm.getRawValue()
```

Affected methods:

```text
save()
emitSaveEvent()
```

Current TS analysis:

```text
No reactive form controls are disabled in this component TypeScript.
```

Important note:

```ts
sessionStorage.setItem("collateralInfos", JSON.stringify(this.collateralForm.value)); // need change?
```

This line is comment-only and still uses `.value`, so guarantor-entry navigation storage behavior is unchanged.

Main QA:

```text
Create collateral information.
Edit collateral information.
Use REFERENCE_MAPPING mode if available.
Toggle third-party collateral options.
Use create guarantor/customer navigation from this page.
```

Create issue if:

```text
Saved collateral payload includes a disabled field from template/runtime behavior.
Reference mapping emits a different object than normal save.
Guarantor navigation loses data because sessionStorage still uses form.value while save uses getRawValue().
```

## 3. Hypothecation Create/Edit

File:

`src/app/modules/collateral-security/collateral-information/mort-hypo-component/hypothecation/create.hypothecation.component.ts`

Changed:

```ts
this.hypothecationCreateForm.value
this.hypothecationCreateForm.getRawValue()
```

Current TS analysis:

```text
No disabled reactive controls found in this form.
```

Main QA:

```text
Create hypothecation.
Edit existing hypothecation.
Fill RJSC Filling No. without date, then with date.
Fill RJSC Filling Date without no, then with no.
Save.
```

Create issue if:

```text
Payload changes unexpectedly.
RJSC validation behavior changes.
Create/update sends extra stale fields.
```

## 4. Mortgage Create/Edit

File:

`src/app/modules/collateral-security/collateral-information/mort-hypo-component/mortgage/create.mortgage.component.ts`

Changed:

```ts
this.mortgageCreateForm.value
this.mortgageCreateForm.getRawValue()
```

Disabled control:

```ts
this.mortgageCreateForm.controls.securityCategory.disable();
```

Why this matters:

```text
Before: disabled securityCategory was omitted from mortgage payload.
Now: securityCategory is included in create/update payload.
```

Main QA:

```text
Create mortgage from collateral with land subtype.
Create mortgage from collateral with flat subtype.
Edit existing mortgage.
Change collateral security category source data if possible, reopen mortgage, save.
```

Check payload:

```text
securityCategory
mortgagedLandArea
marketValue
mortgageAmount
```

Create issue if:

```text
Backend rejects securityCategory as unexpected.
securityCategory is stale or mismatched with collateral subtype.
Land/flat behavior changes.
mortgagedLandArea validation changes unexpectedly.
```

## 5. Security Details Form

File:

`src/app/modules/collateral-security/collateral-information/security-details/form/security.details.form.component.ts`

Changed:

```ts
this.securityDetailsForm.value
this.securityDetailsForm.getRawValue()
```

Current TS analysis:

```text
No disabled reactive controls found in this form.
```

Main QA:

```text
Save Real Estate Land profile.
Save Real Estate Flat profile.
Save Capital Machinery profile.
Edit each profile and save again.
```

Create issue if:

```text
Profile-specific payload contains stale fields from another profile.
Required validation changes.
Backend rejects extra null profile fields.
```

## 6. Guarantor Assessment Form

File:

`src/app/modules/collateral-security/guarantor-assessment/components/form/guarantor.form.component.ts`

Changed:

```ts
this.guarantorInformationForm.value
this.guarantorInformationForm.getRawValue()
```

Current TS analysis:

```text
No disabled reactive controls found in this form.
```

Main QA:

```text
Create guarantor.
Edit guarantor.
Use active customer.
Try configuration where Assessed By is required.
Try configuration where Assessed By is not required.
```

Create issue if:

```text
Assessed By behavior changes.
customerId or guarantor customer mapping changes.
guaranteedAmount/assessmentAmount validation changes.
```

## 7. Collateral Type Form

File:

`src/app/modules/collateral-type/components/form/collateral-type.form.component.ts`

Changed:

```ts
const formValue = this.collateralTypeFormGroup.value; // value to .getRawValue() if you want to get the value of disabled fields as well
```

Runtime impact:

```text
No runtime change. Only a comment was added.
```

Main QA:

```text
No special QA required for getRawValue because behavior did not change.
Basic create/update smoke test is enough if this file is part of the commit.
```

Create issue if:

```text
There is a separate functional regression, but not because of getRawValue in this diff.
```

## 8. Product Group Form

File:

`src/app/modules/product-group/components/create/product.group.form.component.ts`

Changed:

```ts
this.productGroupForm.value
this.productGroupForm.getRawValue()
```

Current TS analysis:

```text
No disabled reactive controls found in this form.
```

Main QA:

```text
Create product group.
Edit product group.
Add products.
Remove selected products.
Save with funded products.
Save with LC/BG products if enabled in UI.
```

Create issue if:

```text
groupDetailsList differs from selectedProductList.
Removed products are still sent.
Backend rejects extra empty groupDetailsList from form raw value.
```

## 9. Limit Account Properties

File:

`src/app/modules/sanction/components/limit-tree/form/account-properties/limit.account.properties.component.ts`

Changed:

```ts
this.accountPropertiesForm.value
this.accountPropertiesForm.getRawValue()
```

Affected method:

```text
getFormValue()
```

Disabled or dynamically disabled controls found:

```text
downPaymentAllowToChange: disabled when down payment is not overridable on account
tenureType in sanctionRateForm / commissionRateForm / chargeRateForm can be disabled when multi-rate rows already exist
```

Important distinction:

```text
The changed getRawValue() is on accountPropertiesForm.
The rate subforms have disabled tenureType, but they affect payload only if their values are pushed into the accountPropertiesForm arrays.
```

Main QA:

```text
Open sanction limit tree account properties.
Select product/mode where down payment is required and not overridable.
Save the node.
Create account properties with single rate.
Add multiple sanction rates.
Add multiple commission rates.
Add multiple charges.
Edit node and save again.
```

Check payload:

```text
downPaymentAllowToChange
downPaymentInPercent
sanctionRates[].tenureType
commissionRates[].tenureType
addConfirmationCharges[].tenureType
```

Create issue if:

```text
Disabled downPaymentAllowToChange is now sent and backend rejects it.
Down payment override flag is stale or conflicts with product setup.
Multi-rate tenureType is missing or newly appears differently than expected.
```

## 10. Limit Product Info

File:

`src/app/modules/sanction/components/limit-tree/form/product-info/limit.product.info.component.ts`

Changed:

```ts
this.limitProductInfoForm.value
this.limitProductInfoForm.getRawValue()
```

Affected method:

```text
getFormValue()
```

Disabled controls found:

```text
referenceRateName: disabled
referenceRate: disabled
profitRate: disabled in some product/rate setups
downPaymentAllowToChange: disabled when product down payment is not overridable
tenureType in sanctionRateForm / commissionRateForm / chargeRateForm can be disabled for multi-rate rows
```

Why this is high risk:

```text
Limit tree form combines sanction limit form values with productInfo.getFormValue().
Because productInfo.getFormValue() now uses getRawValue(), disabled product/rate fields can enter the final sanction limit node payload.
```

Main QA:

```text
Create a funded product-based limit node.
Create a product-group-based limit node.
Select a product that uses reference rate.
Select a product where profit rate is auto-calculated or read-only.
Use multi-rate profit setup.
Use commission-rate setup.
Use add-confirmation-charge setup.
Use product where down payment is required but not overridable.
Edit saved node and save again.
```

Check payload:

```text
referenceRateName
referenceRate
referenceRateTypeId
accountRate
profitRate
profitRateAllowToChange
referenceRateTypeAllowToChange
downPaymentAllowToChange
sanctionRates[].tenureType
commissionRates[].tenureType
addConfirmationCharges[].tenureType
```

Create issue if:

```text
Read-only profitRate is now sent and backend overwrites/calculates incorrectly.
referenceRate/referenceRateName is stale after product change.
Disabled downPaymentAllowToChange conflicts with selected product configuration.
Multi-rate tenureType appears or disappears incorrectly.
Saved node differs from what UI displays.
```

## 11. Limit Tree Form

File:

`src/app/modules/sanction/components/limit-tree/form/limit.tree.form.component.ts`

Changed:

```ts
return {...this.sanctionLimitInformationForm.value, ...this.productInfo.getFormValue()}; // need change
```

Runtime impact:

```text
No direct runtime change in this file because only a comment was added.
```

Indirect impact:

```text
productInfo.getFormValue() changed in LimitProductInfoComponent, so the final returned object from LimitTreeFormComponent can still change.
```

Main QA:

```text
Use same QA cases from Limit Product Info.
Also save parent and child limit nodes.
Move/copy nodes if those operations preserve form data.
```

Create issue if:

```text
Final node payload contains unexpected disabled product fields.
Parent/child limit save differs from previous behavior.
```

## 12. Limit Tree Merge

File:

`src/app/modules/sanction/components/limit-tree/merge/limit.tree.merge.component.ts`

Changed:

```ts
if(customerIdInForm.value != customer.id) { //?
```

Runtime impact:

```text
No runtime change. Only a comment was added.
```

Main QA:

```text
No getRawValue-specific QA required.
Smoke test merge customer selection if this file is included in the commit.
```

## 13. Group Customer Drawing Power Validator

File:

`src/app/modules/sanction/components/limit-tree/validators/group.customer.drawing.power.validation.ts`

Changed:

```ts
if(!formArray || !formArray.value) { return null; } //?
```

Runtime impact:

```text
No runtime change. Only a comment was added.
```

QA:

```text
No getRawValue-specific QA required.
Smoke test drawing power validation if this file is committed.
```

## 14. Group Customer Limit Amount Validator

File:

`src/app/modules/sanction/components/limit-tree/validators/group.customer.limit.amount.validation.ts`

Changed:

```ts
if(!formArray || !formArray.value) { return null; } //?
```

Runtime impact:

```text
No runtime change. Only a comment was added.
```

QA:

```text
No getRawValue-specific QA required.
Smoke test group customer limit amount validation if this file is committed.
```

## 15. Sanction Form

File:

`src/app/modules/sanction/components/sancion-form/form/sanction.form.component.ts`

Changed:

```ts
sancInfo.sanctionRefNo = this.sanctionInformationForm.value.basicInfoForm.sanctionRefNo; // is need change?
```

Runtime impact:

```text
No runtime change. Only a comment was added.
```

Possible future concern:

```text
If basicInfoForm contains disabled controls and the goal is to include them, this line and the nearby sanctionInformationForm.value.basicInfoForm reads may still omit disabled values.
```

Main QA:

```text
No current getRawValue regression from this diff.
If later changed, test create sanction, edit sanction, amendment, branch/currency/status fields, and approval/correction save.
```

## Cross-Module Issue Template

```md
## Summary
`<module/page>` save now includes disabled field `<field>` after changing `.value` to `.getRawValue()`.

## Changed File
`<path>`

## Steps To Reproduce
1. Open `<page>`.
2. Perform `<UI action that disables/autofills field>`.
3. Save.
4. Inspect payload or saved data.

## Actual Result
`<payload/behavior>`

## Expected Result
Disabled/stale field should not change saved behavior.

## Evidence
- Request URL:
- Payload before:
- Payload after:
- Response:
- Screenshot:

## Suspected Cause
Angular `getRawValue()` includes disabled controls. Previous `.value` omitted disabled controls.
```
