import Image from "next/image"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useWaitForTransaction } from "wagmi"
import {
  LotteryAddress,
  LotteryTokenAddress,
  TournamentAddress,
  TournamentContract,
} from "@/config/contracts"
import { ethers } from "ethers"
import Gameplay from "../battle/game/gameplay"
import { useGamePlayerInfo } from "@/hooks/useGamePlayerInfos"
import { useMultiNFTAttribute } from "@/hooks/useNFT"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

function GameCounter({ value }: { value: Number }) {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
      <motion.div
        className="box mt-[32px] text-[80px] font-bold text-black"
        animate={{
          scale: [0.5, 1.4, 1],
          rotate: [0, 0, 0],
        }}
        transition={{
          duration: 1,
          ease: "easeInOut",
          times: [0, 0.3, 0.7],
          repeat: Infinity,
        }}
      >
        {value}
      </motion.div>
    </div>
  )
}

export default function Game({
  txHash,
  account,
  opponent,
  round,
}: {
  txHash: string
  account: string
  opponent: string
  round: string
}) {
  const [counter, setCounter] = useState(4)
  const [isWin, setIsWin] = useState(undefined)
  const [hasLottery, setHasLottery] = useState(undefined)
  const router = useRouter()

  const { data: playerInfo } = useGamePlayerInfo(account, round)
  const { data: opponentInfo } = useGamePlayerInfo(opponent, round)

  const squadInfos = useMultiNFTAttribute(
    playerInfo?.squad.filter((i) => !!i).map((i) => i.toString()) || [],
  )

  const opSquadInfos = useMultiNFTAttribute(
    opponentInfo?.squad.filter((i) => !!i).map((i) => i.toString()) || [],
  )

  const { data: result, isError } = useWaitForTransaction({
    hash: txHash,
  })

  useEffect(() => {
    if (isError) {
      toast.error("Failed to execute Battle transaction")
      return router.back()
    }

    if (!result) {
      return
    }

    async function checkResult(result: any) {
      const hasLotteryLog = result.logs.some(
        (i: any) =>
          i.address.toLocaleLowerCase() ==
          LotteryTokenAddress.toLocaleLowerCase(),
      )
      setHasLottery(hasLotteryLog)

      const log = result.logs.filter(
        (i: any) =>
          i.address.toLocaleLowerCase() ==
          TournamentAddress.toLocaleLowerCase(),
      )[0]
      const iface = new ethers.Interface(TournamentContract.abi)
      const decodedData = await iface.parseLog({
        data: log.data,
        topics: log.topics,
      })

      const isWin = decodedData.args[2]
      setIsWin(isWin)
    }

    checkResult(result)
  }, [result, isError])

  useEffect(() => {
    if (counter == 0) {
      return
    }
    const interval = setInterval(() => {
      setCounter(counter - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [counter])

  const isLoading = () => {
    return counter > 0
  }

  return (
    <div className="relative h-[calc(100vh_-_136px)]">
      {isLoading() && (
        <>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
            <motion.div
              className="box"
              animate={{
                scale: [0.5, 1.2, 1],
                rotate: [0, 0, 0],
              }}
              transition={{
                duration: 1.3,
                ease: "easeInOut",
                times: [0, 0.4, 0.7],
              }}
            >
              <Image
                src={"/assets/game/shield-sword.svg"}
                alt={""}
                width={200}
                height={200}
              ></Image>
            </motion.div>
            {counter >= 1 && counter <= 3 && <GameCounter value={counter} />}
          </div>
        </>
      )}
      {!isLoading() && (
        <>
          <Gameplay
            result={isWin}
            squad={squadInfos}
            opSquad={opSquadInfos}
            hasLottery={hasLottery}
          ></Gameplay>
        </>
      )}
    </div>
  )
}
