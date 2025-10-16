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
      - [Overview](#overview-1)
      - [Cleansing Process](#cleansing-process)
        - [`airports-extended.dat`](#airports-extendeddat)
        - [`routes.dat`](#routesdat)
    - [UK Boundaries](#uk-boundaries)
      - [Overview](#overview-2)
      - [Modifications](#modifications)

## Sources

### OpenFlights

**Source:** [OpenFlights Website](https://openflights.org/data)
**GitHub Repository:** [OpenFlights GitHub](https://github.com/jpatokal/openflights/tree/master/data)

#### Overview

OpenFlights provides a comprehensive dataset of global airport information, including details such as airport codes, names, locations, and other relevant attributes. This dataset is widely used in aviation-related applications and research.

From this dataset, I have selected the following for this project:

- `airports-extended.dat`: A CSV file containing a list of airports, train stations and ferry terminals across the globe.
- `routes.dat`: A CSV file containing a list of airline routes across the globe.
- `planes.dat`: A CSV file containing a list of aircraft types and their respective details.

#### Cleansing Process

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

TODO: The geometries are attached as CSV columns. We need to convert these to actual geometries.

### UK Boundaries

**Source:** [UK Boundaries](https://www.data.gov.uk/dataset/96f3e623-6e54-4df2-808c-48dba5c98b55/countries-december-2021-boundaries-uk-bgc)

#### Overview

The UK Boundaries dataset provides an outline of the countries within the United Kingdom, including England, Scotland, Wales, and Northern Ireland. This dataset will help in visualizing the geographical context of the airports and routes within the UK. The dataset is provided in GeoJSON format by the Office for National Statistics.

#### Modifications

In order to make this dataset suitable for the project, the following modifications were made:

- Converted the CRS from EPSG:27700 to EPSG:4326 to ensure compatibility with other datasets used in the project and mapping libraries.
- Simplified the geometries to reduce file size and improve performance when rendering on maps, while maintaining an acceptable level of detail. (TODO: detail tolerance and actually filter the geometries)

