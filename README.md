# AeroGIS

![AeroGIS Logo](./assets/aerogis-thumbnail.png)

AeroGIS is a spatially enabled website that visualises global airline routes and airport data using the Google Maps API.

The site uses the following datasets:

- OpenFlights (Routes + Planes)
- OurAirports (Airports + Runways)
- UK Boundaries (Country Boundaries)

For a comprehensive list of datasets, their sources and any modifications, please refer to the [README](./datasets/README.md) in the `datasets` directory.

This project was created as part of IS3S665 - GIS and the Spatial Web at the University of South Wales (USW).

The curriculum for the module can be found here: [IS3S665 - GIS and the Spatial Web](https://curriculum.southwales.ac.uk/Module/Details?moduleId=MOD009109)

## Features

TODO

## Getting Started

To run the project locally, a Google Maps API key is required.

An API key can be obtained from the [Google Cloud Console](https://console.cloud.google.com/) using the following guide: [Set up the Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/get-api-key).

Once you have an API key, you will need to add it into `setApiKey.js`.

```js
apiKey = "YOUR_API_KEY_HERE"; // Replace with your actual API key
```

**Note:** This file is ignored by Git so your API key will not be committed to the repository. It can be re-ignored using the following command:

```bash
git update-index --assume-unchanged src/setApiKey.js
```

Or un-ignored using:

```bash
git update-index --no-assume-unchanged src/setApiKey.js
```

After adding your API key, you can open `index.html` in a web browser to view the project.

## Linting and Formatting

This project uses GitHub Actions to run Prettier and Markdownlint on push and pull requests to the `main` branch. These action can be found in the `.github/workflows` directory.

These action will check for formatting and linting issues in the codebase. If any issues are found, the action will fail and provide feedback on what needs to be fixed.

To fix any issues, you will need to run the tools locally using the instructions below.

**Credit:**

- [Prettier](https://prettier.io/)
- [Markdownlint-cli](https://github.com/igorshubovych/markdownlint-cli)

### Prettier

To run Prettier locally, you will need to have Node.js and npm installed. You can then install Prettier using the following command:

```bash
npm install --global prettier
```

**Note:** This installs Prettier globally on your system. If you prefer to install it locally to the project, you can run `npm install --save-dev prettier` instead.

Once Prettier is installed, you can run it on the project using the following command:

```bash
prettier --write .
```

### Markdownlint

#### Docker Installation (Recommended)

To run Markdownlint using Docker, you will need to have Docker or Podman installed. You can then run the following command from the root of the project:

```bash
docker run -v $PWD:/workdir ghcr.io/igorshubovych/markdownlint-cli:latest "**/*.md"
```

If using Podman, simply replace `docker` with `podman` in the command above.

#### Node.js Installation

To run Markdownlint locally, you will need to have Node.js and npm installed. You can then install Markdownlint using the following command:

```bash
npm install --global markdownlint-cli
```

**Note:** This installs Markdownlint globally on your system. If you prefer to install it locally to the project, you can run `npm install --save-dev markdownlint-cli` instead.

Once Markdownlint is installed, you can run it on the project using the following command:

```bash
markdownlint . --fix
```
