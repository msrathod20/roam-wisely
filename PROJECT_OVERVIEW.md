# Explorer – Beyond Horizons
## Technical Overview & Project File Reference

> Final Year CSE Project — Dayananda Sagar College of Engineering

---

## 🛠 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 18 | Component-based UI |
| **Build Tool** | Vite | Fast dev server & bundling |
| **Language** | TypeScript | Type-safe JavaScript |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **UI Library** | shadcn/ui (Radix UI) | 40+ accessible components |
| **Animations** | Framer Motion | Smooth page & card transitions |
| **Routing** | React Router v6 | Client-side navigation |
| **Maps** | Leaflet.js | Interactive map rendering |
| **State** | React Context API | Global auth & favorites state |
| **Data Fetching** | TanStack React Query | Async state management |
| **Forms** | React Hook Form + Zod | Validation & form handling |
| **Notifications** | Sonner + Radix Toast | User feedback toasts |

---

## 📁 Key Project Files

### Pages (`src/pages/`)

| File | Description |
|------|-------------|
| `LandingPage.tsx` | Hero section with CTA, intro to the app |
| `ExplorePage.tsx` | Main feature — search, filter, distance-based place discovery |
| `GroupsPage.tsx` | Create groups, invite friends, plan trips together |
| `FavoritesPage.tsx` | View and manage saved/bookmarked places |
| `LoginPage.tsx` | User login form |
| `RegisterPage.tsx` | Registration with interest selection |
| `ProfilePage.tsx` | User profile and preferences |
| `NotFound.tsx` | 404 error page |

### Components (`src/components/`)

| File | Description |
|------|-------------|
| `Navbar.tsx` | Responsive navigation bar with auth-aware links |
| `PlaceCard.tsx` | Card UI for each place (image, rating, eco badge, distance) |
| `PlaceDetail.tsx` | Expanded detail modal with map, tips, cultural insights |
| `FilterBar.tsx` | Search input, category chips, distance slider, eco toggle |
| `NavLink.tsx` | Reusable navigation link component |

### Core Logic (`src/`)

| File | Description |
|------|-------------|
| `context/AppContext.tsx` | Global state — auth, favorites, ratings, visited places |
| `data/places.ts` | Bangalore places database (12 locations) + Haversine distance formula |
| `hooks/useGeolocation.ts` | Browser Geolocation API hook for real-time user location |
| `lib/utils.ts` | Tailwind CSS class merge utility (`cn()`) |
| `App.tsx` | Root component — routing, providers, layout |
| `main.tsx` | App entry point |
| `index.css` | Design system tokens (colors, fonts, shadows) |

### UI Library (`src/components/ui/`)

40+ reusable shadcn/ui components including:
`Button`, `Dialog`, `Card`, `Toast`, `Slider`, `Badge`, `Select`, `Tabs`, `Sheet`, `Accordion`, `Avatar`, `Checkbox`, `Input`, `Label`, `Popover`, `Progress`, `Separator`, `Skeleton`, `Switch`, `Tooltip`, and more.

### Configuration Files

| File | Description |
|------|-------------|
| `vite.config.ts` | Vite build configuration with path aliases |
| `tailwind.config.ts` | Tailwind theme customization (colors, fonts, animations) |
| `tsconfig.json` | TypeScript compiler settings |
| `components.json` | shadcn/ui configuration |
| `index.html` | HTML entry point |

---

## ⭐ Key Features Implemented

1. **Geolocation-Based Discovery** — Sorts places by real-time distance using Haversine formula
2. **Smart Search** — Bypasses distance filter to show results from any location
3. **Category Filtering** — Food, Heritage, Nature, Nightlife, Eco, Activities, Attraction, Café
4. **Eco-Friendly Filter** — Highlight sustainable travel options
5. **Personalized Recommendations** — Matches places to user-selected interests
6. **Group Travel Planning** — Create groups, invite friends with mock coordinates
7. **Favorites & Ratings** — Bookmark and rate places
8. **Interactive Maps** — Leaflet.js integration in place details
9. **Responsive Design** — Mobile-first layout with Tailwind CSS
10. **Smooth Animations** — Framer Motion staggered card reveals & page transitions

---

## 🏗 Architecture Pattern

```
React (UI) → Context API (State) → Static Data (places.ts)
     ↓              ↓
  Router v6    Geolocation Hook
     ↓
  Page Components → Reusable UI Components (shadcn/ui)
```

---

*Built with ❤️ using Lovable*
