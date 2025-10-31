// Expanded types so LeadBus usage compiles (open/onClose/mode props)
declare module "@/components/UnifiedLeadDialog" {
  import * as React from "react";

  export type LeadVariant = "callback" | "enquiry" | "site-visit" | (string & {});

  export interface UnifiedLeadDialogProps {
    // Button / trigger customizations
    ctaLabel?: string;
    variant?: LeadVariant;

    // Identify context
    projectId?: string | null;
    projectName?: string | null;

    // Controlled dialog support (as used by LeadBus)
    open?: boolean;
    onClose?: () => void;
    mode?: LeadVariant;

    className?: string;
    disabled?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
  }

  const UnifiedLeadDialog: React.FC<UnifiedLeadDialogProps>;
  export default UnifiedLeadDialog;
}
