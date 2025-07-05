import { IconBrandSpeedtest, IconRulerMeasure, IconTractor } from "@tabler/icons-react";
import { DistanceChart } from "../charts/DistanceChart";
import { Card } from "../ui/Card";
import { SpeedChart } from "../charts/SpeedChart";
import { useTractorTracking } from "../../context/TractorTrackingContext";
import { getCurrentSpeed } from "../../utils/speedUtils";
import styled from "styled-components";

const SlidingPanelContainer = styled.div
  .withConfig({
    shouldForwardProp: (prop) => prop !== 'collapsed', // filter out boolean prop
  })
  .attrs<{ collapsed?: boolean }>((props) => ({
    className: `bg-slate-50 border-r border-gray-200 transition-all duration-300 h-full overflow-y-auto flex-shrink-0 ${
      props.collapsed
        ? 'w-0 min-w-0 overflow-hidden opacity-0'
        : 'w-96 min-w-[24rem] p-6  opacity-100'
    }`,
  }))``;

export function SlidingPanel({ collapsed = false }: { collapsed?: boolean }) {
  const { activeTractor, gpsData } = useTractorTracking();

  return (
    <SlidingPanelContainer collapsed={collapsed}>
      <h2 className="text-lg font-semibold mb-4">Tractor Details</h2>
      {activeTractor ? (
        <div className="space-y-4">
          <Card>
            <div className="flex items-center gap-3 mb-3">
              <IconTractor className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-800">{activeTractor.name}</h3>
                <p className="text-sm text-gray-600">{activeTractor.model}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Location:</span>
                <span className="text-sm font-medium">
                  {activeTractor.location.lat}. {activeTractor.location.lng}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                {activeTractor.status}
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Speed:</span>
                <span className="text-sm font-medium">
                  {getCurrentSpeed(activeTractor, gpsData)}
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <IconBrandSpeedtest className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-800">Speed over Time</h3>
            </div>
            <SpeedChart gpsData={gpsData} />
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <IconRulerMeasure className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-800">Distance over Time</h3>
            </div>
            <DistanceChart gpsData={gpsData} />
          </Card>
        </div>
      ) : (
        <Card>
          <div className="text-center text-gray-500">
            <p className="text-lg font-semibold">No Tractor Selected</p>
            <p className="text-sm">Select a tractor from the dashboard to see details</p>
          </div>
        </Card>
      )}
    </SlidingPanelContainer>
  );
}