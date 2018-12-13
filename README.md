# libsw

This is a simple client library for Scrumwise API.

The official documentation is available [here](https://www.scrumwise.com/api.html)

## Usage

`npm install -S libsw`

The library offers some operations on different resources e.g. backlog items, sprints, tags, etc.

Every operation takes an `opts` object that must have at least two fields for authentication purpose: `email` and `apikey`.

The API key must be generated by an administrator in Scrumwise settings. The email address can be yours and it will identify you as the initiator of the actions that you will perform through the API.

## License

Copyright (c) 2018 Stormshield <https://www.stormshield.com>. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
