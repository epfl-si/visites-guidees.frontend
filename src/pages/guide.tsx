import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  CalendarOff,
  Languages as LanguagesIcon,
  MapPin,
  Mail,
  Phone,
  User,
} from "lucide-react";
import type { GuideDetails } from "@/types/guide";
import type { Languages } from "@/types/language";
import { getGuide } from "@/services/guide";
import { GUIDE_STATUS } from "@/constants/status";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Empty, EmptyHeader, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { LoadingPage } from "./Loading";

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("fr-CH", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function GuideDetail() {
  const [guide, setGuide] = useState<GuideDetails>();
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage as Languages;

  const guideId = Number(id);
  const validId = Number.isInteger(guideId) && guideId > 0;
  const [loading, setLoading] = useState<boolean>(validId);

  useEffect(() => {
    if (!validId) return;

    let ignore = false;
    getGuide(guideId)
      .then((res) => {
        if (!ignore && res.success) setGuide(res.data);
      })
      .catch(() => {})
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [guideId, validId]);

  if (loading) {
    return <LoadingPage />;
  }

  if (!guide) {
    return (
      <div className="flex-1 p-8 w-full">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <User aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>{t("guide.detail.notFound")}</EmptyTitle>
            <EmptyDescription>{t("guide.detail.notFoundDescription")}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  const statusConfig = GUIDE_STATUS[guide.status];
  const StatusIcon = statusConfig?.icon;

  return (
    <div className="flex-1 p-8 overflow-auto w-full mr-10">
      <div className="flex items-center gap-3 mb-2">
        <Link
          to="/admin/guides"
          aria-label={t("guide.detail.back")}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft aria-hidden="true" className="h-6 w-6" />
        </Link>
        <h1 className="text-4xl font-semibold">
          {guide.user.firstName} {guide.user.lastName}
        </h1>
      </div>
      <div className="flex items-center gap-4 ml-9 mb-8 text-sm text-muted-foreground">
        <span>{t("guide.detail.sciper")} {guide.id}</span>
        {statusConfig && StatusIcon && (
          <span className={`flex items-center gap-2 font-medium ${statusConfig.colorClass}`}>
            <StatusIcon aria-hidden="true" className="w-4 h-4" />
            {t(statusConfig.labelKey)}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <Card>
          <CardHeader>
            <CardTitle>
              <h2>{t("guide.detail.contact")}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Mail aria-hidden="true" className="h-4 w-4 text-muted-foreground shrink-0" />
              <a href={`mailto:${guide.user.email}`} className="text-sm hover:underline">
                {guide.user.email}
              </a>
            </div>
            <div className="flex items-start gap-3">
              <Phone aria-hidden="true" className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                {guide.phone.length === 0 ? (
                  <span className="text-sm text-muted-foreground">-</span>
                ) : (
                  guide.phone.map((p) => (
                    <a key={p} href={`tel:${p}`} className="text-sm hover:underline">
                      {p}
                    </a>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <h2 className="flex items-center gap-2">
                <LanguagesIcon aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                {t("guide.detail.languages")}
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {guide.languages.length === 0 ? (
                <span className="text-sm text-muted-foreground">-</span>
              ) : (
                guide.languages.map((lang) => (
                  <Badge key={lang.id} variant="outline" className="rounded-none h-6 px-2.5">
                    {lang.name} ({lang.code})
                  </Badge>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <h2 className="flex items-center gap-2">
                <MapPin aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                {t("guide.detail.places")}
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("guide.detail.place")}</TableHead>
                  <TableHead>{t("guide.detail.capacity")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guide.places.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                      {t("guide.detail.noPlaces")}
                    </TableCell>
                  </TableRow>
                ) : (
                  guide.places.map((place) => (
                    <TableRow key={place.id}>
                      <TableCell className="font-medium">{place.title[currentLang] ?? place.title.en}</TableCell>
                      <TableCell>{place.capacity}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <h2 className="flex items-center gap-2">
                <CalendarOff aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                {t("guide.detail.blockedPeriods")}
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("guide.detail.reason")}</TableHead>
                  <TableHead>{t("guide.detail.from")}</TableHead>
                  <TableHead>{t("guide.detail.to")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guide.blockedPeriods.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                      {t("guide.detail.noBlockedPeriods")}
                    </TableCell>
                  </TableRow>
                ) : (
                  guide.blockedPeriods.map((period) => (
                    <TableRow key={period.id}>
                      <TableCell className="font-medium">{period.label[currentLang] ?? period.label.en}</TableCell>
                      <TableCell>{formatDate(period.start)}</TableCell>
                      <TableCell>{formatDate(period.end)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
