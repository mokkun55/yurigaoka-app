import Header from '@/_components/ui/header'
import { Suspense } from 'react'
import LoadingSpinner from '@/_components/ui/loading-spinner'

export default function AbsenceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header title="届け出を提出" type="close" />
      <Suspense
        fallback={
          <div className="flex-grow flex items-center justify-center">
            <LoadingSpinner size={48} />
          </div>
        }
      >
        <div className="flex flex-col flex-grow overflow-y-auto">{children}</div>
      </Suspense>
    </>
  )
}
