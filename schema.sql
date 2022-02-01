DROP TABLE IF EXISTS addMovieTable;

CREATE TABLE IF NOT EXISTS addMovieTable (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    release_date DATE,
    poster_path VARCHAR(255),
    overview VARCHAR(255),
    personal_comment VARCHAR(255)
    );