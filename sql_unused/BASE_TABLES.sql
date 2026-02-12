DROP TABLE IF EXISTS songs CASCADE;
DROP TABLE IF EXISTS albums CASCADE;
DROP TABLE IF EXISTS artists CASCADE;

CREATE TABLE artists (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE albums (
    id SERIAL PRIMARY KEY,
    artist_id INT NOT NULL REFERENCES artists(id) ON DELETE CASCADE, -- Artist ID has to be present and not null and has to be a valid artist ID if the artist is deleted, the album will be deleted
    title TEXT NOT NULL,
    release_date DATE NOT NULL,
    UNIQUE (artist_id, title) -- Prevent duplicate albums by the same artist
);

CREATE TABLE songs (
    id SERIAL PRIMARY KEY,
    artist_id INT NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    duration_seconds INT CHECK (duration_seconds IS NULL OR duration_seconds > 0), -- Duration of the song has to be greater than 0 or null
    playcount BIGINT NOT NULL CHECK (playcount >= 0), -- Number of times the song has been played
    listeners BIGINT NOT NULL CHECK (listeners >= 0), -- Number of listeners has to be greater than 0
    album_id INT REFERENCES albums(id) ON DELETE SET NULL, -- Album ID has to be a valid album ID or null and if the album is deleted, the song will be set to null
    UNIQUE (artist_id, title) -- Prevent duplicate songs by the same artist
);