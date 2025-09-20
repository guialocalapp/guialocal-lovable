import React, { useEffect, useContext } from 'react';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { SettingsContext } from "@/contexts/SettingsContext";

export function Toaster() {
  const { toasts } = useToast();
  const { settings } = useContext(SettingsContext) || { settings: { toastDuration: 5000 } };

  useEffect(() => {
    const timeouts = [];
    
    toasts.forEach((t) => {
      if (t.duration === Infinity) {
        return;
      }
      
      const duration = t.duration || settings.toastDuration || 5000;
      
      const timeout = setTimeout(() => {
        t.dismiss();
      }, duration);
      
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [toasts, settings.toastDuration]);


  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const { dismiss, ...restProps } = props;
        return (
          <Toast key={id} {...restProps}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description &&
                <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  );
}