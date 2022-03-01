# Themes

[[toc]]

There are times when you would like the visual style of Nova to match your brand or colors. Nova provides a few ways to customize the look and feel of the Nova UI itself.

## Generating a Custom Theme

Custom themes may be generated using the `nova:theme` Artisan command. By default, all custom themes will be placed in the `nova-components` directory of your application. When generating a theme using the `nova:theme` command, the theme name you pass to the command should follow the Composer `vendor/package` format. So, if we were building a theme called "Miami Ice", we might run the following command:

```bash
php artisan nova:theme acme/miami-ice
```

This command will generate all of the boilerplate needed to generate your theme. In addition, a `ThemeServiceProvider` will be auto-registered with your application. This service provider registers your theme with Nova. You do not need to publish the theme CSS manually, as Nova handles this for you.

If your theme's service provider is not automatically registered because you have disabled provider auto-discovery within your Laravel application, you can manually register the service provider within your Laravel application's `config/app.php` configuration file:

```php
'providers' => [
    //...
    \Acme\MiamiIce\ThemeServiceProvider::class,
    //...
],
```

## Theme CSS

When Nova generates your theme, a `resources/css/theme.css` file is generated for you. This file contains your theme's styles. Inside you will find some example values already in place for you to edit:

```css
:root {
  --primary: rgb(254, 1, 129, 1);
  --primary-dark: rgb(209, 0, 105, 1);
  --primary-70: rgba(254, 1, 129, 0.7);
  --primary-50: rgba(254, 1, 129, 0.5);
  --primary-30: rgba(254, 1, 129, 0.3);
  --primary-10: rgba(254, 1, 129, 0.1);
  --logo: #430051;
  --sidebar-icon: #db34de;
}

.bg-grad-sidebar {
  background-image: -webkit-gradient(
    linear,
    left bottom,
    left top,
    from(rgb(254, 1, 129, 1)),
    to(#3c4655)
  );

  background-image: linear-gradient(
    0deg,
    rgb(254, 1, 129, 1),
    rgb(100, 5, 113)
  );
}
```

## Publishing Your Themes

After creating your theme, you need to place the theme's public CSS file in the `public` folder of your application. The easiest way to do this is to use the `vendor:publish` Artisan command:

```bash
php artisan vendor:publish
```

After running this command, you will be given a list of publishable assets from the various packages installed in your application. Pick the number corresponding to the custom Nova theme you just generated.
