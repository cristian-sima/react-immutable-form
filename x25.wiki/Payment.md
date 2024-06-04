Use to create payments 

# Example 

```jsx
<Payment application="smsalert">
  <PayBoxForm
    credits={creditsPerMonth}
    current={formValues}
  />
</Payment>
```

Notes: 
1. It accepts only one child
2. It inserts the following props into its children:
- `companyID` - number
- `createPayment` - function to call to create the payment request
- `payUsingBankTransfer`

```jsx
type Options = Immutable.Map({
  ...any other data
  companyID: number;
  amount: number;
})


type payUsingBankTransfer = (application: string, options : Options) => () => void;
```

# Full example

```jsx

<Payment application="smsalert">
  <PayBoxForm
    credits={creditsPerMonth}
    current={formValues}
  />
</Payment>
```
