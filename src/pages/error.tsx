import { ArrowLeft, Home } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"

export default function ErrorPage({
  errorCode,
  message,
}: {
  errorCode: number
  message: string
}) {
  const { t } = useTranslation()
  const contactKey = message.replace(/\.title$/, ".contact")

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-2xl text-center">
        <div className="mb-8 flex items-center justify-center sm:mb-12">
          <div className="flex items-center gap-2 sm:gap-4">
            <img
              src="https://epfl-si.github.io/elements/svg/epfl-logo.svg"
              alt="EPFL"
              width={120}
              height={35}
              className="h-6 sm:h-8"
            />
            <span className="h-6 w-1 border-l-2 border-solid border-gray-300 sm:h-8"></span>
            <h1 className="text-lg font-bold text-gray-800 sm:text-2xl">
              {t("app.title")}
            </h1>
          </div>
        </div>
        <div className="mb-8 sm:mb-12">
          <h2 className="mb-4 text-[8rem] leading-none font-bold text-gray-800 sm:mb-6 sm:text-[12rem] lg:text-[16rem]">
            {Math.trunc(errorCode / 100)}
            <span className="ml-1 text-gray-800 sm:ml-1.5">
              {Math.trunc(errorCode / 10) % 10}
            </span>
            {errorCode % 10}
          </h2>
          <p className="mx-auto mb-6 max-w-md px-4 text-lg text-gray-600 sm:mb-8 sm:text-xl">
            {t(message)}
          </p>
          <div className="mb-6 flex flex-col items-center justify-center gap-3 px-4 sm:mb-8 sm:flex-row sm:gap-4">
            <Button variant="default" size="lg" className="w-full sm:w-auto">
              <a href="/" className="inline-flex items-center gap-1.5">
                <Home className="h-5 w-5" />
                {t("actions.backToHome")}
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.history.back()}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="h-5 w-5" />
              {t("actions.previousPage")}
            </Button>
          </div>
          <p className="px-4 text-sm text-gray-500">
            {t(contactKey)}{" "}
            <a
              href="mailto:1234@epfl.ch"
              type="mail"
              className="font-medium text-red-600 underline hover:text-red-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              1234
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
