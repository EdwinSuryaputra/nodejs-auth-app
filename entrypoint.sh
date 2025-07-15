echo "⏳ Waiting for PostgreSQL..."
until nc -z postgres 5432; do
  sleep 1
done
echo "✅ PostgreSQL is up!"

echo "📦 Running prisma migrate deploy..."
npx prisma migrate deploy

echo "🌱 Seeding data..."
npx prisma db seed

echo "🚀 Starting the app..."
exec node dist/src/main
