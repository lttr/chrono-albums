# Chrono albums

Static site generator for chronologically sorted photo albums.

## Phases

1. Generate structure

2. Generate optimized images

3. Generate web album

### 1. Generate structure

_Generate a json document which describes photo albums to be generated. The structure is consumed by next phases._

Example

given a directory structure like this:
```
photos
  2018
    2018-04-27 Trip
      photo1.jpg
      photo2.jpg
    2018-07 Summer vacation
      day1
        summer_02.jpg
      day2
        summer_03.jpg
  2019
    2019-02 Winter vacation
      selection01
        098-001-2344.jpg
        098-001-2345.jpg
```

the generator should output the following:
```json
[
  {
    "dateMark": "2018-04-27",
    "datetime": "2018-04-27T00:00:00.000Z",
    "albumName": "Trip",
    "photos": [
      {
        "name": "photo1",
        "fileName": "photo1.jpg",
        "sourcePath": "...../photo1.jpg"
      },
      {
        "name": "photo2",
        "fileName": "photo2.jpg",
        "sourcePath": "...../photo2.jpg"
      }
    ]
  },
  {
    "dateMark": "2018-07",
    "datetime": "2018-07-01T00:00:00.000Z",
    "albumName": "Summer vacation",
    "photos": [
      {
        "name": "summer_02",
        "fileName": "summer_02.jpg",
        "sourcePath": "...../summer_02.jpg"
      },
      {
        "name": "summer_03",
        "fileName": "summer_03.jpg",
        "sourcePath": "...../summer_03.jpg"
      }
    ]
  },
  {
    "dateMark": "2019-02",
    "datetime": "2019-02-01T00:00:00.000Z",
    "albumName": "Winter vacation",
    "photos": [
      {
        "name": "098-001-2344",
        "fileName": "098-001-2344.jpg",
        "sourcePath": "...../098-001-2344.jpg"
      },
      {
        "name": "098-001-2343",
        "fileName": "098-001-2343.jpg",
        "sourcePath": "...../098-001-2343.jpg"
      },
    ]
  }
]
```

### 2. Generate optimized images

_Generate optimized images according to a given structure document._

Given the example above, following images will be generated:
```
2018-04-27
  photo1_1920.jpg
  photo1_1024.jpg
  photo1_640.jpg
  photo1_256.jpg
  photo2_1920.jpg
  photo2_1024.jpg
  photo2_640.jpg
  photo2_256.jpg
2018-07
  summer_02_1920.jpg
  summer_02_1024.jpg
  summer_02_640.jpg
  summer_02_256.jpg
  summer_03_1920.jpg
  summer_03_1024.jpg
  summer_03_640.jpg
  summer_03_256.jpg
2019-02
  098-001-2344_1920.jpg
  098-001-2344_1024.jpg
  098-001-2344_640.jpg
  098-001-2344_256.jpg
  098-001-2345_1920.jpg
  098-001-2345_1024.jpg
  098-001-2345_640.jpg
  098-001-2345_256.jpg
```

### 3. Generate web album

_Generate a set of html pages with photo albums._

```
```