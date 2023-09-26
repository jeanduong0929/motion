import React from "react";
import { Input, InputProps } from "../ui/input";

interface FormInputProps extends InputProps {
  placeholder: string;
  type: string;
  value: string;
  handleValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string;
}

const FormInput = ({
  placeholder,
  type,
  value,
  handleValue,
  error,
}: FormInputProps) => {
  return (
    <>
      <div className="flex flex-col items-start gap-1 w-full">
        <Input
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={handleValue}
          onBlur={handleValue}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </>
  );
};

export default FormInput;
