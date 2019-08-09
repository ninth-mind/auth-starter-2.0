# Auth Starter 2.0
Starter repo for user authentication using passport, user payment handling using Stripe, and SSR using Next. Component Library AntD

### Getting Started
1. Change `.env.example` to `.env`, and populate all fields
2. `$ npm run dev`

### Notes:
  1) `passport-facebook` strategy will not return the Users Facebook URL by default. You must use the Facebook Javascript SDK. This repo does not do that.
  2) Instagram authentication doesn't return user email.
  3) All login related routes live under `/c/login` route
  4) This uses both SASS and LESS Preprocessors. LESS is used with AntD Design Language and Components found [here](https://ant.design/)
  5) You have to setup a Google app to send emails using nodemailer from google. [Video here](https://www.youtube.com/watch?v=JJ44WA_eV8E)
  6) Importing all AntD CSS styles in the `main.scss`, this is to avoid `mini-css-extract-plugin` ordering errors described [here](https://github.com/ant-design/ant-design/issues/15696)

### TODO
Todos are kept in the auth-starter-2.0 repo's issues.
You can also search the code base for `TODO:` for small refactors


#### Creating your own Next App using `create-next-app`
```bash
npx create-next-app --example with-redux with-redux-app
# or
yarn create next-app --example with-redux with-redux-app
```

#### Setting up Nodemailer with GMAIL
[Click here for Video tutorial](https://www.youtube.com/watch?v=JJ44WA_eV8E)




### Guidelines
https://github.com/elsewhencode/project-guidelines#6-structure-and-naming