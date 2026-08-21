import { ArrowLeft, Home } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";

export default function ErrorPage({ errorCode, message  }: { errorCode: number, message: string}) {
  const { t } = useTranslation();
  const contactKey = message.replace(/\.title$/, ".contact");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full text-center">
        <div className="flex items-center justify-center mb-8 sm:mb-12">
          <div className="flex items-center gap-2 sm:gap-4">
            <img src="https://epfl-si.github.io/elements/svg/epfl-logo.svg" alt="EPFL" width={120} height={35} className="h-6 sm:h-8" />
            <span className="border-l-2 border-solid h-6 sm:h-8 w-1 border-gray-300"></span>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-800">{t("app.title")}</h1>
          </div>
        </div>
        <div className="mb-8 sm:mb-12">
          <h2 className="text-[8rem] sm:text-[12rem] lg:text-[16rem] font-bold text-gray-800 mb-4 sm:mb-6 leading-none">
            {Math.trunc(errorCode / 100)}<span className="text-gray-800 ml-1 sm:ml-1.5">{Math.trunc(errorCode / 10) % 10}</span>{errorCode % 10}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto px-4">{t(message)}</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-8 px-4">
            <Button variant="default" size="lg"  className="w-full sm:w-auto ">
              <a href="/" className="inline-flex items-center gap-1.5">
                <Home className="w-5 h-5" />
                {t("actions.backToHome")}
              </a>
            </Button>
            <Button variant="outline" size="lg" onClick={() => window.history.back()} className="w-full sm:w-auto ">
              <ArrowLeft className="w-5 h-5" />
              {t("actions.previousPage")}
            </Button>
          </div>
          <p className="text-sm text-gray-500 px-4">
            {t(contactKey)}{" "}
            <a
              href="mailto:1234@epfl.ch"
              type="mail"
              className="text-red-600 hover:text-red-700 underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              1234
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
