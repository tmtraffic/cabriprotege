
import Layout from "@/components/layout/Layout";

interface RouteWithLayoutProps {
  component: React.ComponentType;
  userRole?: "client" | "employee" | "admin";
}

const RouteWithLayout = ({ component: Component, userRole = "admin" }: RouteWithLayoutProps) => {
  return (
    <Layout userRole={userRole}>
      <Component />
    </Layout>
  );
};

export default RouteWithLayout;
