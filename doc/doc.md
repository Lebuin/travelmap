# Translate KML file to JSON:

* Remove the XML tags
* Run `sed -e 's/\(.*\)/\[\1\],/' input.kml > output.json`
* Put the following at the beginning of the file:

```
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
```

* Put the following at the end of the file:

```
        ]
      }
    }
  ]
}
```

* Put the following between segments:

```
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "type": "bus"
      },
      "geometry": {
        "type": "LineString",
        "coordinates": [
```
