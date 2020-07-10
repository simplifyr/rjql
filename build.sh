rm dist -r
npm run build
cp dist/rjql.min.js ../rjql-doc/public/rjql.min.js
cp dist/rjql.min.js ../simplifier/public/rjql.min.js
cp dist/rjql.js ../simplifier-backend/lib/validators/rjql.js