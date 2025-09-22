// Allow UnifiedLeadDialog to accept optional ctaLabel/variant props as used by FooterCTA
declare module "@/components/UnifiedLeadDialog" {
  import * as React from "react";

  export type LeadVariant = "callback" | "enquiry" | "site-visit" | (string & {});

  export interface UnifiedLeadDialogProps {
    ctaLabel?: string;
    variant?: LeadVariant;
    projectId?: string | null;
    projectName?: string | null;
    className?: string;
    // Common button props (safe extras)
    disabled?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
  }

  const UnifiedLeadDialog: React.FC<UnifiedLeadDialogProps>;
  export default UnifiedLeadDialog;
}
