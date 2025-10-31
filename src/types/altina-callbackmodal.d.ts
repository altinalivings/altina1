// Type augmentation so TS accepts open/onOpenChange/source on CallbackModal
declare module "@/components/CallbackModal" {
  import * as React from "react";

  export interface CallbackModalProps {
    projectName?: string | null;
    /** Optional controlled open state */
    open?: boolean;
    /** Called when modal requests a change */
    onOpenChange?: (open: boolean) => void;
    /** Analytics/source tag */
    source?: string;
  }

  const CallbackModal: React.FC<CallbackModalProps>;
  export default CallbackModal;
}
