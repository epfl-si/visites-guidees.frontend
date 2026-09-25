import {
  CalendarDays,
  CircleCheck,
  Languages,
  MapPin,
  UserSearch,
} from "lucide-react"
import type { CreateGuide } from "@/types/guide"

export const ADD_GUIDE_STEPS = [
  { key: "guide", icon: UserSearch },
  { key: "language", icon: Languages },
  { key: "place", icon: MapPin },
  { key: "calendar", icon: CalendarDays },
  { key: "confirm", icon: CircleCheck },
] as const

export const EMPTY_CREATE_GUIDE: CreateGuide = {
  sciper: 0,
  languageIds: [],
  placeIds: [],
  startDate: "",
}
