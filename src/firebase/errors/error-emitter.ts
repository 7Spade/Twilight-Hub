type Listener = (error: Error) => void;

const listeners = new Set<Listener>();

export function emitFirebaseError(error: Error) {
  listeners.forEach((l) => l(error));
}

export function onFirebaseError(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}