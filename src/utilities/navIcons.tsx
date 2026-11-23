import type { LucideIcon } from 'lucide-react'
import {
  AlertTriangle,
  Cherry,
  Clock,
  GiftIcon,
  HelpCircleIcon,
  HomeIcon,
  SearchIcon,
  ShieldCheckIcon,
  Smartphone,
  StarIcon,
  TrophyIcon,
  Volleyball,
} from 'lucide-react'

export const ICON_OPTIONS = [
  { label: 'None', value: '' },
  { label: 'Home', value: 'home' },
  { label: 'Trophy', value: 'trophy' },
  { label: 'Sports', value: 'sports' },
  { label: 'Gift', value: 'gift' },
  { label: 'Star', value: 'star' },
  { label: 'Shield', value: 'shield' },
  { label: 'Help', value: 'help' },
  { label: 'Search', value: 'search' },
  { label: 'Clock', value: 'clock' },
  { label: 'Warning', value: 'warning' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'Slots', value: 'slots' },
] as const

export const ICON_MAP: Record<string, LucideIcon> = {
  home: HomeIcon,
  trophy: TrophyIcon,
  sports: Volleyball,
  gift: GiftIcon,
  star: StarIcon,
  shield: ShieldCheckIcon,
  help: HelpCircleIcon,
  search: SearchIcon,
  clock: Clock,
  warning: AlertTriangle,
  mobile: Smartphone,
  slots: Cherry,
}

export const NavIcon: React.FC<{ icon?: string | null; size?: number; color?: string; className?: string }> = ({
  icon,
  size = 15,
  color,
  className,
}) => {
  if (!icon) return null
  const Icon = ICON_MAP[icon]
  if (!Icon) return null
  return <Icon size={size} color={color} className={className} />
}
