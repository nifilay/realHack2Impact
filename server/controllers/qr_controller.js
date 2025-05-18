const Donation = require('../models/Donation');


const qr_create = async(req, res) => {
    const {email, clothing_type} = req.body;

    const new_donation = await Donation.create({email, clothing_type});
    const new_don_id = new_donation._id;
    
    const payload = JSON.stringify({new_don_id});

    const qr_data_url = await QRCode.toDataURL(payload);
    res.json({ qrCode: qr_data_url });

    await Donation.findByIdAndUpdate(new_don_id, {qr_code_url: qr_data_url});
}


const qr_scan = async(req, res) => {
    const {donation_id, location} = req.body;

    const donation = qr_schema.findOne({donation_id: donation_id});


}

module.exports = {qr_create, qr_scan}
