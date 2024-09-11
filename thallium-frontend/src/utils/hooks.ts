import { useState, useEffect } from "react";
import { type RefObject } from "react";

export function useVisible(ref: RefObject<HTMLElement>) {
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
        ([entry]) => { setVisible(entry.isIntersecting); }
    );

    if (ref.current)
      observer.observe(ref.current);

    return () => { observer.disconnect(); };
  }, [ref]);

  return isVisible;
}
