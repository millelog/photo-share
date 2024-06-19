# Photo Share

Photo Share is a SvelteKit project designed for sharing and viewing photos and videos. It features a user-friendly interface for navigating folders, previewing files, and downloading selected items. Check out an example deployment at [photos.loganmiller.dev/wedding/photos](https://photos.loganmiller.dev/wedding/photos).

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Uploading Media](#uploading-media)
- [Supported File Types](#supported-file-types)
- [Features](#features)
- [Folder Navigation](#folder-navigation)
- [Preview and Download](#preview-and-download)
- [Deploying as a Docker Container](#deploying-as-a-docker-container)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/photo-share.git
    cd photo-share
    ```

2. Install dependencies:
    ```bash
    pnpm install
    ```

## Environment Variables

Create a `.env` file in the root of your project and set the following environment variables based on your setup:

```ini
NODE_ENV=development
PUBLIC_DEV_DATA_DIR=C:\Users\me\Pictures\photo-share
PUBLIC_PROD_DATA_DIR=/data
```

These variables specify the directories where your media files are stored. Adjust the paths according to your development and production environments.

## Running the Project

To start the development server, run:

```bash
pnpm run dev
```

This will launch the SvelteKit application at `http://localhost:3000`.

For production, build the application and start the server:

```bash
pnpm run build
pnpm run preview
```

## Uploading Media

Media files (images and videos) should be uploaded to the directory specified in your environment variables:

- For development: `PUBLIC_DEV_DATA_DIR`
- For production: `PUBLIC_PROD_DATA_DIR`

Organize your files in folders as desired. The application will automatically read and display the folder structure.

## Supported File Types

Photo Share supports the following file types:

- Images: `.jpg`, `.jpeg`, `.png`, `.gif`
- Videos: `.mp4`, `.avi`, `.mov`

Other file types will be listed but not previewed.

Sure! Here's an updated description of the components in the README file, including the `ImageViewer` component:

## Features

### Folder Navigation

The folder navigation component (`FolderNav.svelte`) allows users to browse through directories and select folders to view their contents.

### Grid View

The grid view component (`GridView.svelte`) displays a grid of media files (images and videos) in the selected folder. It allows users to:
- Preview files by clicking on them
- Select individual files using checkboxes
- Open a full-size preview of a file

### Image Viewer

The image viewer component (`ImageViewer.svelte`) provides a full-size preview of a selected image or video file. It offers the following features:
- Displays the full-size image or video
- Allows navigation to the previous or next file in the folder
- Provides a checkbox to select/deselect the current file
- Offers a download button to save the current file
- Supports closing the preview and returning to the grid view

### Download

The download component (`DownloadButton.svelte`) allows users to download selected files or all files in a folder. It provides the following options:
- Download selected files: Users can select individual files using checkboxes in the grid view and click the download button to download them as a ZIP archive.
- Download all files in a folder: Users can click the download button without selecting any files to download all files in the current folder as a ZIP archive.

These components work together to provide a seamless experience for navigating folders, previewing files, selecting files, and downloading them.

## Deploying as a Docker Container

The repository includes a `Dockerfile` for containerizing the Photo Share application. To deploy the application as a Docker container, follow these steps:

1. Build the Docker image:

    ```bash
    docker build -t photo-share .
    ```

2. Run the Docker container, mounting your media folder to `/data` in the container:

    ```bash
    docker run -d -p 3000:3000 -v /path/to/your/media:/data --name photo-share photo-share
    ```

   Replace `/path/to/your/media` with the path to your media folder on your host machine. This command maps the `/data` directory in the container to your local media folder, allowing the application to access your media files.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push to your branch.
5. Create a new Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
