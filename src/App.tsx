import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import LandingPage from "@/pages/LandingPage";
import ExplorePage from "@/pages/ExplorePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import FavoritesPage from "@/pages/FavoritesPage";
import GroupsPage from "@/pages/GroupsPage";
import ProfilePage from "@/pages/ProfilePage";
import TripPlannerPage from "@/pages/TripPlannerPage";
import NotFound from "./pages/NotFound";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Layout wrapper component
const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    {children}
  </div>
);

// Component to load Google Maps API at app level
const GoogleMapsLoader = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, error } = useGoogleMaps();

  useEffect(() => {
    if (isLoaded) {
      console.log('✓ Google Maps API is ready for use');
    }
    if (error) {
      console.warn('⚠️  Google Maps API warning:', error.message);
      console.log('   Falling back to Wikipedia images for place photos');
    }
  }, [isLoaded, error]);

  return <>{children}</>;
};

// Create router with v7 future flags
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout><LandingPage /></RootLayout>,
  },
  {
    path: "/explore",
    element: <RootLayout><ExplorePage /></RootLayout>,
  },
  {
    path: "/trip-planner",
    element: <RootLayout><TripPlannerPage /></RootLayout>,
  },
  {
    path: "/login",
    element: <RootLayout><LoginPage /></RootLayout>,
  },
  {
    path: "/register",
    element: <RootLayout><RegisterPage /></RootLayout>,
  },
  {
    path: "/favorites",
    element: <RootLayout><FavoritesPage /></RootLayout>,
  },
  {
    path: "/groups",
    element: <RootLayout><GroupsPage /></RootLayout>,
  },
  {
    path: "/profile",
    element: <RootLayout><ProfilePage /></RootLayout>,
  },
  {
    path: "*",
    element: <NotFound />,
  },
], {
  future: {
    v7_startTransition: true,
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <GoogleMapsLoader>
          <Toaster />
          <Sonner />
          <RouterProvider router={router} />
        </GoogleMapsLoader>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
