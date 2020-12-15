const isModuleName = /^[a-zA-Z0-9_\-]+$/

module.exports = function (plop) {
  // create your generators here
  plop.setGenerator('Config', {
    description: 'initialized config',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Module name',
        validate: n => isModuleName.test(n)
      },
      {
        type: 'input',
        name: 'repo',
        message: 'Repo url'
      }
    ], // array of inquirer prompts
    actions: [
      {
        type: 'add',
        path: 'module-config.json',
        templateFile: 'plop-templates/module-config.hbs'
      },
      {
        type: 'add',
        path: 'src/index.js',
        templateFile: 'plop-templates/index.js.hbs'
      },
      {
        type: 'add',
        path: '{{name}}.lua',
        templateFile: 'plop-templates/index.lua.hbs'
      },
      {
        type: 'add',
        path: '{{name}}-scm-1.rockspec',
        templateFile: 'plop-templates/rockspec.hbs'
      },
      {
        type: 'add',
        path: 'Makefile',
        templateFile: 'plop-templates/Makefile.hbs'
      },
    ]  // array of actions
  });
};
