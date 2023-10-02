import {OP_BNB_TX_URL} from "@/utils";
import classNames from "classnames";

export default function TxHyperLink({txHash}: {txHash: string}) {
  return (
    <a href={OP_BNB_TX_URL + txHash} target={"#"} className={classNames(
      'text-xs normal-case text-blue-600 dark:text-sky-400 underline',
      "underline-offset-2"
    )}>Detail Transaction</a>
  )
}