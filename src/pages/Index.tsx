
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import LangToggle from "@/components/LangToggle";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        
        <div className="text-right p-4">
          <LangToggle />
        </div>
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <img src="https://hikae.com/wp-content/plugins/phastpress/phast.php/c2VydmljZT1pbWFnZXMmc3JjPWh0dHBzJTNBJTJGJTJGaGlrYWUuY29tJTJGd3AtY29udGVudCUyRnVwbG9hZHMlMkYyMDI0JTJGMDUlMkZoaWthZS1sb2dvLnBuZyZjYWNoZU1hcmtlcj0xNzUxODcxNzU3LTQxNTMmdG9rZW49MmE5ZjBmNWJlNjM5YTIzZQ.q.png" alt="Logo" className="h-16 w-16" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t("siteTitle")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t("siteSubtitle")}
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Admin Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <UserCog className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <CardTitle className="text-2xl">{t("adminTitle")}</CardTitle>
              <CardDescription>{t("adminDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 dark:text-gray-400 mb-6 space-y-2">
                <li>{t("adminFeature1")}</li>
                <li>{t("adminFeature2")}</li>
                <li>{t("adminFeature3")}</li>
                <li>{t("adminFeature4")}</li>
              </ul>
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
              <CardDescription>{t("employeeDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 dark:text-gray-400 mb-6 space-y-2">
                <li>{t("employeeFeature1")}</li>
                <li>{t("employeeFeature2")}</li>
                <li>{t("employeeFeature3")}</li>
                <li>{t("employeeFeature4")}</li>
              </ul>
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
        <div className="text-center mt-12 text-gray-500 dark:text-gray-400">
          <p>{t("footer")}</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
