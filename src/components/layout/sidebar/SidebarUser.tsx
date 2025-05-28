
import { User } from "lucide-react";

interface SidebarUserProps {
  name: string;
  role: string;
}

const SidebarUser = ({ name, role }: SidebarUserProps) => {
  return (
    <div className="mb-8">
      <div className="w-full p-3 bg-gray-100 rounded-lg mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
            <User className="h-5 w-5" />
          </div>
          <div className="text-gray-900">
            <p className="font-medium text-sm">Bem-vindo(a),</p>
            <p className="font-bold">{name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarUser;
