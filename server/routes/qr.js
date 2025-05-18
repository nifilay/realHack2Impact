import express from 'express';

import {qr_create, qr_scan} = require('../controllers/qr_controller.js');

const router = express.Router();

router.post('/create', qr_create);

router.post('/scan', qr_scan);
