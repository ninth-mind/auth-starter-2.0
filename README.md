# Auth Starter 2.0
Starter repo for user authentication using passport, user payment handling using Stripe, and SSR using Next

### Getting Started
1. Change `.env.example` to `.env`, and populate all fields
2. `$ npm run dev`

### TODO
- [ ] - HIGH - Limit number of requests per IP address per second
- [ ] - HIGH - Only create token using needed information!!!!
- [x] - HIGH - set Cookie headers to secure in production
- [ ] - LOW - allow users to sign in using social if email is found associated with social account
- [ ]* - LOW -If you try and login while logged in — go to profile
- [ ] - LOW - Distinguish between Profile page and Account page (account lets you change email and password)

`*` - denotes: only an issue if the user trys to get weird, and doesn't follow designed flow




#### Creating your own Next App using `create-next-app`
```bash
npx create-next-app --example with-redux with-redux-app
# or
yarn create next-app --example with-redux with-redux-app
```




### Guidelines
https://github.com/elsewhencode/project-guidelines#6-structure-and-naming