import React from 'react';
import InputMask from 'react-input-mask';
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const MaskedInput = React.forwardRef(({ mask, value, onChange, ...props }, ref) => {
  return (
    <InputMask
      mask={mask}
      value={value}
      onChange={onChange}
      maskChar={null}
    >
      {(inputProps) => <Input {...inputProps} {...props} ref={ref} />}
    </InputMask>
  );
});

MaskedInput.displayName = 'MaskedInput';

export { MaskedInput };