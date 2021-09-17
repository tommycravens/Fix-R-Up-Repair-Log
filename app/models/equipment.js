const { version } = require('mongoose')
const mongoose = require('mongoose')

const equipmentSchema = new mongoose.Schema(
	{
    equipmentType: {
      type: String,
      required: true,
    },
		modelName: {
			type: String,
			required: true,
		},
    modelYear: {
      type: Number,
      required: true,
    },
    modelNumber: {
      type: String,
      required: true,
    },
		serialNumber: {
			type: String,
			required: true,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

//  Notes: and in service dates or photos to add in files and buttons for receipts, insurance, title or whatever else but will need to be listed as an attribute under equipment
module.exports = mongoose.model('Equipment', equipmentSchema)
