
import React, { lazy, Suspense } from "react";
import PageLoader from "@/components/common/PageLoader";

export function lazyWithLoader(importFunc: () => Promise<any>) {
  const LazyComponent = lazy(importFunc);
  
  return (props: any) => (
    <Suspense fallback={<PageLoader />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}
