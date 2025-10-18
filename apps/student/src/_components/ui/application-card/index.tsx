import Link from 'next/link'
import React from 'react'

type ApplicationCardProps = {
  href: string
  icons: React.ReactNode[]
  text: string
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ href, icons, text }) => (
  <Link
    href={href}
    className="bg-white rounded-md p-4 flex flex-col items-center gap-4 border border-(--border-gray) cursor-pointer w-full overflow-hidden"
  >
    <div className="flex items-center gap-2 text-(--main-blue)">
      {icons.map((icon, idx) => (
        <React.Fragment key={idx}>{icon}</React.Fragment>
      ))}
    </div>
    <p className="text-base font-bold overflow-hidden text-ellipsis whitespace-nowrap">{text}</p>
  </Link>
)

export default ApplicationCard
