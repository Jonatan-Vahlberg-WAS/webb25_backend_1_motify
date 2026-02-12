-- Functions for Sqotify (run after BASE_TABLES + FURTHER_TABLES)

/* Format seconds as mm:ss - scalar function */
CREATE OR REPLACE FUNCTION format_duration(seconds INT)
RETURNS TEXT AS $$
BEGIN
    IF seconds IS NULL THEN
        RETURN '--:--';
    END IF;
    RETURN format('%s:%s', seconds / 60, LPAD((seconds % 60)::TEXT, 2, '0'));
END;
$$ LANGUAGE plpgsql IMMUTABLE;


/* Get total playcount for an artist - table-returning function */
CREATE OR REPLACE FUNCTION artist_total_plays(artist_name TEXT)
RETURNS TABLE(total_plays BIGINT, song_count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT COALESCE(SUM(s.playcount), 0)::BIGINT,
           COUNT(s.id)::BIGINT
    FROM songs s
    JOIN artists a ON a.id = s.artist_id
    WHERE a.name = artist_name;
END;
$$ LANGUAGE plpgsql;


/* Get artist's most popular song */
CREATE OR REPLACE FUNCTION artist_top_song(p_artist_id INT)
RETURNS TABLE(song_id INT, title TEXT, playcount BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT s.id, s.title, s.playcount
    FROM songs s
    WHERE s.artist_id = p_artist_id
    ORDER BY s.playcount DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;


/* Count songs in a playlist */
CREATE OR REPLACE FUNCTION playlist_song_count(p_playlist_id INT)
RETURNS INT AS $$
DECLARE
    cnt INT;
BEGIN
    SELECT COUNT(*)::INT INTO cnt
    FROM playlist_songs
    WHERE playlist_id = p_playlist_id;
    RETURN cnt;
END;
$$ LANGUAGE plpgsql;


/* Get total duration of a playlist in seconds (NULL durations count as 0) */
CREATE OR REPLACE FUNCTION playlist_duration(p_playlist_id INT)
RETURNS BIGINT AS $$
DECLARE
    total BIGINT;
BEGIN
    SELECT COALESCE(SUM(COALESCE(s.duration_seconds, 0)), 0) INTO total
    FROM playlist_songs ps
    JOIN songs s ON s.id = ps.song_id
    WHERE ps.playlist_id = p_playlist_id;
    RETURN total;
END;
$$ LANGUAGE plpgsql;


/* Check if a song is in a playlist - returns boolean */
CREATE OR REPLACE FUNCTION song_in_playlist(p_song_id INT, p_playlist_id INT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM playlist_songs
        WHERE song_id = p_song_id AND playlist_id = p_playlist_id
    );
END;
$$ LANGUAGE plpgsql;
