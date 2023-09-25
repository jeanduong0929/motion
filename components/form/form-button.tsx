import React from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface FormButtonProps {
  label: string;
  loading: boolean;
}

const FormButton = ({ label, loading }: FormButtonProps) => {
  return (
    <>
      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {label}
      </Button>
    </>
  );
};

export default FormButton;
