import { ContactsOutlined } from "@ant-design/icons";
import { DescriptionInputRow, Descriptions } from "../../core/components/Descriptions";
import { PagePanel } from "../../core/components/PagePanel";
import { CONTACT_EMAIL, VERSION } from "../../core/utils/constants";
import dateUtils from "../../core/utils/date";
import { ManagementNavigation } from "./components/ManagementNavigation";

const ManagementInstancePage = () => {
  return (
    <ManagementNavigation>
      <PagePanel title="Basic Informations">
        <Descriptions>
          <DescriptionInputRow label="Name">
            © {new Date().getFullYear()} Traceo Platform
          </DescriptionInputRow>
          <DescriptionInputRow label="Version">{VERSION}</DescriptionInputRow>
          <DescriptionInputRow label="Timezone">
            {dateUtils.guessTz()} timezone
          </DescriptionInputRow>
          <DescriptionInputRow label="Contact">
            <ContactsOutlined
              className="text-cyan-500"
              onClick={() => window.open(`mailto:${CONTACT_EMAIL}`)}
            />
          </DescriptionInputRow>
        </Descriptions>
      </PagePanel>
    </ManagementNavigation>
  );
};

export default ManagementInstancePage;