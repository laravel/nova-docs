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

## Compiled Assets

If you are submitting a change that will affect a compiled file, such as most of the files in `resources/sass` or `resources/js` of the `laravel/nova` repository, do not commit the compiled files. Due to their large size, they cannot realistically be reviewed by a maintainer. This could be exploited as a way to inject malicious code into Laravel Nova. In order to defensively prevent this, all compiled files will be generated and committed by Laravel maintainers.

## Security Vulnerabilities

If you discover a security vulnerability within Laravel Nova, please send an email to nova@laravel.com. All security vulnerabilities will be promptly addressed.

## Code of Conduct

The Laravel code of conduct is derived from the Ruby code of conduct. Any violations of the code of conduct may be reported to Taylor Otwell (taylor@laravel.com):

- Participants will be tolerant of opposing views.
- Participants must ensure that their language and actions are free of personal attacks and disparaging personal remarks.
- When interpreting the words and actions of others, participants should always assume good intentions.
- Behavior which can be reasonably considered harassment will not be tolerated.
