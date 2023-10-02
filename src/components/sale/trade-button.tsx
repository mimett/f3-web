import { Hero, HeroListing } from "@/models/hero"
import { Address } from "wagmi"
import BuyButton from "./buy-button"
import SellButton from "./sell-button"
import UnlistButton from "./unlist-button"
import { useRouter } from "next/navigation"
import { ButtonProps } from "../ui/button"
import toast from "react-hot-toast"

export default function TradeButton({
  user,
  hero,
  listing,
  onSuccess,
  nftListQuery,
  ...rest
}: {
  user: Address
  hero: Hero
  listing?: HeroListing
  onSuccess?: () => void
  nftListQuery?: any
} & ButtonProps) {
  const router = useRouter()

  if (listing) {
    if (user === listing.seller) {
      return (
        <UnlistButton
          listingId={listing.id}
          onSuccess={() => {
            router.push(`/nfts/${hero.id}`)
          }}
          {...rest}
        />
      )
    } else {
      return (
        <BuyButton
          listing={listing}
          onSuccess={() => {
            router.push(`/nfts/${hero.id}`)
          }}
          {...rest}
        />
      )
    }
  }

  return (
    <SellButton
      heroId={hero.id}
      onSuccess={() => {
        if (!nftListQuery) {
          router.push(`/nfts/${hero.id}`)
        } else {
          nftListQuery.refetch()
          toast.success("Listing successfully!")
        }
      }}
      {...rest}
    />
  )
}
