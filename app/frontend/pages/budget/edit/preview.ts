import { useEffect } from "react";
import { appClient } from "@/utils/app-client";
import { useEditStore } from "./store";
import { useChangePayloads } from "./payload";

const PREVIEW_DEBOUNCE_MS = 400;

const useDiscretionaryPreview = (props: {
  month: number | string;
  year: number | string;
}) => {
  const payloads = useChangePayloads();
  const setDiscretionaryAfter = useEditStore((s) => s.setDiscretionaryAfter);
  const setPreviewStatus = useEditStore((s) => s.setPreviewStatus);
  const payloadsKey = JSON.stringify(payloads);

  useEffect(() => {
    if (payloads.length === 0) {
      setDiscretionaryAfter(null);
      setPreviewStatus("idle");
      return;
    }

    setPreviewStatus("loading");
    let cancelled = false;

    const timer = setTimeout(() => {
      appClient
        .post(`/budget/${props.month}/${props.year}/edit/preview`, {
          body: { changes: payloads },
        })
        .then((response) => response.json())
        .then((data) => {
          if (cancelled) return;
          setDiscretionaryAfter(data);
          setPreviewStatus("idle");
        })
        .catch(() => {
          if (!cancelled) setPreviewStatus("idle");
        });
    }, PREVIEW_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payloadsKey, props.month, props.year]);
};

export { useDiscretionaryPreview };
