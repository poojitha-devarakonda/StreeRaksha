// Temporary in-memory storage (until MongoDB is ready)
let trips = [];

export const startTrip = (req, res) => {
  const {
    startLocation,
    destination,
    estimatedDuration,
    checkInterval,
    nightMode,
  } = req.body;

  if (!startLocation || !destination) {
    return res.status(400).json({ message: "Start and destination required" });
  }

  const trip = {
    id: Date.now().toString(),
    startLocation,
    destination,
    estimatedDuration,
    checkInterval,
    nightMode,
    status: "active",
    createdAt: new Date(),
  };

  trips.push(trip);

  res.status(201).json({
    message: "Trip started",
    trip,
  });
};
export const updateLocation = (req, res) => {
  const { tripId, lat, lng } = req.body;

  if (!tripId || lat == null || lng == null) {
    return res.status(400).json({ message: "tripId, lat, lng are required" });
  }

  // Find the trip in temporary in-memory store
  const trip = trips.find(t => t.id === tripId);

  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  trip.lastKnownLocation = { lat, lng };
  trip.lastUpdatedAt = new Date();

  console.log("Live location received:", tripId, lat, lng);

  res.json({ message: "Location updated" });
};
