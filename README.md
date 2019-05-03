# Auth Starter 2.0
Starter repo for user authentication using passport, user payment handling using Stripe, and SSR using Next

### Getting Started
1. Change `.env.example` to `.env`, and populate all fields
2. `$ npm run dev`

### Notes:
  1) `passport-facebook` strategy will not return the Users Facebook URL by default. You must use the Facebook Javascript SDK
  2) Instagram authentication doesn't return user email.
  3) All login related routes live under `/c` route

### TODO
Todos are kept in the auth-starter-2.0 repo's issues.
You can also search the code base for `TODO:` for small refactors


#### Creating your own Next App using `create-next-app`
```bash
npx create-next-app --example with-redux with-redux-app
# or
yarn create next-app --example with-redux with-redux-app
```




### Guidelines
https://github.com/elsewhencode/project-guidelines#6-structure-and-naming