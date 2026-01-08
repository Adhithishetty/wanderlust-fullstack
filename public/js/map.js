

  // Determine coordinates safely
let lng, lat;

  if (
    listing.geometry &&
    listing.geometry.coordinates &&
    listing.geometry.coordinates.length === 2
  ) {
    [lng, lat] = listing.geometry.coordinates;
  } else {
    // fallback coordinates
    [lng, lat] = [77.2090, 28.6139]; // Delhi
  }

  // Initialize map
  const map = L.map('map').setView([lat, lng], 9);

  // OpenStreetMap tiles (NO TOKEN)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  

const marker = L.marker([lat, lng])
                .addTo(map)
                .bindPopup(
                  `<h1>${listing.title}</h1><p>Exact Location will be  provided after booking </p>`,
                  {
                    offset: L.point(0, -25),
                  }
                );
                



