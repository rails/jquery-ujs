CHANGELOG
=========

Here is a non-exhaustive list of notable changes to jquery-ujs (oldest
to newest):

- [`085d910a5ec07b69`](https://github.com/rails/jquery-ujs/commit/085d910a5ec07b69f31beabce286141aa26f3005) last version before callback names updated
- [`72d875a8d57c6bb4`](https://github.com/rails/jquery-ujs/commit/72d875a8d57c6bb466170980a5142c66ac74e8f0) callback name updates completed
- [`e076121248913143`](https://github.com/rails/jquery-ujs/commit/e0761212489131437402a92fa8f548a78f685ae2) dropped support for jQuery 1.4, 1.4.1, 1.4.2 (separate [v1.4 branch](https://github.com/rails/jquery-ujs/commits/v1.4) created)
- [`498b35e24cdb14f2`](https://github.com/rails/jquery-ujs/commit/498b35e24cdb14f2d94486e8a1f4a1f661091426) last version before `.callRemote()` removed
- [`ec96408a746d3b06`](https://github.com/rails/jquery-ujs/commit/ec96408a746d3b0692da9249f218a3943fbffc28) `ACCEPTS` header data-type default changed to prefer `:js` but not require it
- [`fc639928d1e15c88`](https://github.com/rails/jquery-ujs/commit/fc639928d1e15c885b85de5b517346db7f963f44) default form method changed from `POST` to `GET`
- [`e9311550fdb3afeb`](https://github.com/rails/jquery-ujs/commit/e9311550fdb3afeb2917bcb1fef39767bf715003) added CSRF Protection to remote requests
- [`a284dd706e7d76e8`](https://github.com/rails/jquery-ujs/commit/a284dd706e7d76e85471ef39ab3efdf07feef374) CSRF fixed - changed to only add if token is present
- [`f9b21b3a3c7c4684`](https://github.com/rails/jquery-ujs/commit/f9b21b3a3c7c46840fed8127a90def26911fad3d) `ajax:before` added back
- [`ca575e184e93b3ef`](https://github.com/rails/jquery-ujs/commit/ca575e184e93b3efe1a858cf598f8a37f0a760cc) added `ajax:aborted:required` and `ajax:aborted:file` event hooks
- [`d2abd6f9df4e4a42`](https://github.com/rails/jquery-ujs/commit/d2abd6f9df4e4a426c17c218b7d5e05004c768d0) fixed submit and bubbling behavior for IE
- [`d59144177d867908`](https://github.com/rails/jquery-ujs/commit/d59144177d86790891fdb99b0e3437312e04fda2) created external api via `$.rails` object
