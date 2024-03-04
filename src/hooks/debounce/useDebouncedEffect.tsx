import { useEffect } from "react";

interface UseDebouncedEffectProps {
  effect: () => void;
  deps: any[] | undefined;
  delay: number;
}

export const useDebouncedEffect = ({
  effect,
  deps,
  delay,
}: UseDebouncedEffectProps) => {
  useEffect(
    () => {
      const handler = setTimeout(() => effect(), delay);

      return () => clearTimeout(handler);
    },
    deps ? [...deps, delay] : [delay]
  );
};
