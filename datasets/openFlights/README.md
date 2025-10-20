# OpenFlights Dataset

The OpenFlights dataset is another source of global airport information, including details such as airport codes, names, locations, and other relevant attributes. Within this project, we make use of their routes and planes datasets, which contain a range of aviation routes worldwide.

The dataset can also integrate with other datasets, such as OurAirports, using the shared airport codes (IATA and ICAO).

**Example output in QGIS:**

![OpenFlights in QGIS](../assets/openFlights-qgis.png)

## Source

This dataset was sourced from OpenFlights:

[OpenFlights Data](https://openflights.org/data)

The datasets are available in `.dat` format (basically CSV) and include various attributes for each route and plane.

OpenFlights provide documentation for the columns within each dataset on their website. For ease of use, I have added these columns to the first line of each `.dat` file.

## Use in the Project

This dataset provides some supplementary information for the project. The OpenFlights `routes.dat` file provides additional data on aviation routes worldwide, while the `planes.dat` file contains information about different aircraft types on each route.

This dataset is used to supplement the primary OurAirports dataset, providing additional context and information for aviation analyses. In order to match the routes to UK airports, we need to use the OpenFlights airports dataset (`airports.dat`) as an initial join table, then join that to the OurAirports UK airports dataset on the IATA and ICAO codes.

## Data Modifications

To make this dataset more suitable for use within the project, the following modifications were made:

- Added column headers to the first line of each `.dat` file for easier understanding and use.
  - The column headers were sourced from the OpenFlights website documentation.
- Converted the `.dat` files to CSV format for easier handling and compatibility with various software.
  - The modified files are saved as `openFlights-routes.csv`, `openFlights-planes.csv` and `openFlights-airports.csv`.

### Routes Dataset

In order to downsize the routes dataset, I had to filter it to only include routes that either originated or terminated at a UK airport.
This was done using the following process:

TODO
