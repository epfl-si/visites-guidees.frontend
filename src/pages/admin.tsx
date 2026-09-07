import { useEffect, useState } from "react";
import { Reservations } from "@/components/reservations/tables";
import { getReservations } from "@/services/reservation";
import type { Reservation } from "@/types/reservation";
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

  const [loadingRes, setLoadingRes] = useState<boolean>(true);
  const [loadingPlaces, setLoadingPlaces] = useState<boolean>(true);
  const [loadingGuides, setLoadingGuides] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      getReservations(10, "desc").then((res) => {
        if (res.success) setReservations(res.data);
        setLoadingRes(false);
      })
      getPlaces().then((res) => {
        if (res.success) setPlaces(res.data);
        setLoadingPlaces(false);
      })
      getGuides().then((res) => {
        if (res.success) setGuides(res.data);
        setLoadingGuides(false);
      })
    }
    fetchData();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-16">
      <h1 className="text-4xl pb-8 font-semibold">Admin dashboard</h1>
      <div className="flex flex-col gap-10">
        <div className="grid grid-cols-1 xl:grid-cols-10 gap-10">
          <div className="w-full xl:col-span-6">
          <Reservations reservations={reservations} loading={loadingRes}/>
          </div>
          <div className="w-full xl:col-span-4">
            <PlacesTable places={places} loading={loadingPlaces} />
          </div>
        </div>
        <GuidesTable guides={guides} loading={loadingGuides}/>
      </div>
    </div>
  )
}
