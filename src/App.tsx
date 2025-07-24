import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ShiftSelection from "./pages/ShiftSelection";
import MaterialEntry from "./pages/MaterialEntry";
import DischargePage from "./pages/DischargePage";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
const queryClient = new QueryClient();

const App = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    } else {
      // Optional: detect language based on browser
      const browserLang = navigator.language;
      if (browserLang.startsWith("es")) {
        i18n.changeLanguage("es");
        localStorage.setItem("lang", "es");
      } else {
        i18n.changeLanguage("en");
        localStorage.setItem("lang", "en");
      }
    }
  }, [i18n]);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route
              path="/employee/shift-selection"
              element={<ShiftSelection />}
            />
            <Route
              path="/employee/material-entry"
              element={<MaterialEntry />}
            />
            <Route
              path="/employee/discharge/material-entry"
              element={<DischargePage />}
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
