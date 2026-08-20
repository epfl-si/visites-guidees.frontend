import { useEffect, useState } from "react"
import { LastReservationsTable } from "@/components/reservations/tables"
import { getGuideInfo } from "@/services/guide"
import { GuideInfoTable } from "@/components/guides/tables"
import type { guideInfo } from "@/types/guide"
import { getLastReservations } from "@/services/reservation"
import type { LastReservation } from "@/types/reservation"

export default function Admin() {
  const [reservations, setReservations] = useState<LastReservation[]>([])
  const [guides, setGuides] = useState<guideInfo[]>([])
  const [isLoadingGuides, setIsLoadingGuides] = useState(true)

  useEffect(() => {
    getLastReservations().then(setReservations).catch(console.error)

    getGuideInfo()
      .then(setGuides)
      .catch(console.error)
      .finally(() => setIsLoadingGuides(false))
  }, [])

  return (
    <div className="flex-1 overflow-y-auto p-16">
      <h1 className="pb-8 text-4xl font-semibold">Admin dashboard</h1>
      <LastReservationsTable lastReservations={reservations} />
      <div className="w-3xl">
        <GuideInfoTable guideInfo={guides} isLoading={isLoadingGuides} />
      </div>
    </div>
  )
}
