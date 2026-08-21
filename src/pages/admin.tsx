import { useEffect, useState } from "react";
import { LastReservationsTable } from "@/components/reservations/tableLast";
import { getReservations } from "@/services/reservation";
import type { Reservation } from "@/types/reservation";
import { LoadingPage } from "./Loading";
import { PlacesTable } from "@/components/place/table";
import type { Place } from "@/types/place";
import { getPlaces } from "@/services/place";
import { GuidesTable } from "@/components/guide/table";
import type { Guide } from "@/types/guide";
import { getGuides } from "@/services/guide";

export default function Admin() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const dataReservations = await getReservations(10, "desc");
      const dataPlaces = await getPlaces();
      const dataGuides = await getGuides();
      console.log("guides : ", dataGuides)

      if (dataReservations.success) setReservations(dataReservations.data);
      if (dataPlaces.success) setPlaces(dataPlaces.data);
      if (dataGuides.success) setGuides(dataGuides.data);

      setIsLoading(false);
    }
    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-16">
      <h1 className="text-4xl pb-8 font-semibold">Admin dashboard</h1>
      <div className="flex flex-col gap-10">
        <div className="grid grid-cols-1 xl:grid-cols-10 gap-10">
          <div className="w-full xl:col-span-6">
            <LastReservationsTable lastReservations={reservations} />
          </div>
          <div className="w-full xl:col-span-4">
            <PlacesTable places={places} />
          </div>
        </div>
        <GuidesTable guides={guides} />
      </div>
    </div>
  )
}
