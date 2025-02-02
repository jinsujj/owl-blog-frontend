"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface SearchParamProps {
  onCodeReceived: (code: string | null) => void;
}

function InnerComponent({onCodeReceived}: SearchParamProps) {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    onCodeReceived(code);
  }, [code]);

  return null;
}

export default function SearchParamsHandler(props: SearchParamProps){
  return (
    <Suspense fallback={null}>
      <InnerComponent {...props} />
    </Suspense>
  )
}