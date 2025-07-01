import { cn } from "@/lib/utils";
import Image from "next/image";
import * as React from "react";

const Input = (
  { className, icon, label, type, placeholder, classNameParent, ...props },
  ref
) => {
  return (
    <div
      className={`flex text-start  text-white w-fit  flex-col gap-2 ${classNameParent}`}
    >
      <label className="text-white text-start text-lg max-xs:text-sm flex gap-2">
        {label}
        {icon && <Image src={icon} alt=""/>}
      </label>
      <div className="input-border">
        <input
          type={type}
          className={cn(
            " flex h-12 w-full placeholder:!text-[#6D83B6] max-xs:!text-xs placeholder:text-base  appearance-none !rounded-[10px] z-[1000]  !bg-[#040613e0]   px-3 py-2 text-base ring-offset-background  file:bg-transparent file:text-sm file:font-medium file:text-foreground  focus-visible:outline-none   disabled:cursor-not-allowed disabled:opacity-50 md:text-sm  focus:border-none focus:outline-none",
            className
          )}
          placeholder={placeholder || label}
          ref={ref}
          {...props}
        />
      </div>
    </div>
  );
};
Input.displayName = "Input";

export { Input };
