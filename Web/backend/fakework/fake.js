import fs from 'fs';
const { random, floor } = Math;

const generateFakeData = (coordinates) => {
    return coordinates.map(coord => ({
        longitude: coord.Longitude,
        latitude: coord.Latitude,
        waveHeight: parseFloat((random() * 5).toFixed(2)), // 0.1 to 5 meters
        waveDirection: floor(random() * 360), // 0 to 360 degrees
        windSpeed: parseFloat((random() * 30).toFixed(2)), // 0 to 30 knots
        precipitation: parseFloat((random() * 50).toFixed(2)) // 0 to 50 mm
    }));
};

fs.readFile('./coordinates.json', 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }

    const coordinates = JSON.parse(data);
    const fakeData = generateFakeData(coordinates);

    fs.writeFile('fakeData.json', JSON.stringify(fakeData, null, 2), (err) => {
        if (err) console.error("Error writing file:", err);
        else console.log("Fake data generated successfully!");
    });
});
