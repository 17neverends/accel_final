import { useEffect, useState } from "react";
import { Panel, Stack } from "rsuite";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { LineChart } from "@mui/x-charts/LineChart";
import { ScatterChart } from "@mui/x-charts/ScatterChart";
import { Statistics } from "../../interfaces/statistics";
import { ChartProps } from "../../interfaces/chartProps";

const WS_URL = `${import.meta.env.VITE_API_WS}/monitoring/ws`;

export default function Monitoring() {
  const [image, setImage] = useState<string | null>(null);
  const [processed, setProcessed] = useState<string | null>(null);
  const [depth, setDepth] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [coordinates, setCoordinates] = useState<ChartProps[]>([]);

  useEffect(() => {
    const sessionIndex = localStorage.getItem("index");
    const nextSessionIndex = sessionIndex ? parseInt(sessionIndex, 10) + 1 : 1;

    localStorage.setItem("index", nextSessionIndex.toString());

    const sessionKey = `session_${nextSessionIndex}`;



    const sessionData = JSON.parse(localStorage.getItem(sessionKey) || "[]");

    const ws = new WebSocket(WS_URL);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setImage(data.shot);
      setProcessed(data.processed);
      setDepth(data.depth);
      setStatistics(data.result);
      setLoading(false);

      const sessionDataEntry = {
        kg_loss: data.result.kg_loss,
        procent_loss: data.result.procent_loss,
        longitude: data.result.longitude,
        latitude: data.result.latitude,
        fullnes: data.result.fullnes,
        date: new Date().toISOString().split('T')[0]
      };

      sessionData.push(sessionDataEntry);

      localStorage.setItem(sessionKey, JSON.stringify(sessionData));

      if (data.result.latitude && data.result.longitude) {
        setCoordinates((prevCoordinates) => [
          ...prevCoordinates,
          {
            latitude: data.result.latitude,
            longitude: data.result.longitude,
            losses: data.result.procent_loss,
          },
        ]);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      <Panel style={{ width: "100%", marginBottom: "10px" }}>
        {loading ? (
          <div>Загрузка...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <img
              src={`data:image/jpeg;base64,${image}`}
              style={{ width: "30%", height: "auto", objectFit: "cover" }}
            />
            <img
              src={`data:image/jpeg;base64,${processed}`}
              style={{ width: "30%", height: "auto", objectFit: "cover" }}
            />
            <img
              src={`data:image/jpeg;base64,${depth}`}
              style={{ width: "30%", height: "auto", objectFit: "cover" }}
            />
          </div>
        )}
      </Panel>
      <Stack spacing={20} style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        {statistics?.procent_loss && (
          <div>
            <Gauge
              value={statistics.procent_loss}
              sx={{
                [`& .${gaugeClasses.valueText}`]: {
                  fontSize: 40,
                  transform: "translate(0px, 0px)",
                },
                [`& .${gaugeClasses.valueArc}`]: {
                  fill: '#9812b0',
                },
              }}
              text={({ value }) => `${value}%`}
              width={250}
              height={250}
              startAngle={0}
              endAngle={360}
            />
            <p style={{ textAlign: "center" }}>Потери за последнюю секунду</p>
          </div>
        )}
        {statistics?.fullnes && (
          <div>
            <Gauge
              value={statistics.fullnes}
              sx={{
                [`& .${gaugeClasses.valueText}`]: {
                  fontSize: 40,
                  transform: "translate(0px, 0px)",
                },
                [`& .${gaugeClasses.valueArc}`]: {
                  fill: '#9812b0',
                },
              }}
              text={({ value }) => `${value}%`}
              width={250}
              height={250}
              startAngle={0}
              endAngle={360}
            />
            <p style={{ textAlign: "center" }}>Заполненность кузова</p>
          </div>
        )}

        {statistics?.kg_loss && (
          <div>
            <LineChart
              xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
              series={[
                {
                  data: [5, 10, 15, 20, statistics.kg_loss, statistics.kg_loss],
                  area: true,
                },
              ]}
              width={350}
              height={250}
              colors={["#721679"]}
            />
            <p style={{ textAlign: "center" }}>Потери за время сеанса</p>
          </div>
        )}

        {coordinates.length > 0 && (
          <div>
            <ScatterChart
              key={coordinates.length}
              grid={{ vertical: true, horizontal: true }}
              dataset={coordinates.map((coord, index) => ({
                version: `point-${index + 1}`,
                x: coord.longitude,
                y: coord.latitude,
                id: index,
                value: coord.losses,
              }))}
              series={[
                {
                  data: coordinates
                    .filter((v) => v.losses > 10)
                    .map((v) => ({ x: v.latitude, y: v.longitude, id: v.losses, value: v.losses })),
                },
                {
                  data: coordinates
                    .filter((v) => v.losses < 10)
                    .map((v) => ({ x: v.latitude, y: v.longitude, id: v.losses, value: v.losses })),
                },
              ]}
              colors={["#ff0000", "#00ff00"]}
              width={350}
              height={250}
            />
            <p style={{ textAlign: "center" }}>Сопоставление координат с потерями</p>
          </div>
        )}
      </Stack>
    </div>
  );
}
