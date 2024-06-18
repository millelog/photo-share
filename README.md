# Photo Share

Photo Share is a SvelteKit project designed for sharing and viewing photos and videos. It features a user-friendly interface for navigating folders, previewing files, and downloading selected items.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Uploading Media](#uploading-media)
- [Supported File Types](#supported-file-types)
- [Features](#features)
- [Folder Navigation](#folder-navigation)
- [Preview and Download](#preview-and-download)
- [Scripts](#scripts)
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

## Features

### Folder Navigation

The folder navigation component (`FolderNav.svelte`) allows users to browse through directories and select folders to view their contents.

### Preview and Download

- **GridView**: Displays a grid of media files. Clicking on a file opens a preview.
- **Preview**: Users can preview images and videos in a modal.
- **Download**: Users can select individual files or all files in a folder for download.

### Scripts

The project includes a PowerShell script (`generate_previews.ps1`) for generating preview images using `ffmpeg`. This script resizes images for faster loading:

```powershell
# Define paths
$sourceDir = "C:\Users\Logan\Pictures\photo-share\wedding\photos"
$destinationDir = Join-Path $sourceDir "prev"

# Create destination directory if it doesn't exist
if (-Not (Test-Path $destinationDir)) {
    New-Item -ItemType Directory -Path $destinationDir | Out-Null
}

# Function to resize image using ffmpeg
function Resize-Image($inputPath, $outputPath, $maxSize) {
    $command = "ffmpeg -i `"$inputPath`" -vf `"scale='if(gt(iw,ih),$maxSize,-1)':'if(gt(iw,ih),-1,$maxSize)'`" `"$outputPath`""
    Invoke-Expression $command
}

# Process all jpg files in the source directory
Get-ChildItem -Path $sourceDir -Filter *.jpg | ForEach-Object {
    $inputPath = $_.FullName
    $outputPath = Join-Path $destinationDir $_.Name
    Resize-Image $inputPath $outputPath 400
}

Write-Host "All images have been resized and saved in the 'prev' folder."
```

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
