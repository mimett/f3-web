import {BusdTokenAddress} from "@/config/contracts";
import {ZERO_ADDRESS} from "@/utils";
import {Bnb} from "@/components/icons/bnb";
import {Tusd} from "@/components/icons/tusd";
import Image from "next/image";

export default function Token({className} : {className: string}) {
  
  return (
    <>
      {BusdTokenAddress === ZERO_ADDRESS && 
        <Bnb className={className}/> ||
        <Image
          className={className}
          src={"/assets/Icon/tusd.png"}
          alt={"busd-token"}
          width={15}
          height={15}
        />
      }
    </>
  )
}
