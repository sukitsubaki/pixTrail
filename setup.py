from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="pixtrail",
    version="2.3.1",
    author="Suki Tsubaki",
    description="Extract GPS data from photos and create GPX files",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/sukitsubaki/pixtrail",
    packages=find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    license="MIT",
    python_requires=">=3.6",
    install_requires=[
        "exifread>=3.0.0",
        "gpxpy>=1.5.0",
        "pillow>=9.0.0",
    ],
    extras_require={
        "web": [
            "flask>=2.0.0",
            "werkzeug>=2.0.0",
        ],
        "dev": [
            "pytest>=6.0.0",
            "black>=21.5b2",
            "mypy>=0.812",
            "isort>=5.9.1",
            "mkdocs>=1.4.0",
            "mkdocs-material>=8.0.0",
        ],
    },
    entry_points={
        "console_scripts": [
            "pixtrail=pixtrail.cli:main",
        ],
    },
    include_package_data=True,
    package_data={
        "pixtrail.web": [
            "templates/*.html",
            "static/css/*.css",
            "static/js/*.js",
            "static/img/*.png",
        ],
    },
)
