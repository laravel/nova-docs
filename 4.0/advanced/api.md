# Nova API Resources

[[toc]]

:::warning Beta

The Nova API is considered a "beta" feature and is not intended for widespread usage. While we don't intend on breaking it often, it is not versioned and may change as required.
:::

## Base URL

The base URL for the Nova API is `https://nova.laravel.com/api`:

```php
use Illuminate\Support\Facades\Http;

Http::baseUrl('https://nova.laravel.com/api');
```

## Authenticating With Nova's API

To authenticate with the Nova API, include a license key along with your request as an `Authorization` header:

| Header        | Value                       |
| ------------- | --------------------------- |
| Authorization | `Bearer {your-license-key}` |

Using Laravel's `Http` client, you may authenticate your request using the `withToken` method to attach your license key to your request:

```php
use Illuminate\Support\Facades\Http;

Http::baseUrl('https://nova.laravel.com/api')->withToken('{your-license-key}')
```

## Available Resources

### Releases

#### Fetching a list of Nova's releases

To fetch a list of Nova's releases, make a `GET` request to the `releases` endpoint:

```php
use Illuminate\Support\Facades\Http;

Http::baseUrl('https://nova.laravel.com/api')->get('/releases')
```

:::tip No Authentication Needed

The `releases` endpoint is a public endpoint and does not require authentication.
:::

### Sites

The Sites API allows for managing the sites associated with a Nova license. The license key passed using the `Authorization` header acts as the API token.

#### Fetching a list of sites associated with a license

To get a list of the site domains associated with a license, make a `GET` request to the `sites` endpoint:

```php
Http::baseUrl('https://nova.laravel.com/api')
    ->withToken('{your-license-key}')
    ->get('/sites');
```

The response you receive will contain a JSON array of the associated license domains:

```json
{
  "sites": ["nova.laravel.com", "forge.laravel.com", "laravel.com"]
}
```

#### Adding a site to a license

To add a site to a license, make a `PATCH` request to the `sites` endpoint, including the URL you wish to associate with the license:

| Param | Description                                                                                                                               |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| url   | The URL you wish to add to the license's `site` array. Gets stripped down to the base domain to support both `HTTP` and `HTTPS` requests. |

```php
Http::baseUrl('https://nova.laravel.com/api')
    ->withToken('{your-license-key}')
    ->patch('/sites', [
        'url' => 'http://example.com'
    ]);
```

#### Deleting a site from a license

To remove a site from a license, make a `DELETE` request to the `sites` endpoint, including the URL you wish to remove from the license:

| Param | Description                                                                                                                                    |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| url   | The URL you wish to remove from the license's `site` array. Gets stripped down to the base domain to support both `HTTP` and `HTTPS` requests. |

```php
Http::baseUrl('https://nova.laravel.com/api')
    ->withToken('{your-license-key}')
    ->delete('/sites', [
        'url' => 'http://example.com'
    ]);
```
