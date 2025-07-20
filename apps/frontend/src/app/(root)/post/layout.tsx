import { Toaster } from "@/components/ui/sonner";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
      <Toaster />
    </div>
  );
}
