-- Playlists (run after BASE_TABLES + SEED_DATA)

INSERT INTO playlist (id, name, description) VALUES
(1, 'Reggaeton & Perreo', 'Latin trap and reggaeton for the club'),
(2, 'Indie Dream Pop', 'Dreamy indie and bedroom pop'),
(3, 'Sad Girl Autumn', 'Breakup anthems and heartbreak ballads'),
(4, '90s Alt Essentials', 'Alternative and art rock from the 90s'),
(5, 'Pop Bangers 2024', 'The biggest pop hits of the year'),
(6, 'Late Night Drive', 'Moody synths and introspective vibes'),
(7, 'Coffee Shop Indie', 'Chill acoustic and indie folk'),
(8, 'Viral TikTok Hits', 'Songs that broke the internet');


INSERT INTO playlist_songs (playlist_id, song_id) VALUES
(1, 1), (1, 2), (1, 4), (1, 37), (1, 7), (1, 8),
(2, 17), (2, 20), (2, 16), (2, 44), (2, 41), (2, 40), (2, 3),
(3, 21), (3, 28), (3, 18), (3, 47), (3, 50), (3, 11), (3, 14), (3, 29),
(4, 24), (4, 31), (4, 40), (4, 50),
(5, 18), (5, 42), (5, 25), (5, 10), (5, 5), (5, 15), (5, 49), (5, 23), (5, 43),
(6, 22), (6, 32), (6, 36), (6, 34), (6, 53), (6, 9), (6, 48), (6, 39),
(7, 29), (7, 11), (7, 14), (7, 17), (7, 16), (7, 50),
(8, 42), (8, 18), (8, 9), (8, 17), (8, 16), (8, 41), (8, 28), (8, 24), (8, 40);


SELECT setval('playlist_id_seq', (SELECT MAX(id) FROM playlist));
