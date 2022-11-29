import {
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import { Divider } from "antd";
import { TraceoLogo } from "../.../../../../../core/components/Icons/TraceoLogo";
import { logout } from "../.../../../../../core/utils/logout";
import { useSelector } from "react-redux";
import { MenuRoute } from "../.../../../../../types/navigation";
import { StoreState } from "../.../../../../../types/store";
import { NavBarItem } from "./NavBarItem";
import { NavbarWrapper } from "./NavbarWrapper";

export const DashboardNavBar = () => {
  const { account } = useSelector((state: StoreState) => state.account);

  const filterRoutes = (routes: MenuRoute[]) =>
    !account.isAdmin ? routes.filter((r) => !r.adminRoute) : routes;

  const topRoutes: MenuRoute[] = filterRoutes([
    {
      key: "home",
      disabled: true,
      icon: <TraceoLogo size="small" withName={false} />,
      label: "",
      href: "/dashboard/overview"
    },
    {
      key: "overview",
      href: "/dashboard/overview",
      label: "Overview",
      icon: <HomeOutlined />
    }
  ]);

  const manageRoutes: MenuRoute[] = filterRoutes([
    {
      key: "management",
      href: "/dashboard/management/accounts",
      label: "Management",
      adminRoute: true,
      icon: <SettingOutlined />
    }
  ]);

  const userRoutes: MenuRoute[] = filterRoutes([
    {
      key: "account",
      href: "/dashboard/account/settings",
      label: "Account",
      icon: <UserOutlined />
    }
  ]);

  const bottomRoutes: MenuRoute[] = filterRoutes([
    {
      label: "Logout",
      href: "",
      icon: <LogoutOutlined />,
      onClick: () => logout()
    }
  ]);

  return (
    <NavbarWrapper>
      <ul className="list-none p-0 h-full self-center space-y-2 justify-between">
        {topRoutes.map((route) => (
          <NavBarItem route={route} />
        ))}

        <Divider className="pb-2" />

        {manageRoutes.map((route) => (
          <NavBarItem route={route} />
        ))}

        {manageRoutes.length > 0 && <Divider className="pb-2" />}

        {userRoutes.map((route) => (
          <NavBarItem route={route} />
        ))}
      </ul>

      <ul className="list-none p-0 self-center space-y-2 justify-between">
        {bottomRoutes.map((route) => (
          <NavBarItem route={route} />
        ))}
      </ul>
    </NavbarWrapper>
  );
};