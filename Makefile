.PHONY: generate-model
generate-model:
	npx prisma generate

.PHONY: generate-migration
generate-migration:
	npx prisma migrate dev --create-only --name $(name)

.PHONY: migrate
migrate:
	npx prisma migrate deploy

.PHONY: run
run:
	pnpm start:dev
