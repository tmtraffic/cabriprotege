
import { LucideIcon } from "lucide-react";
import MenuItem from "./MenuItem";

interface MicroserviceType {
  title: string;
  href: string;
  icon: LucideIcon;
}

interface MicroservicesSectionProps {
  items: MicroserviceType[];
  currentPath: string;
}

const MicroservicesSection = ({ items, currentPath }: MicroservicesSectionProps) => {
  return (
    <>
      <div className="pt-4 pb-2">
        <p className="px-3 text-xs font-semibold uppercase text-sidebar-foreground opacity-60">
          Microserviços
        </p>
      </div>
      
      {items.map((item) => (
        <MenuItem
          key={item.href}
          title={item.title}
          href={item.href}
          icon={item.icon}
          isActive={currentPath === item.href}
        />
      ))}
    </>
  );
};

export default MicroservicesSection;
