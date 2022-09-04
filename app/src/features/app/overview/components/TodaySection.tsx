import { ClockCircleOutlined, LoadingOutlined, SyncOutlined } from "@ant-design/icons";
import { Space } from "antd";
import PageHeader from "src/core/components/PageHeader";
import { DailyStats } from "src/types/statistics";
import dateUtils from "src/core/utils/date";
import { useParams } from "react-router-dom";
import { useApi } from "src/core/lib/useApi";
import { PagePanel } from "src/core/components/PagePanel";
import { TodayStats } from "./TodayStats";
import { TodayIncidentsPlot } from "src/core/components/Plots/components/TodayIncidentsPlot";

export const TodaySection = () => {
  const { id } = useParams();

  const {
    data: stats,
    isLoading,
    execute: get
  } = useApi<DailyStats>({
    url: "/api/statistics/daily",
    params: {
      id
    }
  });

  const reloadDailyStats = () => {
    get();
  };

  return (
    <>
      <PagePanel>
        <PageHeader
          title="Today"
          subTitle={
            <Space className="gap-0 text-xs">
              <ClockCircleOutlined className="mr-1" /> {dateUtils.getNow("HH:mm")}
            </Space>
          }
          suffix={<SyncOutlined className="text-xs" onClick={() => reloadDailyStats()} />}
        />
        {isLoading ? (
          <Space className="w-full justify-center">
            <LoadingOutlined />
          </Space>
        ) : (
          <Space className="w-full justify-between gap-0">
            <TodayIncidentsPlot stats={stats?.data} />
            <TodayStats stats={stats} />
          </Space>
        )}
      </PagePanel>
    </>
  );
};