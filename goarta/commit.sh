#!/bin/bash

# Add all changes to the staging area
git add .

# Ask the user for a commit message
read -p "Enter commit message: " commit_message

# Commit the changes with the provided message
git commit -m "$commit_message"

# Push the changes to the remote repository
git push

echo "Git operations completed."
