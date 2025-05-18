import Donation from '../models/Donation.js';
import QRCode from 'qrcode'


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

    const donation = await Donation.findById(donation_id);

    const old_loc_len = donation.scans.length;

    if(location == donation.scans.[old_loc_len - 1].location){
	res.status(409).json({error: "request submitted too many times"});
	return;
    }

    donation.scans.push({location, scan_date: new Date() });

    await donation.save();

    res.json({scans: donation.scans});


}

export { qr_create, qr_scan };
