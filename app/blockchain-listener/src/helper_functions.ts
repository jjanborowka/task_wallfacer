import { AbiEvent, PublicClient } from "viem";

export function formatLogArgs(logArgs:any) {
    return Object.entries(logArgs)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  }
  

