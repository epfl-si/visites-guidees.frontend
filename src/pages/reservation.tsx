import type { Reservation } from "@/types/reservation";
import { useEffect, useState } from "react";
import { getReservation } from "@/services/reservation";
import { useParams } from "react-router";
import { LoadingPage } from "./Loading";
import { Empty, EmptyHeader, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { useTranslation } from "react-i18next";
import { Calendar } from "lucide-react";

export default function Reservation() {
  const [reservation, setReservation] = useState<Reservation>();
  const [loading, setLoading] = useState<boolean>(true);

  const { id } = useParams();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchReservation = async (reservationId: number) => {
      const reservation = await getReservation(reservationId);
      setReservation(reservation);
      setLoading(false);
    }

    if (id) {
      fetchReservation(Number(id));
    }
  }, [id]);

  if (loading) {
    return (<LoadingPage />);
  }

  if (!reservation) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Calendar />
          </EmptyMedia>
          <EmptyTitle>{t("reservation.notFound")}</EmptyTitle>
          <EmptyDescription>
            {t("reservation.notFoundDescription")}
          </EmptyDescription>
        </EmptyHeader>
      </Empty >
    )
  }

  return (
    <div>
      <h1>{reservation?.company}</h1>
    </div>
  );
}
