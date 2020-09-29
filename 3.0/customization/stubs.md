# Stubs

[[toc]]

## Overview

When creating new resources, actions, filters, lens and metrics, Nova will publish files using the default stub files. However, you may wish to customize these for your projects to apply common modifications automatically.

:::tip Laravel Stub Customization

To learn more about stub customization, please consult the [Laravel documentation](https://laravel.com/docs/master/artisan#stub-customization).

:::

## Publishing Stubs

To publish the stubs used by Nova to generate the different classes, run `php artisan nova:stubs`. Nova will copy all of the stub files into `./stubs/nova`, where you may then customize the files.

If you do not wish to customize a stub, you may delete it and Nova will continue to use the default.
