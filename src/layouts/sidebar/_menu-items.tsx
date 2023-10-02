import routes from "@/config/routes"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faDragon,
  faRankingStar,
  faStore,
  faTableList,
  faUserGroup,
  faTicket
} from "@fortawesome/free-solid-svg-icons"

export const menuItems = [  {
    name: "TOURNAMENT",
    icon: <FontAwesomeIcon icon={faRankingStar} className={"h-6 w-6"} />,
    href: routes.home,
  },
  {
    name: "SUMMON",
    icon: <FontAwesomeIcon icon={faDragon} className={"h-6 w-6"} />,
    href: routes.summon,
  },
  {
    name: "MY NFT",
    icon: <FontAwesomeIcon icon={faTableList} className={"h-6 w-6"} />,
    href: routes.myNfts,
  },
  {
    name: "MARKETPLACE",
    icon: <FontAwesomeIcon icon={faStore} className={"h-6 w-6"} />,
    href: routes.marketplace,
  },
  {
    name: "LOTTERY",
    icon: <FontAwesomeIcon icon={faTicket} className={"h-6 w-6"} />,
    href: routes.lottery,
  },
  {
    name: "REFERRAL",
    icon: <FontAwesomeIcon icon={faUserGroup} className={"h-6 w-6"} />,
    href: routes.referral,
  },
  // {
  //   name: 'Home',
  //   icon: <HomeIcon />,
  //   href: routes.home,
  // },
  // {
  //   name: 'Live Pricing',
  //   icon: <LivePricing />,
  //   href: routes.livePricing,
  // },
  // {
  //   name: 'Farm',
  //   icon: <FarmIcon />,
  //   href: routes.farms,
  // },
  // {
  //   name: 'Swap',
  //   icon: <ExchangeIcon />,
  //   href: routes.swap,
  // },
  // {
  //   name: 'Liquidity',
  //   icon: <PoolIcon />,
  //   href: routes.liquidity,
  // },
  // {
  //   name: 'NFTs',
  //   icon: <CompassIcon />,
  //   href: routes.search,
  //   dropdownItems: [
  //     {
  //       name: 'Explore NFTs',
  //       icon: <CompassIcon />,
  //       href: routes.search,
  //     },
  //     {
  //       name: 'Create NFT',
  //       icon: <PlusCircle />,
  //       href: routes.createNft,
  //     },
  //     {
  //       name: 'NFT Details',
  //       icon: <DiskIcon />,
  //       href: routes.nftDetails,
  //     },
  //   ],
  // },
  // {
  //   name: 'Profile',
  //   icon: <ProfileIcon />,
  //   href: routes.profile,
  // },
  // {
  //   name: 'Vote',
  //   icon: <VoteIcon />,
  //   href: routes.vote,
  //   dropdownItems: [
  //     {
  //       name: 'Explore',
  //       href: routes.vote,
  //     },
  //     {
  //       name: 'Vote with pools',
  //       href: routes.proposals,
  //     },
  //     {
  //       name: 'Create proposal',
  //       href: routes.createProposal,
  //     },
  //   ],
  // },
]
