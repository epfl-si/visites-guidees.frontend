import { Reservations } from "@/components/reservations/tables";
import { getReservations } from "@/services/reservation";
import { useEffect, useState } from "react"
import { getGuideInfo } from "@/services/guide"
import { GuideInfoTable } from "@/components/guides/tables"
import type { guideInfo } from "@/types/guide"
import type { reservations } from "@/types/reservation";
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

export default function Admin() {
  const { t } = useTranslation()
  const [reservations, setReservations] = useState<reservations[]>([])
  const [guides, setGuides] = useState<guideInfo[]>([])
  const [isLoadingGuides, setIsLoadingGuides] = useState(true)
  const [isLoadingReservations, setIsLoadingReservations] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reservationsResponse = await getReservations(5, 'desc')
        if (!reservationsResponse.success) {
          throw new Error('Failed to fetch reservations')
        }
        setReservations(reservationsResponse.data)
      } catch (error) {
        console.error('getReservations Error', error)
        toast.error(t("admin.reservations.loadError"))
      } finally {
        setIsLoadingReservations(false)
      }

      try {
        const guideResponse = await getGuideInfo()
        if (!guideResponse.success) {
          throw new Error('Failed to fetch guides')
        }
        setGuides(guideResponse.data)
      } catch (error) {
        console.error('getGuideInfo Error', error)
        toast.error(t("admin.guides.loadError"))
      } finally {
        setIsLoadingGuides(false)
      }
    }
    fetchData();
  }, [t]);


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
