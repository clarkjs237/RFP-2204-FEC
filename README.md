# Backend Rebuild | Verde

# Getting started 

1. fork and clone repo to your local machine
2. run `npm install`
3. change the file path in the .sql file to preload your postgres database (assuming you would have access to the csv files, which is unrealistic)
4. `npm build` and `npm start`

At this point you should have a working example on your local machine that connects to the database you have set up for the Reviews module.

# Endpoints

`GET /reviews` returns reviews for a particular product, sorted by 'newest' by default.

`GET /reviews/meta` returns review metadata for a particular product.

`POST /reviews` adds a review for a particular product.

`PUT /reviews/:review_id/helpful` marks a review as helpful.

`PUT /reviews/:review_id/report` reports a review.




