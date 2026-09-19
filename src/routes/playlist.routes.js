import {Router} from 'express';
import {createSubscription, getSubscription, updateSubscription, deleteSubscription} from '../controllers/subscription.controller.js';  

const router = Router();

router.post('/subscriptions', createSubscription);
router.get('/subscriptions/:subscriptionId', getSubscription);
router.put('/subscriptions/:subscriptionId', updateSubscription);
router.delete('/subscriptions/:subscriptionId', deleteSubscription);