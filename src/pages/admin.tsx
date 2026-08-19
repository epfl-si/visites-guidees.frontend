import { Reservations } from "@/components/reservations/tables";
import { getReservations } from "@/services/reservation";
import { useEffect, useState } from "react"
import { getGuideInfo } from "@/services/guide"
import { GuideInfoTable } from "@/components/guides/tables"
import type { guideInfo } from "@/types/guide"
import type { reservations } from "@/types/reservation";

export default function Admin() {
  const [reservations, setReservations] = useState<reservations[]>([])
  const [guides, setGuides] = useState<guideInfo[]>([])
  const [isLoadingGuides, setIsLoadingGuides] = useState(true)
  const [isLoadingReservations, setIsLoadingReservations] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const reservationsResponse = await getReservations(5,'desc')
      if (reservationsResponse.success) {
        setReservations(reservationsResponse.data)
        setIsLoadingReservations(false)
      } 
      const guideResponse = await getGuideInfo()
      if (guideResponse.success){
        setGuides(guideResponse.data)
        setIsLoadingGuides(false)
      }
    }
    fetchData();
  }, []);


  return (
    <div className="flex-1 overflow-y-auto p-16">
      <h1 className="pb-8 text-4xl font-semibold">Admin dashboard</h1>
      <Reservations reservations={reservations} isLoading={isLoadingReservations} />
      <div className="w-3xl">
        <GuideInfoTable guideInfo={guides} isLoading={isLoadingGuides} />
      </div>
    </div>
  )
}
