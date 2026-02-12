-- Views for Sqotify (run after BASE_TABLES + FURTHER_TABLES)

/* Full song details: joins song with artist and album names */
CREATE OR REPLACE VIEW v_songs_full AS
SELECT
    s.id,
    s.title AS song_title,
    a.name AS artist_name,
    al.title AS album_title,
    s.duration_seconds,
    s.playcount,
    s.listeners
FROM songs s
JOIN artists a ON a.id = s.artist_id
LEFT JOIN albums al ON al.id = s.album_id;


/* Playlists with song count and total duration */
CREATE OR REPLACE VIEW v_playlist_stats AS
SELECT
    p.id,
    p.name,
    p.description,
    COUNT(ps.song_id) AS song_count,
    COALESCE(SUM(s.duration_seconds), 0) AS total_duration_seconds
FROM playlist p
LEFT JOIN playlist_songs ps ON ps.playlist_id = p.id
LEFT JOIN songs s ON s.id = ps.song_id
GROUP BY p.id, p.name, p.description;


/* Artist statistics: song count, total plays, total listeners */
CREATE OR REPLACE VIEW v_artist_stats AS
SELECT
    a.id,
    a.name,
    COUNT(s.id) AS song_count,
    COALESCE(SUM(s.playcount), 0) AS total_playcount,
    COALESCE(SUM(s.listeners), 0) AS total_listeners
FROM artists a
LEFT JOIN songs s ON s.artist_id = a.id
GROUP BY a.id, a.name;


/* Top 10 songs by playcount */
CREATE OR REPLACE VIEW v_top_songs AS
SELECT
    s.id,
    s.title,
    a.name AS artist_name,
    s.playcount,
    s.listeners
FROM songs s
JOIN artists a ON a.id = s.artist_id
ORDER BY s.playcount DESC
LIMIT 10;
