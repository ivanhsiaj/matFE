import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import LangToggle from "@/components/LangToggle";
import CornerLogo from "@/components/CornerLogo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, UserCog, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

const Index = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Detect IP region on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    } else {
      fetch("https://ipapi.co/json/")
        .then((res) => res.json())
        .then((data) => {
          const country = data.country_code;
          if (["ES", "MX", "AR", "CO", "PE", "CL"].includes(country)) {
            i18n.changeLanguage("es");
            localStorage.setItem("lang", "es");
          } else {
            i18n.changeLanguage("en");
            localStorage.setItem("lang", "en");
          }
        })
        .catch(() => {
          i18n.changeLanguage("en");
        });
    }
    // ✅ Wake up backend with toast
    const toastId = toast.loading("Connecting to server...");
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ping`) // make sure you have a simple GET /api/ping or similar route
      .then(() => {
        toast.success("Server is ready!", { id: toastId });
      })
      .catch(() => {
        toast.error("Failed to connect server", { id: toastId });
      });
  }, [i18n]);

  return (
     <div className="min-h-screen bg-white dark:from-gray-900 dark:to-gray-800 px-4">
      <Card className="container mx-auto px-4 py-8 ">
        {/* Header */}
        <CardHeader className="flex-row justify-between items-center mb-6 p-0">
          <div className="flex items-center ml-4">
            <img
              src="https://hikae.com/wp-content/plugins/phastpress/phast.php/c2VydmljZT1pbWFnZXMmc3JjPWh0dHBzJTNBJTJGJTJGaGlrYWUuY29tJTJGd3AtY29udGVudCUyRnVwbG9hZHMlMkYyMDI0JTJGMDUlMkZoaWthZXByb2Nlc3MucG5nJmNhY2hlTWFya2VyPTE3NTE4NzM2NDYtNDE1NSZ0b2tlbj1mMzUxYjhhNjUwYTA0YTA3.q.png"
              alt="Logo"
              className="h-10 w-auto"
            />
          </div>
          <div className="ml-auto mr-4">
            <LangToggle />
          </div>
        </CardHeader>

        {/* Company Purpose */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t("siteTitle")}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            {t("siteSubtitle")}           
          </p>
        </div>

        {/* Role Selection */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Admin Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <UserCog className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <CardTitle className="text-2xl">{t("adminTitle")}</CardTitle>
              <CardDescription>
                {t("adminDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={() => navigate("/admin/login")}
                className="w-full"
                size="lg"
              >
                {t("adminButton")}
              </Button>
            </CardContent>
          </Card>

          {/* Employee Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <CardTitle className="text-2xl">{t("employeeTitle")}</CardTitle>
              <CardDescription>
                {t("employeeDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={() => navigate("/employee/shift-selection")}
                className="w-full"
                size="lg"
                variant="outline"
              >
                {t("employeeButton")}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400">
          <p>© 2025 Hikae Aluminium. Empowering Industrial Futures.</p>
        </div>
      </Card>
      
    </div>
  );
};

export default Index;
