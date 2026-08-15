import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { upsertCustomer, upsertMessage } from "@/features/chat/util/chatCache";
import { chatKeys } from "@/features/chat/util/chatKeys";
import { TChatEvent } from "@/types/chat/chatType";

export const useChatStream = () => {
  const queryClient = useQueryClient();
  const hasDropped = useRef(false);

  useEffect(() => {
    const source = new EventSource("/api/chat/stream");

    const handleEvent = (event: MessageEvent<string>) => {
      const payload = JSON.parse(event.data) as TChatEvent;

      if (payload.type === "message.created") {
        upsertMessage(queryClient, payload.customerId, payload.message);
        return;
      }

      upsertCustomer(queryClient, payload.customer);
    };

    const handleError = () => {
      hasDropped.current = true;
    };

    const handleOpen = () => {
      if (!hasDropped.current) return;

      hasDropped.current = false;
      queryClient.invalidateQueries({ queryKey: chatKeys.customers });
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    };

    source.addEventListener("message.created", handleEvent);
    source.addEventListener("customer.updated", handleEvent);
    source.addEventListener("error", handleError);
    source.addEventListener("open", handleOpen);

    return () => {
      source.removeEventListener("message.created", handleEvent);
      source.removeEventListener("customer.updated", handleEvent);
      source.removeEventListener("error", handleError);
      source.removeEventListener("open", handleOpen);
      source.close();
    };
  }, [queryClient]);
};
