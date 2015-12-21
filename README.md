
### Remap

A starter application for using React, Flux and Google Maps.

This app renders on the front-end with data over the wire. The web server is Express with a PassportJS `LocalStrategy` login which generates a JWT. The backend database is MongoDB which you need to run locally for development. When running in dev mode a test admin account is auto-generated in `server/config/seed.js`.

There are currently two api routes defined in `server/routes.js`:
* `/api/user` for login, signup and user data
* `/api/demo` for retrieving geolocation coordinates from IP addresses, using <http://freegeoip.net/>

The front end uses the following technologies:
* React 0.13.3
* Flux 2.1.1
* Google Maps JavaScript API
* Flexbox for CSS layouts

Dev tools are:
* Browserify for bundling front-end
* Gulp for tasks
* Less for CSS

#####Acknowledgments
- [TouchstoneJS](https://github.com/touchstonejs/touchstonejs) 0.3.2
- [Angular Fullstack](https://github.com/angular-fullstack/generator-angular-fullstack)
