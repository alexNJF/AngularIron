onmessage = (event: MessageEvent) => {
  fetch(event.data)
    .then((response: Response) => response.text())
    // @ts-ignore
    .then((text: string) => postMessage(text));
};
