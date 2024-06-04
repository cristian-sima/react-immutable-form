The module `x25/Header` exports: 
- `<SideworkLogo />`
- `<Header ...props />`

## `<Header ...props />`

```jsx
type HeaderPropTypes = {
  brand : string;
  accountName : string;
  isAdmin: bool;
  sidebarDocked: boolean;
  ui: {
    showNavbar: boolean;
  };

  toggleNavbar: () => void;

  showSidebar: () => void;
};
```