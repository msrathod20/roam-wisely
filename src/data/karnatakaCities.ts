/**
 * Curated list of major Karnataka cities/towns for the manual location picker.
 * Lat/lng are city-center WGS84 coordinates.
 */
export interface KarnatakaCity {
  name: string;
  district: string;
  lat: number;
  lng: number;
}

export const KARNATAKA_CITIES: KarnatakaCity[] = [
  { name: "Bengaluru", district: "Bangalore Urban", lat: 12.9716, lng: 77.5946 },
  { name: "Mysuru", district: "Mysuru", lat: 12.2958, lng: 76.6394 },
  { name: "Mangaluru", district: "Dakshina Kannada", lat: 12.9141, lng: 74.8560 },
  { name: "Udupi", district: "Udupi", lat: 13.3409, lng: 74.7421 },
  { name: "Hubballi", district: "Dharwad", lat: 15.3647, lng: 75.1240 },
  { name: "Dharwad", district: "Dharwad", lat: 15.4589, lng: 75.0078 },
  { name: "Belagavi", district: "Belagavi", lat: 15.8497, lng: 74.4977 },
  { name: "Kalaburagi", district: "Kalaburagi", lat: 17.3297, lng: 76.8343 },
  { name: "Bidar", district: "Bidar", lat: 17.9133, lng: 77.5301 },
  { name: "Vijayapura", district: "Vijayapura", lat: 16.8302, lng: 75.7100 },
  { name: "Ballari", district: "Ballari", lat: 15.1394, lng: 76.9214 },
  { name: "Hospet", district: "Vijayanagara", lat: 15.2689, lng: 76.3909 },
  { name: "Hampi", district: "Vijayanagara", lat: 15.3350, lng: 76.4600 },
  { name: "Tumakuru", district: "Tumakuru", lat: 13.3409, lng: 77.1010 },
  { name: "Shivamogga", district: "Shivamogga", lat: 13.9299, lng: 75.5681 },
  { name: "Davangere", district: "Davanagere", lat: 14.4644, lng: 75.9218 },
  { name: "Hassan", district: "Hassan", lat: 13.0072, lng: 76.0962 },
  { name: "Chikkamagaluru", district: "Chikkamagaluru", lat: 13.3161, lng: 75.7720 },
  { name: "Madikeri", district: "Kodagu", lat: 12.4244, lng: 75.7382 },
  { name: "Karwar", district: "Uttara Kannada", lat: 14.8136, lng: 74.1297 },
  { name: "Sirsi", district: "Uttara Kannada", lat: 14.6195, lng: 74.8354 },
  { name: "Raichur", district: "Raichur", lat: 16.2070, lng: 77.3554 },
  { name: "Yadgir", district: "Yadgir", lat: 16.7700, lng: 77.1340 },
  { name: "Koppal", district: "Koppal", lat: 15.3500, lng: 76.1500 },
  { name: "Gadag", district: "Gadag", lat: 15.4290, lng: 75.6360 },
  { name: "Haveri", district: "Haveri", lat: 14.7935, lng: 75.4040 },
  { name: "Bagalkot", district: "Bagalkot", lat: 16.1860, lng: 75.6960 },
  { name: "Chitradurga", district: "Chitradurga", lat: 14.2226, lng: 76.4023 },
  { name: "Kolar", district: "Kolar", lat: 13.1366, lng: 78.1297 },
  { name: "Chikkaballapur", district: "Chikkaballapur", lat: 13.4355, lng: 77.7315 },
  { name: "Mandya", district: "Mandya", lat: 12.5242, lng: 76.8958 },
  { name: "Chamarajanagar", district: "Chamarajanagar", lat: 11.9261, lng: 76.9437 },
  { name: "Ramanagara", district: "Ramanagara", lat: 12.7159, lng: 77.2818 },
];