// Allow EnquiryForm to accept an optional onSubmitted callback without changing the component
declare module "@/components/EnquiryForm" {
  import * as React from "react";

  export interface EnquiryFormProps {
    mode?: "callback" | "enquiry" | "site-visit" | string;
    projectName?: string | null;
    // Optional callback invoked after a successful submit (ignored if not used by the component)
    onSubmitted?: () => void;
  }

  const EnquiryForm: React.FC<EnquiryFormProps>;
  export default EnquiryForm;
}
