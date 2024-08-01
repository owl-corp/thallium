# Thallium

# Contributing
Run `make` from the project root to both install this project's dependencies & install the pre-commit hooks.
- This requires both [make](https://www.gnu.org/software/make/) & [poetry](https://python-poetry.org/) to be installed.

## Other make targets
- `make lint` will run the pre-commit linting against all files in the repository
- `make lock` wil relock project dependencies and update the [`requirements.txt`](./requirements.txt) file with production dependencies
