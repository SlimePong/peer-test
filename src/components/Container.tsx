import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const Container = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <section
      className={cn(
        "flex flex-col items-center w-full min-h-screen py-2 pb-32 md:py-8",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-1  max-w-lg">
        {children}
      </div>
    </section>
  );
};

export default Container;
