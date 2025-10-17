import { Player } from 'moonlink.js';
import { CustomClient } from '../types/CustomClient';

export const name = 'socketClosed';
export const once = false;
export const manager = true;

export async function execute(
  player: Player,
  code: number,
  reason: string,
  byRemote: boolean,
  client: CustomClient
): Promise<void> {
  console.log(
    `Socket closed with code ${code} for reason: ${reason} (byRemote: ${byRemote})`
  );
}
