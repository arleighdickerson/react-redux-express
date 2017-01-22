# react-redux-express
Isomorphic React with Redux, HMR, express middleware, and a mongo backend.

## what it is
This is my first stab at a node application.
I merged the following repositories into a single project to use as a starting point
- https://github.com/davezuko/react-redux-starter-kit
- https://github.com/amoshaviv/mean-web-development

## how it works
To run in development mode with hot module replacements
```bash
npm run dev
```

To run in production mode with isomorphic (server-side) rendering
```bash
npm run compile #compile with optimizations
npm run prod
```

Note that in the real world we'd probably use NGINX to deliver the compiled goods
