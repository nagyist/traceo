import { RightOutlined, DownOutlined, DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";

interface Props {
  title?: string | JSX.Element;
  collapsedText?: string | JSX.Element;
  deafultCollapsed?: boolean;
  children: JSX.Element | JSX.Element[];
  footer?: JSX.Element;
  extra?: JSX.Element;
  loading?: boolean;
}
export const OptionsCollapseGroup = ({
  title = undefined,
  collapsedText = undefined,
  children,
  deafultCollapsed = true,
  footer = undefined,
  extra = undefined,
  loading = false
}: Props) => {
  const [collapsed, setCollapsed] = useState<boolean>(deafultCollapsed);

  const icon = collapsed ? <RightOutlined /> : <DownOutlined />;

  return (
    <div className="mb-2 p-3 pb-0 text-sm w-full flex flex-col rounded bg-primary">
      <div className="flex flex-row items-center gap-x-3 justify-between w-full pr-3">
        <div
          className="flex flex-row items-center gap-x-2 text-primary cursor-pointer"
          onClick={() => setCollapsed(!collapsed)}
        >
          <span className="text-[8px]">{icon}</span>
          <span className="font-semibold">{title}</span>
          {collapsedText && collapsed && (
            <span className="pl-5 text-xs font-normal italic">{collapsedText}</span>
          )}
        </div>
        {extra && extra}
        {loading && <LoadingOutlined />}
      </div>

      {!collapsed && <div className="p-3 pt-5 text-primary">{children}</div>}

      {footer && <div className="pl-5 py-3">{footer}</div>}
    </div>
  );
};