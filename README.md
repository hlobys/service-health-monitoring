# Tarantool Front-end stub

Simple stub project for using with Tarantool Front-end Core.

It has a preconfigured webpack config and setup for generate rock and lua bundle in it.

## Usage

```
git clone git@github.com:tarantool/frontend-stub.git myproject
cd myproject
npm ci
npm run config
```

Then write your project name. It will setup a base config for your project

For generate bundle:

```
tarantoolctl rocks make
```

For developing purpose:

```
npm run start
```

Don't forget change package.json name of your project.
