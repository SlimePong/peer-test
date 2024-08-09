import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Address } from "viem";
import { Payload } from "./types";
import { DataConnection } from "peerjs";

export function createPayload(message: string, address: Address) {
  let payload: Payload = { message, address: null };

  if (address) {
    payload = { message, address };
  }

  return JSON.stringify(payload);
}

export function parsePayload(data: string) {
  try {
    const parsedData: Payload = JSON.parse(data);
    console.log("🫴 Received payload:", parsedData);
  } catch (e) {
    console.error("Error parsing data:", e);
  }
}

export function sendPayload(conn: DataConnection, payload: string) {
  conn.send(payload);
  console.log(`📤 Sent: ${payload}`);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
