import React from "react";

export default function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <h3 className="text-[var(--text-faint)] text-[11px] font-medium px-3 mb-1">
        {title}
      </h3>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}
