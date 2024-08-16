.PHONY: all install relock lock lockci lint lintdeps precommit test retest

all: install precommit lint

install:
	poetry install --sync

relock:
	poetry lock
	@poetry export --only main --output thallium-backend/requirements.txt

lintdeps:
	@pre-commit run --files pyproject.toml poetry.lock thallium-backend/requirements.txt

lockci: relock lintdeps

lock: relock install lintdeps

lint:
	poetry run pre-commit run --all-files

precommit:
	poetry run pre-commit install

test:
	pytest -n 4 --ff

retest:
	pytest -n 4 --lf

revision:
	cd thallium-backend && poetry run alembic revision --autogenerate -m CHANGEME
