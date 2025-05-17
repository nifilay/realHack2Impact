const qr_schema = require('../models/QR');


const qr_create = async(req, res) => {
    const {donation_id} = req.body;

    const payload = JSON.stringify({donation_id});

    const qr_data_url = await QRCode.toDataURL(payload);
    res.json({ qrCode: qr_data_url });
}


const qr_scan = async(req, res) => {
    const {donation_id, location} = req.body;

    const donation = qr_schema.findOne({donation_id: donation_id});


}
