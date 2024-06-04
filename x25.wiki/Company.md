Contains all information about the current company.

The module `x25/Company` has: 
- `<LoadCompany />`
- `companySelectors` 
- `companyReducer`

# LoadCompany

It loads the company

Example:
```jsx

import { LoadCompany } from "x25/Company";

<LoadCompany>
 <div />
</LoadCompany>
```

It does not display `<div />` until the company is loaded


# companySelectors


```jsx
export const selectors = {
  getCurrentCompany,
  getCurrentCompanyIsFetched,
  getCurrentCompanyIsFetching,
  getCurrentCompanyHasError,
  getCurrentCompanyShouldFetch,
  getCompanyModules,
  getCurrentCompanyID,
};

```