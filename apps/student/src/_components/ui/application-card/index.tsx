import Link from 'next/link'
import React from 'react'
import { ChevronRight } from 'lucide-react'

type ApplicationCardProps = {
  href: string
  icons: React.ReactNode[]
  text: string
  description?: string
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ href, icons, text, description }) => (
  <Link
    href={href}
    className="bg-white rounded-md py-7 px-4 flex items-center gap-4 border border-(--border-gray) cursor-pointer w-full"
  >
    <div
      className="rounded-lg p-4 flex items-center justify-center shrink-0"
      style={{ backgroundColor: 'var(--background-light)' }}
    >
      <div className="flex items-center gap-1" style={{ color: 'var(--main-blue)' }}>
        {icons.map((icon, idx) => (
          <React.Fragment key={idx}>{icon}</React.Fragment>
        ))}
      </div>
    </div>
    <div className="flex flex-col gap-1 flex-1 min-w-0">
      <p className="text-lg font-bold text-gray-800">{text}</p>
      {description && <p className="text-base text-gray-500">{description}</p>}
    </div>
    <ChevronRight size={20} className="text-gray-400 shrink-0" />
  </Link>
)

export default ApplicationCard
