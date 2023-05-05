const mongoose = require('mongoose');

const subSectorSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
    },
    description: {
        type: String,
        default: '',
    },
    icon: {
        type: String,
        default: '',
    },
    image: {
        type: String,
        default: '/subsectors/no-image.png',
    },
    sector: {
        type: mongoose.Types.ObjectId,
        ref: 'Sector'
    }
});

module.exports = mongoose.model('Subsector', subSectorSchema);
