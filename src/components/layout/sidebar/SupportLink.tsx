
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

const SupportLink = () => {
  return (
    <Link
      to="/ajuda"
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
    >
      <Search className="h-5 w-5" />
      <span>Ajuda e Suporte</span>
    </Link>
  );
};

export default SupportLink;
