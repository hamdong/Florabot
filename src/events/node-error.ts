import { CustomClient } from '..';
import { Node } from 'moonlink.js';

export const name = 'nodeError';
export const once = false;
export const manager = true;

export async function execute(
  node: Node,
  error: Error,
  client: CustomClient
): Promise<void> {
  console.error(`Node ${node.host} error:`, error);
}
