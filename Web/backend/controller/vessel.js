import VesselData from '../models/VesselData.js';

export const createVesselData = async (req, res) => {
  try {
    const vesselData = new VesselData(req.body);
    await vesselData.save();
    res.status(201).json({ message: 'Vessel data created successfully'
        , data: vesselData
     });
  } catch (error) {
    res.status(500).json({ message: 'Error creating vessel data' });
  }
};

export const getVesselData = async (req, res) => {
  try {
    const vesselData = await VesselData.findOne({
        name: req.params.name
    });
    res.status(200).json(vesselData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vessel data' });
  }
};