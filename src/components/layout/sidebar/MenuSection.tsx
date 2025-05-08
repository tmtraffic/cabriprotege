
import { LucideIcon } from "lucide-react";
import MenuItem from "./MenuItem";

interface MenuItemType {
  title: string;
  href: string;
  icon: LucideIcon;
}

interface MenuSectionProps {
  items: MenuItemType[];
  currentPath: string;
}

const MenuSection = ({ items, currentPath }: MenuSectionProps) => {
  return (
    <>
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

export default MenuSection;
