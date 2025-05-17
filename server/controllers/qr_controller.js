const qr_schema = require('../models/QR');


const qr_create = async(req, res) => {
    const {donation_id, email} = req.body;

    const payload = JSON.stringify({donation_id, email});

    const qr_data_url = await QRCode.toDataURL(payload);
    res.json({ qrCode: qr_data_url });
}
