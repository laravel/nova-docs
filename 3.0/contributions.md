# Contribution Guide

[[toc]]

## Contributing

Laravel Nova is a closed-source project and as such is not publicly available; however, you may authorize one GitHub account to the Nova repository. You can manage the authorized account at [https://nova.laravel.com/settings#github](https://nova.laravel.com/settings#github)

:::tip Changing Authorized Account
You will need to disconnect the currently connected account before re-authorizing another.
::: 

### Compiled Assets

If you are submitting a change that will affect a compiled file, such as most of the files in `resources/sass` or `resources/js` of the `laravel/nova` repository, do not commit the compiled files. Due to their large size, they cannot realistically be reviewed by a maintainer. This could be exploited as a way to inject malicious code into Laravel Nova. In order to defensively prevent this, all compiled files will be generated and committed by Laravel maintainers.

## Security Vulnerabilities

If you discover a security vulnerability within Laravel Nova, please send an email to nova@laravel.com. All security vulnerabilities will be promptly addressed.

## Code of Conduct

The Laravel code of conduct is derived from the Ruby code of conduct. Any violations of the code of conduct may be reported to Taylor Otwell (taylor@laravel.com):

- Participants will be tolerant of opposing views.
- Participants must ensure that their language and actions are free of personal attacks and disparaging personal remarks.
- When interpreting the words and actions of others, participants should always assume good intentions.
- Behavior which can be reasonably considered harassment will not be tolerated.
