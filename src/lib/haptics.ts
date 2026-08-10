export function hapticTap(): void {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(10);
  }
}

export function hapticSuccess(): void {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate([15, 40, 25]);
  }
}
