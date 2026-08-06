import { Reservations } from "@/components/reservations/tables";
import { getReservations } from "@/services/reservation";
import type { LastReservation } from "@/types/reservation";
import { useEffect, useState } from "react"
import { getGuideInfo } from "@/services/guide"
import { GuideInfoTable } from "@/components/guides/tables"
import type { guideInfo } from "@/types/guide"

export default function Admin() {
  const [reservations, setReservations] = useState<LastReservation[]>([])
  const [guides, setGuides] = useState<guideInfo[]>([])
  const [isLoadingGuides, setIsLoadingGuides] = useState(true)


  useEffect(() => {
    const getData = async () => {
      const response = await getReservations(5,'desc')
      if (response.success) {
        setReservations(response.data)
      } 

    
      const guideResponse = await getGuideInfo()
      if (guideResponse.success){
        setGuides(guideResponse.data)
        setIsLoadingGuides(false)
      }
    }
    getData();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-16">
      <h1 className="pb-8 text-4xl font-semibold">Admin dashboard</h1>
      <Reservations reservations={reservations} />
      <div className="w-3xl">
        <GuideInfoTable guideInfo={guides} isLoading={isLoadingGuides} />
      </div>
    </div>
  )
}
