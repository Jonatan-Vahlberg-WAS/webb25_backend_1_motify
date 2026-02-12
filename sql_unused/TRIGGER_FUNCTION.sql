-- Trigger: when a song is added to a playlist, update that playlist's timestamp.
-- NEW = the new row being inserted (it has playlist_id and song_id)
-- Can be amended to update the timestamp when a song is removed from a playlist.

CREATE OR REPLACE FUNCTION tf_update_playlist_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE playlist
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.playlist_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_playlist_songs_updated ON playlist_songs;
CREATE TRIGGER tr_playlist_songs_updated
AFTER INSERT ON playlist_songs
FOR EACH ROW
EXECUTE PROCEDURE tf_update_playlist_timestamp();


-- Audit: when a song's playcount passes 20 million, log it as a "top song"
-- (Seed data ranges from ~800K to ~57M; 20M catches the upper tier)
-- OLD = row before update, NEW = row after update

DROP TABLE IF EXISTS audit_top_songs CASCADE;
CREATE TABLE audit_top_songs (
    id SERIAL PRIMARY KEY,
    song_id INT NOT NULL,
    song_title TEXT NOT NULL,
    artist_name TEXT NOT NULL,
    playcount BIGINT NOT NULL,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION tf_audit_top_songs()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.playcount >= 20000000) AND (OLD.playcount < 20000000) THEN
        INSERT INTO audit_top_songs (song_id, song_title, artist_name, playcount)
        SELECT NEW.id, NEW.title, a.name, NEW.playcount
        FROM artists a
        WHERE a.id = NEW.artist_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_audit_top_songs ON songs;
CREATE TRIGGER tr_audit_top_songs
AFTER UPDATE ON songs
FOR EACH ROW
EXECUTE PROCEDURE tf_audit_top_songs();
