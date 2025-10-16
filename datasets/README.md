# Datasets

## Overview

This file documents the different datasets used in this project, and their respective sources.

Lots of these datasets have been modified to suit the needs of this project. These changes will be documented in the relevant sections below.

## Contents

- [Datasets](#datasets)
  - [Overview](#overview)
  - [Contents](#contents)
  - [Sources](#sources)
    - [OpenFlights](#openflights)
      - [OpenFlights Overview](#openflights-overview)
      - [OpenFlights Cleansing Process](#openflights-cleansing-process)
        - [`airports-extended.dat`](#airports-extendeddat)
        - [`routes.dat`](#routesdat)
        - [OpenFlights Output Summary](#openflights-output-summary)
    - [UK Boundaries](#uk-boundaries)
      - [UK Boundaries Overview](#uk-boundaries-overview)
      - [UK Boundaries Cleansing Process](#uk-boundaries-cleansing-process)
      - [UK Boundaries Output Summary](#uk-boundaries-output-summary)

## Sources

### OpenFlights

**Source:** [OpenFlights Website](https://openflights.org/data)
**GitHub Repository:** [OpenFlights GitHub](https://github.com/jpatokal/openflights/tree/master/data)

#### OpenFlights Overview

OpenFlights provides a comprehensive dataset of global airport information, including details such as airport codes, names, locations, and other relevant attributes. This dataset is widely used in aviation-related applications and research.

From this dataset, I have selected the following for this project:

- `airports-extended.dat`: A CSV file containing a list of airports, train stations and ferry terminals across the globe.
- `routes.dat`: A CSV file containing a list of airline routes across the globe.
- `planes.dat`: A CSV file containing a list of aircraft types and their respective details.

#### OpenFlights Cleansing Process

##### `airports-extended.dat`

1. Converted the CSV file to GeoJSON format to allow for more QGIS functionality.
2. Filtered the dataset to only include the following:
   - Airports, train stations and ferry terminals within the United Kingdom.
   - Remove any entries where the type is "unknown".

   **This step has provided the first output dataset:** `airports-uk.geojson` (Called `airports-extended-geo-uk-only.geojson` in the `qgis` folder).

3. Filter the dataset further to only include airports (removing train stations and ferry terminals).
4. Remove any attributes that are not necessary for joining. Kept the following attributes:
   - `airport_id` - Used to join to the routes dataset.
   - `country` - To confirm the airport is in the UK.
   - `type` - To confirm the airport is an airport (not a train station or ferry terminal).

   **This step has provided the second output dataset:** `airports-uk-join.geojson` (Called `airports-extended-geo-uk-only-join.geojson` in the `qgis` folder).

   This output is used as a utility to help filter the routes dataset.

##### `routes.dat`

Here, we need to create 2 outputs:

- Routes from the UK to anywhere in the world.
- Routes from anywhere in the world to the UK.

1. Load the `routes.dat` CSV file into QGIS.
2. Do a join with the `airports-uk-join.geojson` dataset to get all routes where the source airport is in the UK.
3. Filter the virtual layer to remove any routes where the join did not find a match (i.e. the source airport is not in the UK).
4. Export the joined dataset to GeoJSON format.

Repeat but this time, do the join on the destination airport to get all routes where the destination airport is in the UK.

This process has provided the following datasets (found within the `qgis` folder):

- `routes-from-uk.geojson`
- `routes-to-uk.geojson`

Once we have these datasets, we can combine them to get all routes that either start or end in the UK.

This has created another dataset (found within the `qgis` folder):

- `routes-uk-temp.geojson`

We finally need to attach the geometries of each airport to the routes dataset and remove any unnecessary attributes.

This has created the final routes dataset:

- `routes-uk.geojson`

Unfortunately, this step does not attach the geometries as geojson expects. We need to do some further processing to convert the CSV columns into actual geometries.
Additionally, we need to filter out any duplicate routes (i.e. routes that appear in both directions).

1. Convert the GeoJSON file to a CSV file (`routes-uk-duplicates.csv` in the `filtered` folder).
2. Using a CSV tool (I used Rainbow CSV), filter out any duplicate routes. I did this by running the following RBQL query:

   ```sql
   SELECT DISTINCT *
   ```

   Then copying the results to a new CSV file (`routes-uk.csv` in the `filtered` folder).

3. We need to organise the CSV to make the conversion to GeoJSON easier. I did this by organising the CSV file into 2 separate CSV files:
   - A list of source airports with their geometries (`source-airports.csv`).

     This was done using the following RBQL query:

     ```sql
     SELECT DISTINCT
       a.uid,
       a.equipment,
       a.source_name,
       a.source_city,
       a.source_country,
       a.source_lat,
       a.source_long
     ```

     And copying the results to a new CSV file.

   - A list of destination airports with their geometries (`destination-airports.csv`).

     This was done using the following RBQL query:

     ```sql
     SELECT DISTINCT
       a.uid,
       a.equipment,
       a.dest_name,
       a.dest_city,
       a.dest_country,
       a.dest_lat,
       a.dest_long
     ```

     And copying the results to a new CSV file.

4. With the 2 new CSV files, I then converted them both to GeoJSON using QGIS. I loaded each CSV file's latitude and longitude columns as point geometries, and exported them to GeoJSON format.

   This created the following datasets (found within the `filtered` folder):
   - `source-airports.geojson`
   - `destination-airports.geojson`

##### OpenFlights Output Summary

Following the cleansing process, the following datasets will be used in the project:

- `airports-uk.geojson`: A GeoJSON file containing a list of airports, train stations and ferry terminals within the UK.
- `source-airports.geojson`: A GeoJSON file containing a list of source airports (with geometries) for routes that either start or end in the UK.
- `destination-airports.geojson`: A GeoJSON file containing a list of destination airports (with geometries) for routes that either start or end in the UK.

These datasets have been copied to an output folder and prefixed with their respective source for easier access within the web application.

- `openflights-airports-uk.geojson`
- `openflights-routes-source-airports.geojson`
- `openflights-routes-destination-airports.geojson`

### UK Boundaries

**Source:** [UK Boundaries](https://www.data.gov.uk/dataset/96f3e623-6e54-4df2-808c-48dba5c98b55/countries-december-2021-boundaries-uk-bgc)

#### UK Boundaries Overview

The UK Boundaries dataset provides a detailed polygon of the countries within the United Kingdom. This dataset will help in visualizing the geographical context of the airports and routes within the UK. The dataset is provided in GeoJSON format by the Office for National Statistics.

#### UK Boundaries Cleansing Process

The dataset was downloaded as a GeoJSON file and loaded into QGIS.
The GeoJSON consist of 4 parts, one for each country in the UK (England, Scotland, Wales and Northern Ireland).

Each part contains a polygon representing the country's boundaries, and a latitude and longitude attribute representing the country's centroid. These centroid will be useful when it comes to working on the web application.

Within the project I don't want to fill in each country with a colour, instead I want to just show the boundaries.
To make this happen, I converted the polygons to lines using QGIS's "Polygon to Lines" tool (Vector > Geometry Tools > Polygon to Lines) and saved it to a new GeoJSON file (`uk-boundary-lines.geojson` within the `filtered` folder).

#### UK Boundaries Output Summary

Following the cleansing process, the following dataset will be used in the project:

- `uk-boundary-lines.geojson`: A GeoJSON file containing the boundaries of the countries within the UK.

This dataset has been copied to an output folder for easier access within the web application.
