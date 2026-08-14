import { useEffect, useState } from "react";
import { LastReservationsTable } from "@/components/reservations/tables";
import { getLastReservations } from "@/services/reservation";
import type { LastReservation } from "@/types/reservation";
import { LoadingPage } from "./Loading";
import { PlacesTable } from "@/components/place/table";
import type { Place } from "@/types/place";
import { getPlaces } from "@/services/place";

export default function Admin() {
  const [reservations, setReservations] = useState<LastReservation[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReservations = async () => {
      const data = await getLastReservations();
      setReservations(data);
      setIsLoading(false);
    }

    const fetchPlaces = async () => {
      const data = await getPlaces();
      setPlaces(data);
      setIsLoading(false);
    }
    fetchReservations();
    fetchPlaces();
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-16">
      <h1 className="text-4xl pb-8 font-semibold">Admin dashboard</h1>
      <div className="flex flex-col gap-9">
        <LastReservationsTable lastReservations={reservations} />
        <PlacesTable places={places} />
      </div>
    </div>
  )
}
