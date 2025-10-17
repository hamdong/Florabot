import { Node } from 'moonlink.js';

export const name = 'nodeConnected';
export const once = false;
export const manager = true;

export async function execute(node: Node): Promise<void> {
  console.log(`Node ${node.host} connected!`);
}
