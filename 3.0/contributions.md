# Contribution Guide

[[toc]]

## Bug Reports

If you discover a bug in Laravel Nova, please open an issue on the [Nova issues GitHub repository](https://github.com/laravel/nova-issues).

## Support Questions

Laravel Nova's GitHub issue trackers are not intended to provide Nova help or support. Instead, use one of the following channels:

- [Laracasts Forums](https://laracasts.com/discuss)
- [Laravel.io Forums](https://laravel.io/forum)
- [StackOverflow](https://stackoverflow.com/questions/tagged/laravel-nova)
- [Discord](https://discordapp.com/invite/KxwQuKb)
- [Larachat](https://larachat.co/)
- [IRC](https://webchat.freenode.net/?nick=artisan&amp;channels=%23laravel&amp;prompt=1)

## Contributing

Laravel Nova is a closed-source project and as such is not publicly available; however, you may authorize one GitHub account to the Nova repository for contributing or keeping an eye on development. You can manage the authorized account at: [https://nova.laravel.com/settings#github](https://nova.laravel.com/settings#github)

:::tip Changing Authorized Account
You will need to disconnect the currently connected account before re-authorizing another.
:::

### Download the Laravel Nova Composer package repository

To get started contributing to Laravel Nova, you need to have a local environment to test your changes against. You can download Nova's Git repository from GitHub after authenticating your Nova account:

- HTTPS: `https://github.com/laravel/nova.git`
- SSH: `git@github.com:laravel/nova.git`
- GitHub CLI: `gh repo clone laravel/nova`

### Download the Laravel Nova NPM package repository

Nova's team also maintains the `laravel-nova` NPM package, which is used inside custom fields and for Nova's internal use. You can download its repository, if your change requires it:

- HTTPS: `https://github.com/laravel/nova-js.git`
- SSH: `git@github.com:laravel/nova-js.git`
- GitHub CLI: `gh repo clone laravel/nova-js`

#### Linking Nova-JS To Nova's Composer Package

When you need to make changes to the Nova-JS library, make sure to link your development version of the package to your core Nova library:

```sh
cd ~/Sites/nova-js
yarn link
cd ~/Sites/nova-lib
yarn link laravel-nova
```

#### Unlinking Nova-JS

When you're done submitting changes to Nova-JS, make sure to unlink the package and reinstall your node modules in the main Nova repository to restore Nova's modules to its released state:

```sh
cd ~/Sites/nova-lib
yarn unlink laravel-nova
yarn install --force
```

:::tip Compiled Files

If you are submitting a change that will affect a compiled file, such as most of the files in `resources/sass` or `resources/js` of the `laravel/nova` repository, do not commit the compiled files.

Due to their large size, they cannot realistically be reviewed by a maintainer. This could be exploited as a way to inject malicious code into Laravel Nova. In order to defensively prevent this, all compiled files will be generated and committed by Laravel maintainers.
:::

### Create a testing Laravel Nova application

To test your changes to Nova in context of a real application, you should create a new Laravel application and install your local version of Nova inside it. You can create a new Laravel package using the [Laravel Installer](https://github.com/laravel/installer):

```sh
laravel new nova-fresh
```

Next, add Nova to your new application's `composer.json` file:

```json
"require": {
    "laravel/nova": "*",
},
"repositories": [
   {
       "type": "path",
       "url": "../nova-lib"
   },
]
```

Now run `composer update` to install the package:

```php
composer update
```

After Composer finishes installing, you can install Nova's front-end dependencies by running Nova's installation Artisan command:

```php
php artisan nova:install
```

You may also create a new user for your Nova application by using the `nova:user` command and following the prompts:

```php
php artisan nova:user
```

### Configuring Webpack for development

Nova's repository ships with a `webpack.mix.js.dist` file to help you get started contributing to Nova. You should create a copy of this file and name it `webpack.mix.js`. Take care to change the value of the line `.copy('public', '../nova-app/public/vendor/nova')` to point to your testing application's path. Doing so will ensure when you change code inside of Nova's JavaScript assets that your testing application's front-end assets are also updated.
