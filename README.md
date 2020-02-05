# Underground
This is the admin client area. This is where administrators are able to create and manage Projects. Each project is comprised of Layers. These layers have points. These points can have attributes. This repo is built off my Auth-Starter-2.0 Repo. The details for that repo can be found below.


# Auth Starter 2.0
Starter repo for user authentication using passport, and SSR using Next. Component Library AntD

### Getting Started
1. Change `.env.example` to `.env`, and populate all fields
2. Start database `sudo mongod` (Catalina -- specify config file: `sudo mongod --config /usr/local/etc/mongod.conf`)
3. (OPTIONAL) - start Neo4j database (currently un-used)
4. Start Strapi (in different repo) `strapi start` or `npx strapi start`
5. `$ npm run dev`

### Notes:
  1) `passport-facebook` strategy will not return the Users Facebook URL by default. You must use the Facebook Javascript SDK. This repo does not do that.
  2) Instagram authentication doesn't return user email.
    - Also Instagram authentication is silly and probably shouldnt be done
  3) All login related routes live under `/c/login` route
  4) This uses both SASS and LESS Preprocessors. LESS is used with AntD Design Language and Components found [here](https://ant.design/)
  5) You have to setup a Google app to send emails using nodemailer from google. [Video here](https://www.youtube.com/watch?v=JJ44WA_eV8E)
  6) Importing all AntD CSS styles in the `main.scss`, this is to avoid `mini-css-extract-plugin` ordering errors described [here](https://github.com/ant-design/ant-design/issues/15696)
  7) The `CardDetails` component requires passing in `{...props}`
  8) Profile is a Class component. Needs `shouldComponentUpdate` to avoid unnecessary re-renders
    - TODO: find a way to do this with hooks.

### TODO
Todos are kept in the auth-starter-2.0 repo's issues.
You can also search the code base for `TODO:` for small refactors
- [x] Set the HTTP Cookie to Secure
- [x] Check for `Referer` when checking cookie
  - [ ] https://blog.webf.zone/ultimate-guide-to-http-cookies-2aa3e083dbae
- [x] If you try and login while logged in — go to profile
- [ ] Convert into MonoRepo - ie seperate out Server and Client
- [ ] Figure out a way to opt in to Automatic Static optimization [url](https://github.com/zeit/next.js/blob/master/errors/opt-out-auto-static-optimization.md)


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


### Deployment Process
1) Create droplet on Digital Ocean.
2) install Dokku on droplet
3) Create an app using dokku: `dokku apps:create my-app-name`
4) Install any plugins you will need (eg Mongo)
    a) `sudo dokku plugin:install https://github.com/dokku/dokku-mongo.git`
    b) Create a database `dokku mongo:create database-name`
    c) link database `dokku postgres:link rails-database ruby-rails-sample`
5) Update any environment variables `dokku config:set my-app-name ENV=PRODUCTION ...`
6) On local machine, add remote repo `git remote add dokku dokku@IP_OF_DROPLET:my-app-name`
7) `git push dokku master` (must be master or `my-branch:master`)

#### Things to Check
1) Node and NPM versions are declared in `package.json`, potentially also in `.nvmrc`
```
  "engines": {
   "node": "12.14.1",
   "npm": "6.13.4"
  }
```
2) All dependencies are met and, if required for compiling or deployment, are in the `dependencies` and not `dev dependencies`
