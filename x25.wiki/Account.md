Contains all information about the current account.

The module `x25/Account` has: 
- `<LoadAccount appName="auto" />`
- `accountSelectors` 
- `accountReducer`

# LoadAccount

It loads the account. The `appName` is the application for which is done the init-session

Example:
```jsx

import { LoadAccount } from "x25/Account";

<LoadAccount appName="auto">
 <div />
</LoadAccount>
```

It does not display `<div />` until the account is loaded


# accountSelectors


```jsx
export const selectors = {
  getCurrentAccount,
  getCurrentAccountIsFetching,
  getCurrentAccountShouldFetch,
  getCurrentAccountIsFetched,
  getCurrentAccountHasError,

  getIsCurrentAccountAdministrator,

  getCurrentAccountCompanies,
};

```