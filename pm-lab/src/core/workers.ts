export function runWorker<TIn, TOut>(url: string | URL, payload: TIn): Promise<TOut> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(url, { type: 'module' });
    worker.onmessage = event => {
      resolve(event.data as TOut);
      worker.terminate();
    };
    worker.onerror = reject;
    worker.postMessage(payload);
  });
}
