import React from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface FormButtonProps {
  label: string;
  loading: boolean;
  type?: "submit" | "button" | "reset" | undefined;
}

const FormButton = ({ label, loading, type }: FormButtonProps) => {
  return (
    <>
      <Button type={type} disabled={loading} className="w-full">
        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {label}
      </Button>
    </>
  );
};

export default FormButton;
