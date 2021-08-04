# Installation

[[toc]]

## Requirements

Laravel Nova has a few requirements you should be aware of before installing:

- Composer
- Laravel Framework 7.0+
- Laravel Mix
- Node.js & NPM

## Browser Support

Nova supports reasonably recent versions of the following browsers:

- Google Chrome
- Apple Safari
- Microsoft Edge
- Mozilla Firefox

## Installing Nova

Once you have purchased a Nova license, you may download a Nova release from the "releases" section of the Nova website. After downloading a Zip file containing the Nova source code, you will need to install it as a Composer "path" repository within your Laravel application's `composer.json` file.

First, unzip the contents of the Nova release into a `nova` directory within your application's root directory. Once you have unzipped and placed the Nova source code within the appropriate directory, you are ready to update your `composer.json` file. You should add the following configuration to the file:

```json
"repositories": [
    {
        "type": "path",
        "url": "./nova"
    }
],
```

Or, you may use the following CLI command to add the path repository to your `composer.json` file:

```bash
composer config repositories.nova '{"type": "path", "url": "./nova"}' --file composer.json
```

:::warning Hidden Files

When unzipping Nova into your application's `nova` directory, make sure all of Nova's "hidden" files (such as its `.gitignore` file) are included.
:::

Next, add `laravel/nova` to the `require` section of your `composer.json` file:

```json
"require": {
    "php": "^7.2.5",
    "fideloper/proxy": "^4.2",
    "laravel/framework": "^7.0",
    "laravel/nova": "*"
},
```

After your `composer.json` file has been updated, run the `composer update` command in your console terminal:

```bash
composer update
```

:::tip Package Stability

If you are not able to install Nova into your application because of your `minimum-stability` setting, consider setting your `minimum-stability` option to `dev` and your `prefer-stable` option to `true`. This will allow you to install Nova while still preferring stable package releases for your application.
:::

Finally, run the `nova:install` and `migrate` Artisan commands. The `nova:install` command will install Nova's service provider and public assets within your application:

```bash
php artisan nova:install

php artisan migrate
```

After running this command, verify that the `App\Providers\NovaServiceProvider` was added to the `providers` array in your `app` configuration file. If it wasn't, you should add it manually. Of course, if your application does not use the `App` namespace, you should update the provider class name as needed.

The default `App\Nova\User` Nova resource references the `App\Models\User` model. If you place your models in a different directory or namespace, you should adjust this value within the resource:

```php
public static $model = 'App\\Models\\User';
```

That's it! Next, you may navigate to your application's `/nova` path in your browser and you should be greeted with the Nova dashboard which includes links to various parts of this documentation.

## Installing Nova Via Composer

Instead of downloading Zip files containing the Nova source code, you may also install Nova as a typical Composer package via our private Satis repository. To get started, add the Nova repository to your application's `composer.json` file:

```json
"repositories": [
    {
        "type": "composer",
        "url": "https://nova.laravel.com"
    }
],
```

Or, you may use the following CLI command to add the Composer repository to your `composer.json` file:

```bash
composer config repositories.nova '{"type": "composer", "url": "https://nova.laravel.com"}' --file composer.json
```

Next, you may add `laravel/nova` to your list of required packages in your `composer.json` file:

```json
"require": {
    "php": "^7.2.5",
    "fideloper/proxy": "^4.2",
    "laravel/framework": "^7.0",
    "laravel/nova": "~3.0"
},
```

After your `composer.json` file has been updated, run the `composer update` command in your console terminal:

```bash
composer update --prefer-dist
```

When running `composer update`, you will be prompted to provide your login credentials for the Nova website. These credentials will authenticate your Composer session as having permission to download the Nova source code. To avoid manually typing these credentials, you may create a [Composer auth.json file](https://getcomposer.org/doc/articles/http-basic-authentication.md) while optionally using your [API token](https://nova.laravel.com/settings#password) in place of your password.

Finally, run the `nova:install` and `migrate` Artisan commands. The `nova:install` command will install Nova's service provider and public assets within your application:

```bash
php artisan nova:install

php artisan migrate
```

After running this command, verify that the `App\Providers\NovaServiceProvider` was added to the `providers` array in your `app` configuration file. If it wasn't, you should add it manually. Of course, if your application does not use the `App` namespace, you should update the provider class name as needed.

The default `App\Nova\User` Nova resource references the `App\Models\User` model. If you place your models in a different directory or namespace, you should adjust this value within the resource:

```php
public static $model = 'App\\Models\\User';
```

If you don't have a Nova admin user yet in your `users` table, you can add one by running the `nova:user` Artisan command and following the prompts:

```bash
php artisan nova:user
```

That's it! Next, you may navigate to your application's `/nova` path in your browser and you should be greeted with the Nova dashboard which includes links to various parts of this documentation.

## Authenticating Nova in Continuous Integration (CI) Environments

It's not advised to store your `auth.json` file inside your project's version control repository. However, there may be times you wish to download Nova inside a CI environment like [CodeShip](https://codeship.com/). For instance, you may wish to run tests for any custom tools you create. To authenticate Nova in these situations, you can use Composer to set the configuration option inside your CI system's pipeline, injecting environment variables containing your Nova username and password:

```bash
composer config http-basic.nova.laravel.com ${NOVA_USERNAME} ${NOVA_PASSWORD}
```

## Upgrade Guide

Nova 3.0 is primarily a maintenance release to provide compatibility with Laravel 7.x or greater. Nova 3.0 should **only** be used with Laravel 7.x or greater, as it is not compatible with previous releases of Laravel.

Update your `laravel/nova` dependency to ~3.0 in your `composer.json` file and run `composer update` followed by `php artisan migrate`.

Your Nova resources will not require any changes during this upgrade; however, you should review the [Laravel upgrade guide](https://laravel.com/docs/upgrade).

## Customizing Nova's Authentication Guard

Nova uses the default authentication guard defined in your `auth` configuration file. If you'd like to customize this guard you may set the `guard` value inside of Nova's configuration file.

## Customizing Nova's Password Reset Functionality

Nova uses the default password reset broker defined in your `auth` configuration file. If you'd like to customize this broker, you may set the `passwords` value inside of Nova's configuration file.

## Authorizing Nova

Within your `app/Providers/NovaServiceProvider.php` file, there is a `gate` method. This authorization gate controls access to Nova in **non-local** environments. By default, any user can access the Nova dashboard when the current application environment is `local`. You are free to modify this gate as needed to restrict access to your Nova installation:

```php
/**
 * Register the Nova gate.
 *
 * This gate determines who can access Nova in non-local environments.
 *
 * @return void
 */
protected function gate()
{
    Gate::define('viewNova', function ($user) {
        return in_array($user->email, [
            'taylor@laravel.com',
        ]);
    });
}
```

## Error Reporting

Nova uses its own internal exception handler instead of using the default `App\Exceptions\ExceptionHandler`. If you need to integrate third-party error reporting tools with your Nova installation, you should use the `Nova::report`. Typically, this method should be invoked from the `register` method of your application's `App\Providers\NovaServiceProvider` class:

```php
use Laravel\Nova\Nova;

Nova::report(function ($exception) {
    if (app()->bound('sentry')) {
        app('sentry')->captureException($exception);
    }
});
```

## Updating Nova

To update your Nova installation, you may simply download a release Zip file from the Nova website.

:::tip Composer Installations
Of course, if you installed Nova via Composer, you may update Nova using `composer update`, just like any other Composer package.
:::

After downloading the Zip file, replace the current contents of your application's `nova` directory with the contents of the Zip file. After updating the directory's contents, you may run the `composer update` command:

```bash
composer update
```

### Updating Nova's Assets

After updating to a new Nova release, you should be sure to update Nova's JavaScript and CSS assets using `nova:publish` and clear any cached views with `view:clear`. This will ensure the newly-updated Nova version is using the latest versions.

```bash
php artisan nova:publish
php artisan view:clear
```

The `nova:publish` command will re-publish Nova's public assets, configuration, views, and language files. This command will not overwrite any existing configuration, views, or language files. If you would like the command to overwrite existing files, you may use the `--force` flag when executing the command:

```bash
php artisan nova:publish --force
```

### Keeping Nova's Assets Updated

To ensure Nova's assets are updated when a new version is downloaded, you may add a Composer hook inside your project's `composer.json` file to automatically publish Nova's latest assets:

```json
"scripts": {
    "post-update-cmd": [
        "@php artisan nova:publish"
    ]
}
```

## Code Distribution

Nova's license does not allow the public distribution of its source code. So, you may not build an application using Nova and distribute that application public via open source repository hosting platforms or any other code distribution platform.

If you would like to develop a third party package that augments Nova's functionality, you are free to do so. However, you may not distribute the Nova source code along with your package.
