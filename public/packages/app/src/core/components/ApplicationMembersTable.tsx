import { useUser } from "../hooks/useUser";
import { membersAction } from "../lib/api/members";
import { Avatar, Button, Select, Table, TableColumn, Tooltip } from "@traceo/ui";
import { ADMIN_EMAIL } from "../utils/constants";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { MemberRole, ApplicationMember } from "@traceo/types";
import { Confirm } from "./Confirm";
import { useApplication } from "../hooks/useApplication";
import { CheckCircleFilled } from "@ant-design/icons";

interface Props {
  collection: ApplicationMember[];
  postExecute: () => void;
  className?: string;
}
export const ApplicationMembersTable: FC<Props> = ({
  collection,
  postExecute,
  className
}) => {
  const user = useUser();
  const { permission } = useApplication();

  const navigate = useNavigate();

  const options = [
    { label: "Administrator", value: MemberRole.ADMINISTRATOR },
    { label: "Maintainer", value: MemberRole.MAINTAINER },
    { label: "Viewer", value: MemberRole.VIEWER }
  ];

  const onUpdateRole = async (member: ApplicationMember, role: MemberRole) => {
    await membersAction.onUpdateRole(member, role, () => postExecute());
  };

  const onRemoveFromApp = async (member: ApplicationMember) => {
    await membersAction.onRemoveFromApp(member, () => {
      postExecute();

      if (member?.userId === user.id) {
        navigate("/dashboard/overview");
      }
    });
  };
  return (
    <Table className={className} collection={collection} striped>
      <TableColumn width={5}>
        {({ item }) => <Avatar size="sm" src={item?.gravatar} alt={item?.name} />}
      </TableColumn>
      <TableColumn name="Name" value="name">
        {({ item }) => (
          <div className="flex flex-row">
            <span>{item.name}</span>
            {item?.userId === user?.id && (
              <Tooltip placement="bottom" title="It's you!">
                <CheckCircleFilled className="p-1 text-amber-600" />
              </Tooltip>
            )}
          </div>
        )}
      </TableColumn>
      <TableColumn name="Email" value="email" />
      <TableColumn name="Role" className="py-0">
        {({ item }) => {
          if (item.email === ADMIN_EMAIL || permission === MemberRole.VIEWER) {
            return <span>{item.role}</span>;
          }

          return (
            <div className="max-w-min">
              <Select
                isDisabled={item.email === ADMIN_EMAIL}
                onChange={(opt) => onUpdateRole(item, opt?.value)}
                defaultValue={item.role}
                options={options}
                menuPlacement="auto"
              />
            </div>
          );
        }}
      </TableColumn>
      <TableColumn width={100} />
      <TableColumn width={50}>
        {({ item }) => {
          if (item.email !== ADMIN_EMAIL && permission !== MemberRole.VIEWER) {
            return (
              <Confirm
                description="Are you sure you want to remove this user from app?"
                onOk={() => onRemoveFromApp(item)}
              >
                <Button size="xs" variant="danger">
                  Remove
                </Button>
              </Confirm>
            );
          }
        }}
      </TableColumn>
    </Table>
  );
};
