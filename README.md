# Edit Image (editimg)

![Release Workflow](https://github.com/davitp/editimg/actions/workflows/release.yml/badge.svg) ![NPM Version](https://img.shields.io/npm/v/%40davitp%2Feditimg)

The **editimg** is a lightweight command-line tool for performing basic image manipulations such as splitting, cropping, resizing, and more. It provides a simple and efficient way to process images directly from the terminal without the need for complex graphical software.

## Installation

### Prerequisites

- **Node.js**: Ensure that Node.js is installed on your system. You can download it from the [official website](https://nodejs.org/).

### Install via npm

To install **editimg** globally using npm, run the following command:

```bash
npm install -g @davitp/editimg
```

## Usage  

`editimg` provides various image manipulation commands. Below is an example usage for splitting images.  

### Split Images  
This command splits each image in the specified folder into multiple parts.  

```bash
editimg split -i FOLDER_WITH_IMAGES --parts N
```

| Option          | Description                              | Values                              |
|----------------|--------------------------------------|-------------------------------------|
| `-i, --input`  | The directory containing input images. | Path to a folder                   |
| `--parts <N>`  | Number of parts to split each image into. | **1, 2, 3, 4, 6, 8, 9, 12, 16**    |

### Split images into 4 parts  
```bash
editimg split -i ./images --parts 4
```