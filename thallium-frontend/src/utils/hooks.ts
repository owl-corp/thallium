import { useMemo, useState, useEffect } from "react";

export function useVisible(ref: RefObject<HTMLElement>) {
  const [isVisible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
        ([entry]) => setVisible(entry.isIntersecting)
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return isVisible
}
