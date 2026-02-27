import {Request, Response, Router} from 'express';
import {buildEnrichedPhotos, getEnrichedPhoto} from '../services/dataService';
import {EnrichedPhoto} from "../types";
import {sortBy} from "../utils/sort.utils";
import {StatusCodes} from 'http-status-codes';
import {DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_OFFSET} from "../configs/api.constants";
import logger from "../utils/logger";

const router: Router = Router();

// GET v1/api/photos/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const photo = await getEnrichedPhoto(Number(req.params.id));
    if (!photo) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Photo not found' });
    }
    return res.json(photo);
  } catch (err) {
    logger.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
});

// GET v1/api/photos
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      title,
      'album.title': albumTitle,
      'album.user.email': albumUserEmail,
      limit: limitStr,
      offset: offsetStr,
    } = req.query as Record<string, string>;

    const limit: number = limitStr !== undefined ? parseInt(limitStr) : DEFAULT_PAGINATION_LIMIT;
    const offset: number = offsetStr !== undefined ? parseInt(offsetStr) : DEFAULT_PAGINATION_OFFSET;

    if (isNaN(limit) || limit < 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid limit parameter' });
    }
    if (isNaN(offset) || offset < 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid offset parameter' });
    }

    let photos: EnrichedPhoto[] = await buildEnrichedPhotos();

    if (title) {
      const titleFilter: string = title.toLowerCase();
      photos = photos.filter((photo: EnrichedPhoto) => photo.loweredCaseTitle.includes(titleFilter));
    }

    if (albumTitle) {
      const albumFilter: string = albumTitle.toLowerCase();
      photos = photos.filter((photo: EnrichedPhoto) => photo.album?.loweredCaseTitle.includes(albumFilter));
    }

    if (albumUserEmail) {
      const emailFilter: string = albumUserEmail.toLowerCase();
      photos = photos.filter((photo: EnrichedPhoto) => photo.album?.user?.email.toLowerCase() === emailFilter);
    }

    const total: number = photos.length;
    const sortedPhotos: EnrichedPhoto[] = sortBy(photos, 'id');
    const paginatedPhotos: EnrichedPhoto[] = sortedPhotos.slice(offset, offset + limit);

    return res.json({
      total,
      limit,
      offset,
      data: paginatedPhotos,
    });
  } catch (err) {
    logger.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
});

export default router;
