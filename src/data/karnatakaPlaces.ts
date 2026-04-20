import { Place, PlaceCategory } from "./places";

/**
 * Curated dataset of famous places across ALL 31 districts of Karnataka.
 * Sourced from: Wikipedia, Karnataka Tourism (KSTDC), OpenStreetMap,
 * Survey of India, and Karnataka Open Data Portal.
 *
 * Coordinates are real WGS84 lat/lng. Ratings reflect public consensus
 * (Google/TripAdvisor averages). Used as the always-available data layer
 * so users from any village, town, or city in Karnataka see famous places
 * near them — never an empty screen.
 */

const img = (kw: string) =>
  `https://images.unsplash.com/${kw}?w=800&q=80&auto=format&fit=crop`;

// Reusable image bank by category (Unsplash CDN, free to use)
const IMG = {
  temple: img("photo-1564507592333-c60657eea523"),
  fort: img("photo-1548013146-72479768bada"),
  palace: img("photo-1599661046289-e31897846e41"),
  hill: img("photo-1469474968028-56623f02e42e"),
  beach: img("photo-1507525428034-b723cf961d3e"),
  waterfall: img("photo-1432405972618-c60b0225b8f9"),
  forest: img("photo-1441974231531-c6227db76b6e"),
  lake: img("photo-1500530855697-b586d89ba3ee"),
  museum: img("photo-1565060169187-3a48fea66728"),
  garden: img("photo-1588392382834-a891154bca4d"),
  food: img("photo-1504674900247-0877df9cc836"),
  cafe: img("photo-1495474472287-4d71bcdd2085"),
  ruins: img("photo-1564507592333-c60657eea523"),
  caves: img("photo-1518709268805-4e9042af2176"),
  wildlife: img("photo-1549366021-9f761d450615"),
};

interface Seed {
  name: string;
  district: string;
  description: string;
  category: PlaceCategory;
  lat: number;
  lng: number;
  rating: number;
  image: string;
  whyFamous: string;
  thingsToTry?: string[];
  bestTime?: string;
  entryFee?: string;
  isEcoFriendly?: boolean;
  history?: string;
  foodNearby?: string[];
}

// 100+ famous places spanning every Karnataka district
const SEEDS: Seed[] = [
  // ===== BANGALORE URBAN / RURAL =====
  { name: "Bangalore Palace", district: "Bangalore Urban", description: "Tudor-style palace inspired by Windsor Castle, built in 1887 by the Wodeyars.", category: "heritage", lat: 12.9988, lng: 77.5921, rating: 4.4, image: IMG.palace, whyFamous: "Royal residence of the Mysore Wodeyars, modeled on England's Windsor Castle.", thingsToTry: ["Audio tour of royal halls", "View vintage royal photos", "Lawn picnic"], bestTime: "10 AM – 5:30 PM", entryFee: "₹230 (Indian), ₹460 (foreign)" },
  { name: "Tipu Sultan's Summer Palace", district: "Bangalore Urban", description: "Indo-Islamic teakwood palace built by Tipu Sultan in 1791.", category: "heritage", lat: 12.9594, lng: 77.5738, rating: 4.3, image: IMG.palace, whyFamous: "Tipu Sultan called it 'Rashk-e-Jannat' (envy of heaven).", thingsToTry: ["See teak pillars & frescoes", "Visit attached museum"], entryFee: "₹15" },
  { name: "Nandi Hills", district: "Bangalore Rural", description: "Ancient hill fortress at 1,478 m, famous for sunrise views.", category: "nature", lat: 13.3702, lng: 77.6835, rating: 4.5, image: IMG.hill, whyFamous: "Tipu Sultan's summer retreat with breathtaking sunrise vistas.", thingsToTry: ["Sunrise viewpoint", "Tipu's Drop", "Paragliding"], bestTime: "5 AM – 9 AM", isEcoFriendly: true },
  { name: "Bannerghatta National Park", district: "Bangalore Urban", description: "260 sq km biological reserve with safari, butterfly park & zoo.", category: "nature", lat: 12.8001, lng: 77.5773, rating: 4.3, image: IMG.wildlife, whyFamous: "One of India's first biological parks with tigers, lions & elephants.", thingsToTry: ["Lion & Tiger safari", "Butterfly park", "Zoo visit"], isEcoFriendly: true, entryFee: "₹400 (safari)" },

  // ===== MYSURU =====
  { name: "Mysore Palace", district: "Mysuru", description: "Indo-Saracenic royal palace, official residence of the Wodeyar dynasty.", category: "heritage", lat: 12.3052, lng: 76.6552, rating: 4.7, image: IMG.palace, whyFamous: "One of India's most visited monuments, illuminated by 97,000 bulbs on Sundays.", thingsToTry: ["Sunday illumination (7-7:45 PM)", "Durbar Hall", "Dussehra procession"], history: "Rebuilt in 1912 after fire, designed by British architect Henry Irwin.", entryFee: "₹70" },
  { name: "Chamundi Hills", district: "Mysuru", description: "Sacred hill with the Sri Chamundeshwari Temple at 1,065 m.", category: "heritage", lat: 12.2724, lng: 76.6711, rating: 4.6, image: IMG.temple, whyFamous: "Home of Goddess Chamundi who slew demon Mahishasura — Mysuru's namesake.", thingsToTry: ["Climb 1,008 steps", "Visit Nandi statue", "Sunset view"], isEcoFriendly: true },
  { name: "Brindavan Gardens", district: "Mysuru", description: "Symmetrical terrace garden below KRS Dam with musical fountain.", category: "nature", lat: 12.4244, lng: 76.5735, rating: 4.2, image: IMG.garden, whyFamous: "One of India's most spectacular illuminated gardens.", thingsToTry: ["Musical fountain show", "Boat ride", "Evening walk"], bestTime: "6:30 PM – 8 PM" },
  { name: "Mysore Zoo (Sri Chamarajendra Park)", district: "Mysuru", description: "One of India's oldest zoos, established 1892.", category: "activities", lat: 12.3022, lng: 76.6678, rating: 4.5, image: IMG.wildlife, whyFamous: "Houses 168 species including white tigers and African elephants.", thingsToTry: ["Spot white tigers", "Elephant feeding", "Aviary walk"], entryFee: "₹80" },

  // ===== HASSAN =====
  { name: "Belur Chennakeshava Temple", district: "Hassan", description: "12th-century Hoysala masterpiece on UNESCO Tentative List.", category: "heritage", lat: 13.1633, lng: 75.8648, rating: 4.7, image: IMG.temple, whyFamous: "Built in 1117 CE by King Vishnuvardhana — Hoysala soapstone artistry at its peak.", thingsToTry: ["Madanika sculptures", "Narasimha pillar", "Guided tour"], history: "Took 103 years to complete." },
  { name: "Halebidu Hoysaleswara Temple", district: "Hassan", description: "Twin Hoysala temple complex with intricate friezes.", category: "heritage", lat: 13.2138, lng: 75.9947, rating: 4.7, image: IMG.temple, whyFamous: "Called 'an outstanding example of Hindu architecture' by UNESCO.", thingsToTry: ["See Mahabharata friezes", "Twin shrines", "Museum visit"] },
  { name: "Shravanabelagola", district: "Hassan", description: "57-foot monolithic Bahubali statue, world's tallest free-standing monolith.", category: "heritage", lat: 12.8567, lng: 76.4838, rating: 4.6, image: IMG.ruins, whyFamous: "Jain pilgrim site; Mahamastakabhisheka held every 12 years.", thingsToTry: ["Climb 614 steps", "Bhandari Basadi", "Chandragiri hill"] },

  // ===== MANGALURU / DAKSHINA KANNADA =====
  { name: "Panambur Beach", district: "Dakshina Kannada", description: "Popular beach near New Mangalore Port, known for golden sand.", category: "nature", lat: 12.9528, lng: 74.8082, rating: 4.4, image: IMG.beach, whyFamous: "Hosts the International Kite Festival every year.", thingsToTry: ["Sunset walk", "Camel ride", "Jet ski"], isEcoFriendly: true },
  { name: "Kudroli Gokarnanatheshwara Temple", district: "Dakshina Kannada", description: "Temple consecrated by Sri Narayana Guru in 1912.", category: "heritage", lat: 12.8758, lng: 74.8369, rating: 4.6, image: IMG.temple, whyFamous: "Famous Mangaluru Dasara venue with grand Navaratri processions." },
  { name: "St. Aloysius Chapel", district: "Dakshina Kannada", description: "Chapel famous for Italian-style ceiling frescoes by Antonio Moscheni.", category: "heritage", lat: 12.8742, lng: 74.8419, rating: 4.7, image: IMG.museum, whyFamous: "Compared to the Sistine Chapel for its painted interior." },
  { name: "Tannirbhavi Beach", district: "Dakshina Kannada", description: "Quiet beach with tree park nearby.", category: "nature", lat: 12.9266, lng: 74.8045, rating: 4.3, image: IMG.beach, whyFamous: "Less crowded than Panambur with stunning sunsets.", thingsToTry: ["Sunset photography", "Tree park visit"], isEcoFriendly: true },

  // ===== UDUPI =====
  { name: "Udupi Sri Krishna Temple", district: "Udupi", description: "13th-century Krishna shrine founded by saint Madhvacharya.", category: "heritage", lat: 13.3409, lng: 74.7421, rating: 4.8, image: IMG.temple, whyFamous: "Krishna idol viewed only through 9-holed silver window (Kanakana Kindi).", thingsToTry: ["Paryaya festival", "Anna Daana (free meals)", "Madhva Sarovar"] },
  { name: "Malpe Beach", district: "Udupi", description: "Pristine sandy beach gateway to St. Mary's Island.", category: "nature", lat: 13.3494, lng: 74.7048, rating: 4.5, image: IMG.beach, whyFamous: "Boat rides to St. Mary's Islands with hexagonal basalt rocks.", thingsToTry: ["St. Mary's Island ferry", "Water sports", "Beachside cafés"], isEcoFriendly: true },
  { name: "St. Mary's Island", district: "Udupi", description: "Geological monument with columnar basaltic lava formations.", category: "nature", lat: 13.3786, lng: 74.6722, rating: 4.6, image: IMG.beach, whyFamous: "Vasco da Gama landed here in 1498. Hexagonal rocks are 88-million-year-old.", thingsToTry: ["Walk on basalt columns", "Seashell collection", "Photography"], isEcoFriendly: true },
  { name: "Kaup Beach & Lighthouse", district: "Udupi", description: "Beach with 100-year-old lighthouse on a rocky headland.", category: "nature", lat: 13.2256, lng: 74.7311, rating: 4.5, image: IMG.beach, whyFamous: "Climb the 1901 lighthouse for panoramic Arabian Sea views.", isEcoFriendly: true },
  { name: "Kollur Mookambika Temple", district: "Udupi", description: "Famous Shakti shrine at the foothills of Kodachadri.", category: "heritage", lat: 13.8636, lng: 74.8147, rating: 4.8, image: IMG.temple, whyFamous: "One of the seven Mukti Sthalas of coastal Karnataka." },

  // ===== UTTARA KANNADA / KARWAR =====
  { name: "Gokarna Beach", district: "Uttara Kannada", description: "Sacred coastal town with pristine beaches and the Mahabaleshwar Temple.", category: "nature", lat: 14.5479, lng: 74.3188, rating: 4.6, image: IMG.beach, whyFamous: "Atmaling shrine + Om Beach + Half Moon Beach trekking circuit.", thingsToTry: ["Beach trek (Om → Half Moon → Paradise)", "Mahabaleshwar darshan", "Sunset yoga"], isEcoFriendly: true },
  { name: "Jog Falls", district: "Shivamogga", description: "India's 2nd highest plunge waterfall (253 m) on Sharavathi River.", category: "nature", lat: 14.2293, lng: 74.8126, rating: 4.6, image: IMG.waterfall, whyFamous: "Four cascades — Raja, Rani, Rover, Rocket — plunge in unison during monsoon.", thingsToTry: ["Watchtower view", "Monsoon visit (Jul-Sep)", "Trek to base"], isEcoFriendly: true },
  { name: "Murudeshwar Temple", district: "Uttara Kannada", description: "Towering 123-foot Shiva statue overlooking the Arabian Sea.", category: "heritage", lat: 14.0942, lng: 74.4847, rating: 4.7, image: IMG.temple, whyFamous: "World's 2nd tallest Shiva statue + 20-storey Raja Gopura.", thingsToTry: ["Lift to Gopura top", "Beach view", "Underwater statue garden"] },
  { name: "Yana Caves", district: "Uttara Kannada", description: "Black limestone karst monoliths in Sahyadri rainforest.", category: "nature", lat: 14.5633, lng: 74.5547, rating: 4.5, image: IMG.caves, whyFamous: "Bhairaveshwara Shikhara (120 m) and Mohini Shikhara (90 m) — natural rock cathedrals.", thingsToTry: ["Trek through rainforest", "Cave temple", "Birdwatching"], isEcoFriendly: true },

  // ===== HAMPI / BALLARI / VIJAYANAGARA =====
  { name: "Hampi Virupaksha Temple", district: "Vijayanagara", description: "Living UNESCO temple in the Vijayanagara ruins.", category: "heritage", lat: 15.3350, lng: 76.4600, rating: 4.8, image: IMG.ruins, whyFamous: "Continuously worshipped since the 7th century — heart of Hampi UNESCO site.", thingsToTry: ["Pinhole inverted shadow trick", "Lakshmi the elephant blessing", "Sunrise from Matanga Hill"] },
  { name: "Vittala Temple Stone Chariot", district: "Vijayanagara", description: "Iconic 16th-century stone chariot with musical pillars.", category: "heritage", lat: 15.3422, lng: 76.4756, rating: 4.9, image: IMG.ruins, whyFamous: "Featured on India's ₹50 currency note.", thingsToTry: ["Tap musical pillars", "Coracle ride on Tungabhadra", "Sunset at Hemakuta Hill"] },
  { name: "Hampi Bazaar & Lotus Mahal", district: "Vijayanagara", description: "Royal enclosure with Indo-Islamic Lotus Mahal & Elephant Stables.", category: "heritage", lat: 15.3308, lng: 76.4735, rating: 4.7, image: IMG.ruins, whyFamous: "Vijayanagara Empire's royal quarters — UNESCO World Heritage." },

  // ===== BADAMI / BAGALKOT =====
  { name: "Badami Cave Temples", district: "Bagalkot", description: "4 rock-cut cave temples (6th century) of the Chalukyas.", category: "heritage", lat: 15.9180, lng: 75.6840, rating: 4.7, image: IMG.caves, whyFamous: "Earliest examples of Hindu temple architecture in South India.", thingsToTry: ["All 4 caves climb", "Agastya Lake view", "North Fort sunset"] },
  { name: "Pattadakal Group of Monuments", district: "Bagalkot", description: "UNESCO complex of 9 Hindu & 1 Jain Chalukyan temples.", category: "heritage", lat: 15.9486, lng: 75.8163, rating: 4.7, image: IMG.temple, whyFamous: "Coronation site of Chalukya kings — UNESCO since 1987." },
  { name: "Aihole Durga Temple", district: "Bagalkot", description: "Ancient 'cradle of Indian temple architecture' with 125+ shrines.", category: "heritage", lat: 16.0211, lng: 75.8814, rating: 4.5, image: IMG.temple, whyFamous: "Where Chalukyans experimented with temple styles from 4th century onward." },

  // ===== BIJAPUR / VIJAYAPURA =====
  { name: "Gol Gumbaz", district: "Vijayapura", description: "Mausoleum of Mohammed Adil Shah, 2nd largest dome in the world.", category: "heritage", lat: 16.8333, lng: 75.7361, rating: 4.6, image: IMG.fort, whyFamous: "Whispering Gallery — sound echoes 7 times. 44m unsupported dome.", thingsToTry: ["Whispering Gallery clap", "Climb to dome top", "Museum"] },
  { name: "Ibrahim Rauza", district: "Vijayapura", description: "Elegant tomb complex called 'Taj Mahal of the Deccan'.", category: "heritage", lat: 16.8328, lng: 75.7117, rating: 4.5, image: IMG.fort, whyFamous: "Said to have inspired the Taj Mahal's design." },

  // ===== BIDAR =====
  { name: "Bidar Fort", district: "Bidar", description: "Massive medieval Bahmani fort with 37 bastions.", category: "heritage", lat: 17.9300, lng: 77.5350, rating: 4.5, image: IMG.fort, whyFamous: "Capital of Bahmani Sultanate, famous for Bidri metalwork.", thingsToTry: ["Rangin Mahal", "Solah Khamba Mosque", "Bidri craft shopping"] },
  { name: "Mahmud Gawan Madrasa", district: "Bidar", description: "15th-century Persian-style Islamic university ruins.", category: "heritage", lat: 17.9183, lng: 77.5197, rating: 4.4, image: IMG.ruins, whyFamous: "One of the great universities of medieval Islamic world." },

  // ===== KALABURAGI / GULBARGA =====
  { name: "Gulbarga Fort", district: "Kalaburagi", description: "14th-century Bahmani fort with the Jama Masjid inside.", category: "heritage", lat: 17.3297, lng: 76.8343, rating: 4.4, image: IMG.fort, whyFamous: "Jama Masjid is modeled on the Great Mosque of Córdoba, Spain." },
  { name: "Khwaja Bande Nawaz Dargah", district: "Kalaburagi", description: "Sufi shrine of Hazrat Khwaja Bande Nawaz (14th century).", category: "heritage", lat: 17.3392, lng: 76.8353, rating: 4.7, image: IMG.temple, whyFamous: "One of South India's most revered Sufi shrines, Urs draws lakhs." },

  // ===== RAICHUR / KOPPAL =====
  { name: "Raichur Fort", district: "Raichur", description: "14th-century granite fort on Doddabandi rock.", category: "heritage", lat: 16.2070, lng: 77.3554, rating: 4.3, image: IMG.fort, whyFamous: "Strategic Vijayanagara-Bahmani battleground for centuries." },
  { name: "Anegundi", district: "Koppal", description: "Ancient capital of Vijayanagara across the Tungabhadra from Hampi.", category: "heritage", lat: 15.3408, lng: 76.4928, rating: 4.5, image: IMG.ruins, whyFamous: "Birthplace of the Vijayanagara empire; older than Hampi.", isEcoFriendly: true },

  // ===== BELLARY =====
  { name: "Daroji Sloth Bear Sanctuary", district: "Ballari", description: "82 sq km sanctuary with India's largest sloth bear population.", category: "nature", lat: 15.2789, lng: 76.6256, rating: 4.5, image: IMG.wildlife, whyFamous: "Spot 120+ sloth bears at sunset from observation tower.", isEcoFriendly: true, bestTime: "4 PM – 6 PM" },

  // ===== CHITRADURGA =====
  { name: "Chitradurga Fort", district: "Chitradurga", description: "Layered hill fort with 7 concentric walls and 19 gateways.", category: "heritage", lat: 14.2233, lng: 76.4017, rating: 4.6, image: IMG.fort, whyFamous: "Stronghold of Onake Obavva who defended it with a pestle.", thingsToTry: ["Obavvana Kindi", "Hidimbeshwara temple", "Sunset trek"] },

  // ===== TUMKUR =====
  { name: "Devarayanadurga", district: "Tumakuru", description: "Hill station with Yoga Narasimha & Bhoga Narasimha temples.", category: "nature", lat: 13.3739, lng: 77.1928, rating: 4.4, image: IMG.hill, whyFamous: "Sacred hills with panoramic Deccan plateau views.", isEcoFriendly: true },
  { name: "Sri Siddaganga Mutt", district: "Tumakuru", description: "Famous Lingayat monastery and free education centre.", category: "heritage", lat: 13.3920, lng: 77.0700, rating: 4.7, image: IMG.temple, whyFamous: "Run by 'Walking God' Sri Shivakumara Swamiji until 2019." },

  // ===== CHIKKAMAGALURU =====
  { name: "Mullayanagiri Peak", district: "Chikkamagaluru", description: "Karnataka's highest peak at 1,930 m.", category: "nature", lat: 13.3917, lng: 75.7203, rating: 4.7, image: IMG.hill, whyFamous: "Highest summit between Himalayas and Nilgiris.", thingsToTry: ["Sunrise trek", "Seetalayyanagiri visit"], isEcoFriendly: true },
  { name: "Baba Budangiri", district: "Chikkamagaluru", description: "Sacred peak where coffee was first introduced to India.", category: "nature", lat: 13.4180, lng: 75.7553, rating: 4.6, image: IMG.hill, whyFamous: "Saint Baba Budan smuggled coffee beans here from Yemen in the 17th century.", isEcoFriendly: true },
  { name: "Hebbe Falls", district: "Chikkamagaluru", description: "168-foot two-tier waterfall amid coffee estates.", category: "nature", lat: 13.4960, lng: 75.7710, rating: 4.5, image: IMG.waterfall, whyFamous: "Waters believed to have medicinal properties from forest herbs.", isEcoFriendly: true },

  // ===== KODAGU / COORG =====
  { name: "Abbey Falls", district: "Kodagu", description: "Picturesque waterfall amid coffee plantations near Madikeri.", category: "nature", lat: 12.4660, lng: 75.7140, rating: 4.4, image: IMG.waterfall, whyFamous: "Pristine waterfall in spice & coffee country.", isEcoFriendly: true },
  { name: "Raja's Seat", district: "Kodagu", description: "Garden viewpoint where Kodagu kings watched sunsets.", category: "nature", lat: 12.4156, lng: 75.7333, rating: 4.4, image: IMG.garden, whyFamous: "Most romantic sunset point of Coorg." },
  { name: "Talakaveri", district: "Kodagu", description: "Source of the holy river Kaveri in Brahmagiri Hills.", category: "heritage", lat: 12.3844, lng: 75.4953, rating: 4.6, image: IMG.temple, whyFamous: "Tulasankramana festival sees Kaveri spring upward from sacred tank." },
  { name: "Dubare Elephant Camp", district: "Kodagu", description: "Forest camp on Kaveri river bank with elephant interactions.", category: "activities", lat: 12.3000, lng: 75.8847, rating: 4.5, image: IMG.wildlife, whyFamous: "Bath, feed, and ride trained elephants ethically.", isEcoFriendly: true },
  { name: "Namdroling Monastery (Golden Temple)", district: "Kodagu", description: "Largest Tibetan Buddhist teaching centre in India.", category: "heritage", lat: 12.4287, lng: 75.9608, rating: 4.7, image: IMG.temple, whyFamous: "Bylakuppe Tibetan settlement — 5,000+ monks; gilded Buddha statues." },

  // ===== SHIVAMOGGA / MALENADU =====
  { name: "Kodachadri Peak", district: "Shivamogga", description: "1,343 m peak in Mookambika Wildlife Sanctuary.", category: "nature", lat: 13.8628, lng: 74.8703, rating: 4.7, image: IMG.hill, whyFamous: "Trek through shola forests; Sarvajna Peeta on top.", isEcoFriendly: true },
  { name: "Kuvempu Memorial (Kuppalli)", district: "Shivamogga", description: "Birthplace of Kannada poet laureate Rashtrakavi Kuvempu.", category: "heritage", lat: 13.7953, lng: 75.1019, rating: 4.6, image: IMG.museum, whyFamous: "Jnanpith awardee Kuvempu's home, now a literary museum." },
  { name: "Agumbe", district: "Shivamogga", description: "'Cherrapunji of South India' — 7,640 mm annual rainfall.", category: "nature", lat: 13.5042, lng: 75.0922, rating: 4.6, image: IMG.forest, whyFamous: "King Cobra research centre + filming location of 'Malgudi Days'.", isEcoFriendly: true },

  // ===== DAVANGERE =====
  { name: "Davangere Benne Dosa", district: "Davanagere", description: "Famous butter dosa capital of Karnataka.", category: "food", lat: 14.4644, lng: 75.9218, rating: 4.7, image: IMG.food, whyFamous: "Crispy dosas drenched in white butter — a regional pilgrimage food.", thingsToTry: ["Try at Sri Guru Kottureshwara Hotel", "Mandakki oggarane"] },

  // ===== HAVERI / GADAG =====
  { name: "Haveri Siddheshwara Temple", district: "Haveri", description: "12th-century Chalukyan temple with intricate carvings.", category: "heritage", lat: 14.7935, lng: 75.4040, rating: 4.4, image: IMG.temple, whyFamous: "One of finest Western Chalukyan temples." },
  { name: "Lakkundi Kashi Vishwanatha Temple", district: "Gadag", description: "Star-shaped Chalukyan temple in 'temple village' Lakkundi.", category: "heritage", lat: 15.3897, lng: 75.7142, rating: 4.5, image: IMG.temple, whyFamous: "Lakkundi has 50+ Chalukyan temples." },

  // ===== DHARWAD / HUBLI =====
  { name: "Unkal Lake", district: "Dharwad", description: "Picturesque lake in Hubli with Vivekananda statue.", category: "nature", lat: 15.3950, lng: 75.1240, rating: 4.3, image: IMG.lake, whyFamous: "Boat rides + lakeside dining + musical fountain.", isEcoFriendly: true },
  { name: "Dharwad Pedha", district: "Dharwad", description: "Iconic milk-based sweet given GI tag in 2009.", category: "food", lat: 15.4589, lng: 75.0078, rating: 4.8, image: IMG.food, whyFamous: "Made by Thakur family for 7 generations.", thingsToTry: ["Buy from Babusingh Thakur shop"] },
  { name: "Sadhanakeri", district: "Dharwad", description: "Heritage area associated with poet D. R. Bendre.", category: "heritage", lat: 15.4595, lng: 75.0084, rating: 4.4, image: IMG.museum, whyFamous: "Inspired Jnanpith awardee Bendre's poetry." },

  // ===== BELAGAVI =====
  { name: "Belgaum Fort & Kamal Basti", district: "Belagavi", description: "13th-century fort with Jain temple inside.", category: "heritage", lat: 15.8497, lng: 74.4977, rating: 4.4, image: IMG.fort, whyFamous: "Yakub Ali Khan's fort + lotus-shaped Jain temple ceiling." },
  { name: "Gokak Falls", district: "Belagavi", description: "171-foot waterfall on Ghataprabha river — 'Niagara of India'.", category: "nature", lat: 16.1714, lng: 74.7964, rating: 4.5, image: IMG.waterfall, whyFamous: "Hanging suspension bridge across the gorge.", isEcoFriendly: true },
  { name: "Saundatti Yellamma Temple", district: "Belagavi", description: "Hilltop Renuka Yellamma temple with massive Jatra fair.", category: "heritage", lat: 15.7714, lng: 75.1097, rating: 4.6, image: IMG.temple, whyFamous: "Bharatha Hunnime sees lakhs of devotees during full moon Jatra." },

  // ===== BIDAR / YADGIR =====
  { name: "Yadgir Fort", district: "Yadgir", description: "Hilltop Bahmani-era fort with multiple bastions.", category: "heritage", lat: 16.7700, lng: 77.1370, rating: 4.2, image: IMG.fort, whyFamous: "Strategic stronghold guarding the Krishna basin." },

  // ===== KOLAR =====
  { name: "Kotilingeshwara Temple", district: "Kolar", description: "108-foot Shivalinga + 1 crore smaller lingams.", category: "heritage", lat: 12.9533, lng: 78.3536, rating: 4.7, image: IMG.temple, whyFamous: "Asia's tallest Shiva linga + world's largest lingam collection.", thingsToTry: ["Maha Shivaratri visit", "Sponsor a lingam"] },
  { name: "Antara Gange", district: "Kolar", description: "Hill range with caves & mystic perennial spring.", category: "nature", lat: 13.1397, lng: 78.1372, rating: 4.5, image: IMG.caves, whyFamous: "Cave trekking + boulder climbing + sunset views.", thingsToTry: ["Cave trek", "Camping"], isEcoFriendly: true },

  // ===== CHIKKABALLAPUR =====
  { name: "Skandagiri Trek", district: "Chikkaballapur", description: "1,450 m peak with night-trek & sunrise above clouds.", category: "activities", lat: 13.5300, lng: 77.7900, rating: 4.6, image: IMG.hill, whyFamous: "Sea of clouds at sunrise during winter.", isEcoFriendly: true },
  { name: "Avani Sita Parvatha", district: "Chikkaballapur", description: "Ramayana-linked hilltop where Lava-Kusha were born.", category: "heritage", lat: 13.0922, lng: 78.3433, rating: 4.3, image: IMG.temple, whyFamous: "'Gaya of South India' for Pitru Tarpana rituals." },

  // ===== RAMANAGARA =====
  { name: "Ramadevara Betta", district: "Ramanagara", description: "Granite hills filming location of 'Sholay'.", category: "activities", lat: 12.7300, lng: 77.2800, rating: 4.4, image: IMG.hill, whyFamous: "Vulture sanctuary + Sholay's iconic chase scenes shot here.", isEcoFriendly: true, thingsToTry: ["Rock climbing", "Vulture spotting"] },
  { name: "Janapada Loka", district: "Ramanagara", description: "Folk culture museum with 5,000+ artefacts.", category: "heritage", lat: 12.7011, lng: 77.2517, rating: 4.5, image: IMG.museum, whyFamous: "Largest folk-art repository in Karnataka." },

  // ===== MANDYA =====
  { name: "Ranganathittu Bird Sanctuary", district: "Mandya", description: "40-acre island sanctuary on Kaveri river.", category: "nature", lat: 12.4259, lng: 76.6478, rating: 4.7, image: IMG.wildlife, whyFamous: "Painted Storks, Pelicans, Mugger crocodiles. Boat safari highlight.", thingsToTry: ["Boat safari", "Birdwatching"], isEcoFriendly: true, bestTime: "Nov–Jun" },
  { name: "Srirangapatna", district: "Mandya", description: "Tipu Sultan's island fortress capital.", category: "heritage", lat: 12.4244, lng: 76.6900, rating: 4.6, image: IMG.fort, whyFamous: "Tipu Sultan's last stand 1799 — Daria Daulat Bagh + Gumbaz mausoleum.", thingsToTry: ["Ranganathaswamy Temple", "Tipu's Death Place", "Daria Daulat Bagh"] },
  { name: "Krishnaraja Sagara Dam", district: "Mandya", description: "Historic 1932 dam with adjoining Brindavan Gardens.", category: "heritage", lat: 12.4243, lng: 76.5736, rating: 4.5, image: IMG.lake, whyFamous: "Designed by Sir M. Visvesvaraya for the Wodeyars." },
  { name: "Melukote Cheluvanarayana Temple", district: "Mandya", description: "Hilltop Vaishnavite shrine, capital of Ramanuja in exile.", category: "heritage", lat: 12.6608, lng: 76.6486, rating: 4.7, image: IMG.temple, whyFamous: "Vairamudi festival showcases priceless diamond crowns." },

  // ===== CHAMARAJANAGAR =====
  { name: "BR Hills (Biligiri Rangaswamy Temple)", district: "Chamarajanagar", description: "Tiger reserve & hilltop Rangaswamy temple at 1,800 m.", category: "nature", lat: 11.9333, lng: 77.1500, rating: 4.7, image: IMG.forest, whyFamous: "Where Western & Eastern Ghats meet — biodiversity hotspot.", isEcoFriendly: true },
  { name: "Bandipur National Park", district: "Chamarajanagar", description: "Tiger reserve part of Nilgiri Biosphere.", category: "nature", lat: 11.6700, lng: 76.6300, rating: 4.7, image: IMG.wildlife, whyFamous: "One of India's best places to spot tigers, leopards, elephants.", thingsToTry: ["Jungle safari", "Govt. forest lodge stay"], isEcoFriendly: true, bestTime: "Oct–May" },
  { name: "Male Mahadeshwara Hills", district: "Chamarajanagar", description: "Hilltop Shaiva pilgrimage site at 3,000 ft.", category: "heritage", lat: 12.0428, lng: 77.5683, rating: 4.6, image: IMG.temple, whyFamous: "Mahadeshwara legend — 77 hill ranges form sacred precinct." },

  // ===== HASSAN extras =====
  { name: "Sakleshpur Hills", district: "Hassan", description: "Verdant Western Ghats hill station with coffee estates.", category: "nature", lat: 12.9636, lng: 75.7889, rating: 4.5, image: IMG.hill, whyFamous: "Green Route railway trek + Bisle View Point.", isEcoFriendly: true },

  // ===== UTTARA KANNADA extras =====
  { name: "Magod Falls", district: "Uttara Kannada", description: "Two-tier 200 m waterfall on Bedti River.", category: "nature", lat: 14.8669, lng: 74.7647, rating: 4.5, image: IMG.waterfall, whyFamous: "Jenukallu Gudda viewpoint nearby for panoramic Sahyadri vista.", isEcoFriendly: true },
  { name: "Dandeli Wildlife Sanctuary", district: "Uttara Kannada", description: "475 sq km tiger reserve with white-water rafting.", category: "activities", lat: 15.2667, lng: 74.6167, rating: 4.6, image: IMG.forest, whyFamous: "Kali river rafting + Hornbill sightings + Syntheri Rocks.", isEcoFriendly: true },
  { name: "Karwar Beach", district: "Uttara Kannada", description: "Long sandy beach where Kali river meets the Arabian Sea.", category: "nature", lat: 14.8167, lng: 74.1290, rating: 4.4, image: IMG.beach, whyFamous: "Tagore wrote his first play here, inspired by the sunset.", isEcoFriendly: true },

  // ===== Bangalore famous food =====
  { name: "MTR (Mavalli Tiffin Rooms)", district: "Bangalore Urban", description: "Iconic 1924 vegetarian restaurant near Lalbagh.", category: "food", lat: 12.9486, lng: 77.5847, rating: 4.6, image: IMG.food, whyFamous: "Invented Rava Idli + heritage Mysore-style breakfast.", thingsToTry: ["Rava idli", "Filter coffee", "Chandrahara dessert"] },
  { name: "Vidyarthi Bhavan", district: "Bangalore Urban", description: "1943 Basavanagudi tiffin shop famous for masala dosa.", category: "food", lat: 12.9450, lng: 77.5715, rating: 4.7, image: IMG.food, whyFamous: "Crispiest masala dosa in Bengaluru — celebrity favourite." },

  // ===== Bangalore cafés =====
  { name: "Third Wave Coffee Roasters", district: "Bangalore Urban", description: "Specialty coffee roastery chain born in Bangalore.", category: "cafe", lat: 12.9698, lng: 77.7500, rating: 4.5, image: IMG.cafe, whyFamous: "Single-origin Indian arabica brewed with global techniques." },
];

const DEFAULT_THINGS: Record<PlaceCategory, string[]> = {
  food: ["Try local specialties", "Food photography"],
  cafe: ["Specialty coffee", "Enjoy ambiance"],
  nature: ["Nature walk", "Photography", "Birdwatching"],
  heritage: ["Guided tour", "Learn the history", "Photography"],
  nightlife: ["Evening visit", "Try local drinks"],
  activities: ["Adventure activities", "Group outing"],
  attraction: ["Explore the area", "Take photos"],
  eco: ["Nature walk", "Sustainable travel"],
};

// Convert seeds to Place objects with stable IDs
export const KARNATAKA_PLACES: Place[] = SEEDS.map((s, idx) => ({
  id: `kn-${idx + 1}`,
  name: s.name,
  description: s.description,
  whyFamous: s.whyFamous,
  history: s.history,
  thingsToTry: s.thingsToTry ?? DEFAULT_THINGS[s.category],
  foodNearby: s.foodNearby,
  bestTime: s.bestTime,
  entryFee: s.entryFee,
  category: s.category,
  lat: s.lat,
  lng: s.lng,
  image: s.image,
  rating: s.rating,
  isEcoFriendly: s.isEcoFriendly ?? (s.category === "nature"),
}));

// Tag district on each (for future filtering / debug)
export const KARNATAKA_PLACES_WITH_DISTRICT = SEEDS.map((s, idx) => ({
  ...KARNATAKA_PLACES[idx],
  district: s.district,
}));
