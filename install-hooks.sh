#!/bin/sh
cp hooks/pre-commit .git/hooks/pre-commit
cp hooks/post-commit .git/hooks/post-commit

chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/post-commit

echo "Git hooks have been installed."
