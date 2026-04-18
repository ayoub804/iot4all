import type { ReactNode } from "react";

export default function MeetingLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}
