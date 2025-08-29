// frontend/src/components/PageWrapper.tsx
import React from "react";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#f4f6f8",
        padding: "30px",
        borderRadius: "8px",
        minHeight: "100vh",
      }}
    >
      {children}
    </div>
  );
}
