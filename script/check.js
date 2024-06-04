/* eslint-disable no-console */

console.log("This is the start of checking deps.");

console.warn(`
=======================================================================================
 Please check manually if the version of react-loadable is greater than v5.5.0. 
If so, go to x25 and 
- remove @docusaurus/react-loadable from tsconfig.json 
- install react-loadable
- remove  @docusaurus/react-loadable from package.json from checking 

This was necessary because react-loadable was not updated and it showed some warnings.
=======================================================================================
`);
