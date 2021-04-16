export type AnimationSpeed = 'normal' | 'slow' | 'slower' | 'fast' | 'faster';

export const animateCss = (element: string | HTMLElement, animationName: string, animationSpeed: AnimationSpeed = 'normal') => {
  // Create a Promise and return it
  return new Promise((resolve: (message: string) => void, reject: (message: string) => void) => {
    const node: HTMLElement | null = typeof element === 'string' ? document.querySelector(element) : element;
    // If node value is falsy reject the Promise
    if (!node) {
      reject(`animateCss: Can't find node!`);
      return;
    }
    const toggleClasses = ['animated', animationName];
    if (animationSpeed !== 'normal') toggleClasses.push(animationSpeed);
    node.classList.add(...toggleClasses);
    // When the animation ends, clean the classes and resolve the Promise
    node.addEventListener('animationend', (event: Event) => {
      event.stopPropagation();
      node?.classList.remove(...toggleClasses);
      resolve(`animateCss: Animation ended`);
    }, {
      once: true
    });
  });
};
