DROP TABLE IF EXISTS playlist_songs CASCADE;
DROP TABLE IF EXISTS playlist CASCADE;

CREATE TABLE playlists (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (name)
);

/* Many-to-many relationship between songs and playlists */

/* Forms a many-to-many relationship between playlists and songs */
CREATE TABLE playlist_songs (
    playlist_id INT NOT NULL REFERENCES playlist(id) ON DELETE CASCADE,
    song_id INT NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    PRIMARY KEY (playlist_id, song_id),
    UNIQUE (playlist_id, song_id) -- Prevent duplicate entries
);