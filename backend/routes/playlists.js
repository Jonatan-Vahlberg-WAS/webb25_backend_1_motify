import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { isPlaylistOwner, canAccessPlaylist } from '../middleware/ownership.js';

import {
  getLatestPlaylists,
  getMyPlaylists,
  getPublicPlaylists,
  createMyPlaylist,
  updateMyPlaylist,
  deleteMyPlaylist,
  getPlaylistById,
  sharePlaylist,
  getPlaylistsSharedWithMe
} from '../controllers/playlistController.js';

const router = Router();

router.get('/latest', getLatestPlaylists);

router.get('/my', requireAuth, getMyPlaylists);

router.post('/my', requireAuth, createMyPlaylist);

router.put('/my/:id', requireAuth, isPlaylistOwner, updateMyPlaylist);

router.delete('/my/:id', requireAuth, isPlaylistOwner, deleteMyPlaylist);

router.post('/my/:id/share', requireAuth, isPlaylistOwner, sharePlaylist);

router.get('/shared-with-me', requireAuth, getPlaylistsSharedWithMe);

router.get('/', getPublicPlaylists);

router.get('/:id', canAccessPlaylist, getPlaylistById);

export default router;