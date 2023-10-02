import Decimal from "decimal.js";

export function startAndEnd(str: string, start: number = 6, end: number = 4) {
  // if (str.length > 35) {
  return str.substr(0, start) + "..." + str.substr(str.length - end, str.length)
  // }
}

export function formatDecimalString(decimalString: string) {
  const decimalValue = new Decimal(decimalString);
  const formattedValue = decimalValue.toFixed(20); // Use a higher precision
  const decimalIndex = formattedValue.indexOf('.');
  if (decimalIndex !== -1) {
    return formattedValue.slice(0, decimalIndex + 3); // Include two decimal places
  }
  return formattedValue;
}

export const OP_BNB_SCAN_URL =  "https://opbnbscan.com/address/"
export const OP_BNB_TX_URL =  "https://opbnbscan.com/tx/"


export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

export const AttributeMapping = {
  element: 0,
  rarity: 1,
  attack: 2,
  defense: 3,
  level: 4,
  baseRate: 5,
  hashRate: 6,
  bornAt: 7,
}
