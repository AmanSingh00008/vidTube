import {Router} from 'express';
import {createLike, getLike, updateLike, deleteLike} from '../controllers/like.controller.js';

const router = Router();

router.post('/likes', createLike);
router.get('/likes/:likeId', getLike);
router.put('/likes/:likeId', updateLike);
router.delete('/likes/:likeId', deleteLike);

export default router;