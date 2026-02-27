import { Queue, Track } from 'moonlink.js';

export interface QueueAddOptions {
  priority?: boolean;
}

export function addTracksToQueue(
  queue: Queue,
  tracks: Track | Track[],
  options: QueueAddOptions = {},
): void {
  const trackArray = Array.isArray(tracks) ? tracks : [tracks];

  // Add tracks to the front of the queue if priority is true, otherwise add to the end
  if (options.priority) {
    queue.tracks.unshift(...trackArray);
  } else {
    queue.add(trackArray);
  }
}
