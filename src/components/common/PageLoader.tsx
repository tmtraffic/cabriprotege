
import React from "react";

const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-4 border-cabricop-blue border-t-cabricop-orange rounded-full animate-spin"></div>
    <span className="ml-2">Carregando...</span>
  </div>
);

export default PageLoader;
