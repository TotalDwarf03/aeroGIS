# Land, Sea and Air

![Land, Sea and Air Thumbnail](./assets/land-sea-and-air-thumbnail.png)

Land, Sea and Air is a website built on top of the Google Maps API and the OpenFlights dataset. The site helps you travel the world by Plane, Train or Ferry.

- [Google Maps API](https://developers.google.com/maps/documentation/javascript/overview)
- [OpenFlights Dataset](https://openflights.org/data)

This project was created as part of IS3S665 - GIS and the Spatial Web at the University of South Wales (USW).

The curriculum for the module can be found here: [IS3S665 - GIS and the Spatial Web](https://curriculum.southwales.ac.uk/Module/Details?moduleId=MOD009109)

## Features

TODO

## Getting Started

To run the project locally, a Google Maps API key is required.

An API key can be obtained from the [Google Cloud Console](https://console.cloud.google.com/) using the following guide: [Set up the Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/get-api-key).

Once you have an API key, you will need to add it into `setApiKey.js`.

```js
apiKey = 'YOUR_API_KEY_HERE'; // Replace with your actual API key
```

**Note:** This file is ignored by Git so your API key will not be committed to the repository. It can be re-ignored using the following command:

```bash
git update-index --assume-unchanged src/setApiKey.js
```

After adding your API key, you can open `index.html` in a web browser to view the project.
