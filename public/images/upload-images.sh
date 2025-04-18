#!/bin/bash

echo "Uploading images to repository..."

# Add the images to git
git add model-guide.jpg garment-guide.jpg

# Commit the changes
git commit -m "Update model and garment guide images"

# Push to the repository
git push

echo "Images uploaded successfully!" 