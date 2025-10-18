import Header from '@/_components/ui/header'
import Footer from '@/_components/ui/footer'
import { Suspense } from 'react'
import LoadingSpinner from '@/_components/ui/loading-spinner'

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header title="提出の履歴" type="back" />
      <Suspense
        fallback={
          <div className="flex-grow flex items-center justify-center">
            <LoadingSpinner size={48} />
          </div>
        }
      >
        <div className="flex flex-col flex-grow overflow-y-auto">{children}</div>
      </Suspense>
      <Footer activeTab="history" />
    </>
  )
}
