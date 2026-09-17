import type React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const currentLang = i18n.resolvedLanguage || i18n.language || "en";

  const changeLocale = (newLang: string) => {
    i18n.changeLanguage(newLang);
  };

  return (
    <nav className="ml-auto flex items-center space-x-4 text-sm sm:text-base select-none">
      <ol className="flex items-center space-x-1">
        <li>
          <Button
            type="button"
            variant="link"
            onClick={() => changeLocale("fr")}
            className={cn(
              "h-auto p-0 font-bold transition-colors hover:no-underline",
              currentLang.startsWith("fr")
                ? "text-red-500"
                : "text-gray-300 hover:text-gray-400"
            )}
          >
            FR
          </Button>
        </li>
        <span className="border-l-2 border-solid h-4 border-gray-300 mx-1"></span>
        <li>
          <Button
            type="button"
            variant="link"
            onClick={() => changeLocale("en")}
            className={cn(
              "h-auto p-0 font-bold transition-colors hover:no-underline",
              currentLang.startsWith("en")
                ? "text-red-500"
                : "text-gray-300 hover:text-gray-400"
            )}
          >
            EN
          </Button>
        </li>
      </ol>
    </nav>
  );
};
