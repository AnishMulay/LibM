import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function BaseIcon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export function HeartIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 20.25C12 20.25 4 15.25 4 9.75C4 7.12665 6.12665 5 8.75 5C10.2818 5 11.6441 5.71621 12.5 6.83333C13.3559 5.71621 14.7182 5 16.25 5C18.8734 5 21 7.12665 21 9.75C21 15.25 13 20.25 13 20.25H12Z" />
    </BaseIcon>
  )
}

export function PlusIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 5V19" />
      <path d="M5 12H19" />
    </BaseIcon>
  )
}

export function LogoutIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M9 21H5C4.44772 21 4 20.5523 4 20V4C4 3.44772 4.44772 3 5 3H9" />
      <path d="M16 17L21 12L16 7" />
      <path d="M21 12H9" />
    </BaseIcon>
  )
}

export function BackIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M19 12H5" />
      <path d="M12 19L5 12L12 5" />
    </BaseIcon>
  )
}

export function RefreshIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M20 11A8 8 0 1 0 18.34 16" />
      <path d="M20 4V11H13" />
    </BaseIcon>
  )
}
