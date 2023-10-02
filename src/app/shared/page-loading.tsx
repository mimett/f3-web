import Loader from "@/components/ui/loader"

export default function PageLoading() {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center gap-4 ">
      <Loader size="large" variant="blink"></Loader>
      <h2>Loading, please wait...</h2>
    </div>
  )
}
