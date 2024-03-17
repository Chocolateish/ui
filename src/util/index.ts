export * from "./math";
export * from "./string";
export * from "./ip";

export function clickAwayDetector(action: () => void): () => void {
  document.addEventListener("contextmenu", action, {
    passive: true,
    capture: true,
  });
  document.addEventListener("pointerdown", action, {
    passive: true,
  });
  window.addEventListener("blur", action, {
    passive: true,
  });
  return () => {
    document.removeEventListener("contextmenu", action, {
      capture: true,
    });
    document.removeEventListener("pointerdown", action);
    window.removeEventListener("blur", action);
  };
}
