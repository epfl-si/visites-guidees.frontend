import { ArrowLeft, ArrowRight, MapPin, Users } from "lucide-react"
import { useEffect, useState } from "react"
import type { Dispatch, SetStateAction } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { getPlaces as getAvailablePlaces } from "@/services/place"
import type { CreateGuide } from "@/types/guide"
import type { Place } from "@/types/place"

export const SelectPlace = ({
  setStep,
  selectedInformation,
  setSelectedInformation,
  places,
  setPlaces,
}: {
  setStep: (step: number) => void
  selectedInformation: CreateGuide
  setSelectedInformation: Dispatch<SetStateAction<CreateGuide>>
  places: Place[]
  setPlaces: Dispatch<SetStateAction<Place[]>>
}) => {
  const { t, i18n } = useTranslation()
  const selectedPlaces = selectedInformation.placeIds
  const [isWaiting, setIsWaiting] = useState<boolean>(true)
  const currentLanguage = (i18n.resolvedLanguage || "en") as "en" | "fr"

  const allSelected =
    places.length > 0 && selectedPlaces.length === places.length



  useEffect(() => {
    async function getPlaces() {
      try {
        const placesResponse = await getAvailablePlaces()
        if (!placesResponse.success) {
          if (placesResponse.code === 401) {
            setPlaces([])
            return
          }
          throw new Error(placesResponse.error)
        }
        setPlaces(placesResponse.data)
      } catch {
        toast.error(t("errors.dataloading.defaultMessage"))
        setPlaces([])
      } finally {
        setIsWaiting(false)
      }
    }
    getPlaces()
  }, [setPlaces, t])

  function togglePlace(id: number, checked: boolean) {
    setSelectedInformation((prev) => ({
      ...prev,
      placeIds: checked
        ? [...prev.placeIds, id]
        : prev.placeIds.filter((placeId) => placeId !== id),
    }))
  }

  function toggleAll() {
    setSelectedInformation((prev) => ({
      ...prev,
      placeIds: allSelected ? [] : places.map((place) => place.id),
    }))
  }

  return (
    <div className="flex flex-col gap-3">
      {places.length > 1 && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={toggleAll}>
            {allSelected
              ? t("guide.dialog.place.deselectAll")
              : t("guide.dialog.place.selectAll")}
          </Button>
        </div>
      )}

      <div className="flex max-h-80 scrollbar-gutter-stable flex-col gap-2 overflow-y-auto pr-2">
        {isWaiting ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))
        ) : places.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {t("guide.dialog.place.empty")}
          </p>
        ) : (
          places.map((place) => (
            <Label
              key={place.id}
              className="cursor-pointer gap-3 rounded-lg border p-2 pr-3 transition-colors hover:bg-muted/50 has-data-checked:border-primary has-data-checked:bg-primary/5"
            >
              {place.picture ? (
                <img
                  src={place.picture}
                  alt=""
                  className="size-12 shrink-0 rounded-md object-cover"
                />
              ) : (
                <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <MapPin className="size-5" />
                </div>
              )}
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="truncate">{place.title[currentLanguage]}</span>
                <span className="flex items-center gap-1 text-xs font-normal text-muted-foreground">
                  <Users className="size-3" />
                  {t("guide.dialog.place.capacity", { count: place.capacity })}
                </span>
              </div>
              <Checkbox
                checked={selectedPlaces.includes(place.id)}
                onCheckedChange={(checked) => togglePlace(place.id, checked)}
              />
            </Label>
          ))
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        {selectedPlaces.length === 0
          ? t("guide.dialog.place.none")
          : t("guide.dialog.place.selected", {
            count: selectedPlaces.length,
          })}
      </p>

      <DialogFooter className="sm:justify-between">
        <Button variant="outline" onClick={() => setStep(2)}>
          <ArrowLeft data-icon="inline-start" />
          {t("actions.previous")}
        </Button>
        <Button
          disabled={selectedPlaces.length === 0}
          onClick={() => setStep(4)}
        >
          {t("actions.next")}
          <ArrowRight data-icon="inline-end" />
        </Button>
      </DialogFooter>
    </div>
  )
}
