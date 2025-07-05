import { useTractorTracking } from "../context/TractorTrackingContext";
import { Card } from "./ui/Card";
import { IconTractor, IconCheck, IconChartBar, IconTool } from "@tabler/icons-react";

export function OverviewCards() {
  const { tractors, gpsData } = useTractorTracking();
  const totalTractors = tractors.length;
  const activeTractors = gpsData.length > 0 ? 1 : 0; // Currently only one active tractor is tracked at a time
  const inMaintenanceTractors = tractors.filter(t => t.status === 'maintenance').length;
  const fleetEfficiency =
    totalTractors > 0
      ? Math.round((activeTractors / (totalTractors - inMaintenanceTractors)) * 100)
      : 0;
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <Card>
        <OverviewItem
          title={'Total Tractors'}
          value={totalTractors}
          icon={<IconTractor className="stroke-green-600" size={64} />}
        />
      </Card>
      <Card>
        <OverviewItem
          title={'Active Now'}
          value={activeTractors}
          icon={<IconCheck className="stroke-green-600" size={64} />}
        />
      </Card>
      <Card>
        <OverviewItem
          title={'In Maintenance'}
          value={inMaintenanceTractors}
          icon={<IconTool className="stroke-green-600" size={64} />}
        />
      </Card>
      <Card>
        <OverviewItem
          title={'Fleet Efficiency'}
          value={fleetEfficiency + '%'}
          icon={<IconChartBar className="stroke-green-600" size={64} />}
        />
      </Card>
    </div>
  );
}


function OverviewItem({
  title,
  value,
  icon,
}: {
  title?: string;
  value?: string | number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between ">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold text-foreground">{value}</p>
      </div>
      <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
}

