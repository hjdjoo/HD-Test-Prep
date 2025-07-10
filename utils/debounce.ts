
function debounce<T extends Function>(
  func: T,
  delay: number
): (...args: any[]) => void {

  let timeoutId: NodeJS.Timeout;

  return function (this: any, ...args: any[]) {

    const context = this;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {

      func.apply(context, args)

    }, delay)
  }
}

export default debounce;