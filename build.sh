rm dist -r
npm run build
cp dist/rjql.min.js ../rjql-doc/public/rjql.min.js
cp dist/rjql.min.js ../simplifyr/public/rjql.js
cp dist/rjql.js ../simplifyr-backend/lib/validators/rjql.js