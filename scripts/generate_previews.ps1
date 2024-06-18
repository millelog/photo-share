#scripts/generate_previews.ps1
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
