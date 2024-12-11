import mongoose from 'mongoose';

const vesselDataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fuelInTons: { type: Number, required: true },
  enginePowerKW: { type: Number, required: true },
  speedKnots: { type: Number, required: true },
  currentFuelNumber: { type: Number, required: true },
  load: { type: Number, required: true }
}, { timestamps: true });

const VesselData = mongoose.model('VesselData', vesselDataSchema);

export default VesselData;