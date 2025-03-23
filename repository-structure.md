```
sukitsubaki/pixTrail/
├── CODE_OF_CONDUCT.md
├── LICENSE
├── README.md
├── SECURITY.md
├── TEAM.md
├── build_docs.py
├── mkdocs.yml
├── pyproject.toml
├── requirements.txt
├── setup.py
├── docs/
│   ├── architecture.md
│   ├── cli.md
│   ├── contributing.md
│   ├── faq.md
│   ├── getting-started.md
│   ├── index.md
│   ├── installation.md
│   ├── troubleshooting.md
│   ├── usage.md
│   ├── web-interface.md
│   ├── api/
│   │   ├── core.md
│   │   ├── exif.md
│   │   ├── gpx.md
│   │   ├── index.md
│   │   └── utils.md
│   ├── assets/
│   │   ├── pixtrail-web-interface.png
│   │   ├── shimizu-yuki.jpg
│   │   ├── tanaka-keisuke.jpg
│   │   └── tsubaki-suki.jpg
│   ├── development/
│   │   ├── css-architecture.md
│   │   ├── index.md
│   │   ├── module-structure.md
│   │   └── testing.md
│   ├── tutorials/
│   │   ├── batch-processing.md
│   │   ├── custom-visualizations.md
│   │   ├── index.md
│   │   └── photo-journey.md
│   └── visualization/
│       ├── clustering.md
│       ├── heatmap.md
│       ├── index.md
│       └── statistics.md
├── examples/
│   ├── README.md
│   ├── example_script.py
│   ├── example_output/
│   │   ├── track.gpx
│   │   └── track2.gpx
│   └── example_photos/
│       ├── BDH_10_1I_0015.jpg
│       ├── BDH_10_1I_0127.jpg
│       ├── BDH_10_1I_0163.jpg
│       ├── BDH_10_1I_0174.jpg
│       ├── BDH_10_1I_0180.jpg
│       ├── BDH_10_1I_0181.jpg
│       ├── BDH_10_1I_0196.jpg
│       ├── BDH_10_1I_0382.jpg
│       ├── BDH_10_1I_0384.jpg
│       ├── BDH_10_1I_0452.jpg
│       ├── BDH_10_1I_0472.jpg
│       ├── BDH_10_1I_0477.jpg
│       ├── BDH_10_1I_0499.jpg
│       ├── BDH_10_1I_0511.jpg
│       ├── BDH_10_1I_0557.jpg
│       ├── BDH_10_1I_0617.jpg
│       ├── BDH_10_1I_0651.jpg
│       ├── BDH_10_1I_0676.jpg
│       ├── BDH_10_1I_0732.jpg
│       └── LICENSE.txt
├── pixtrail/
│   ├── __init__.py
│   ├── __main__.py
│   ├── cli.py
│   ├── core.py
│   ├── exif_reader.py
│   ├── gpx_generator.py
│   ├── utils.py
│   └── web/
│       ├── __init__.py
│       ├── routes.py
│       ├── server.py
│       ├── static/
│       │   ├── css/
│       │   │   ├── main.css
│       │   │   ├── base/
│       │   │   │   ├── reset.css
│       │   │   │   ├── typography.css
│       │   │   │   └── variables.css
│       │   │   ├── layouts/
│       │   │   │   ├── container.css
│       │   │   │   └── grid.css
│       │   │   └── modules/
│       │   │       ├── buttons.css
│       │   │       ├── dropdown.css
│       │   │       ├── footer.css
│       │   │       ├── forms.css
│       │   │       ├── header.css
│       │   │       ├── map-section.css
│       │   │       ├── photo-section.css
│       │   │       ├── statistics-section.css
│       │   │       ├── status-messages.css
│       │   │       └── utilities.css
│       │   └── js/
│       │       ├── main.js
│       │       ├── api/
│       │       │   └── apiClient.js
│       │       ├── modules/
│       │       │   ├── charts.js
│       │       │   ├── clustering.js
│       │       │   ├── dragAndDrop.js
│       │       │   ├── exifReader.js
│       │       │   ├── fileUpload.js
│       │       │   ├── heatmap.js
│       │       │   ├── mapVisualization.js
│       │       │   └── statistics.js
│       │       └── utils/
│       │           ├── domHelpers.js
│       │           ├── fileUtils.js
│       │           ├── gpsUtils.js
│       │           └── uiUtils.js
│       └── templates/
│           └── index.html
└── tests/
    ├── __init__.py
    ├── test_core.py
    ├── test_exif_reader.py
    ├── test_gpx_generator.py
    └── test_utils.py
```
