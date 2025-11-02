import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/hooks/useCart";
import { AuthProvider } from "@/hooks/useAuth";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import Product from "./pages/Product";
import Products from "./pages/Products";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import Profile from "./pages/Profile";
import ProfileSetup from "./pages/ProfileSetup";
import Checkout from "./pages/Checkout";
import ProductConfig from "./pages/ProductConfig";
import BookingConfirmation from "./pages/BookingConfirmation";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import BecomeDealer from "./pages/BecomeDealer";
import DealerApplication from "./pages/DealerApplication";
import AboutUs from "./pages/AboutUs";
import Sitemap from "./pages/Sitemap";
import ProductRedirect from "./components/ProductRedirect";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SiteSettingsLoader />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile-setup" element={<ProfileSetup />} />
              <Route path="/products" element={<Products />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:slug" element={<BlogDetail />} />
              <Route path="/become-dealer" element={<BecomeDealer />} />
              <Route path="/dealer-application" element={<DealerApplication />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/sitemap" element={<Sitemap />} />
              <Route path="/products/:id" element={<Product />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />
              <Route path="/product-config" element={<ProductConfig />} />
              <Route path="/booking-confirmation" element={<BookingConfirmation />} />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } />
              <Route path="/orders/:id" element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              } />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-failure" element={<PaymentFailure />} />
              
              {/* Redirect old /product/:id URLs to /products/:id */}
              <Route path="/product/:id" element={<ProductRedirect />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

const SiteSettingsLoader = () => {
  useSiteSettings();
  return null;
};

export default App;
