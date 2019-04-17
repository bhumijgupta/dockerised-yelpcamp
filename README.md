# YelpCamp

This is the dockerised version of [YelpCamp](https://github.com/bhumijgupta/yelpcamp)<br>The website is a platform for camping enthusiasts to share new campgrounds and comment on other campgrounds.

![Docker](https://img.shields.io/badge/image%20size-910MB-blue.svg) ![npmV](https://img.shields.io/badge/npm-6.9.0-brightgreen.svg) ![NodeV](https://img.shields.io/badge/node-v10.15.3-brightgreen.svg)

## Functionality

- Users can signup and create new campground
- Users can also comment on the existing campgrounds
- The publisher of the campground/comment can edit/delete the campground/comment

## Development

1. Clone the repo on local machine
2. Cd into the repo
3. To start:

```bash
docker-compose up
```

use `-d` flag to compose in background

4.  The app will be available on [localhost:3000](http://localhost:3000/)
5.  To stop:

```bash
docker-compose down
```
