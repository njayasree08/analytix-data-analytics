import {
  Activity,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart,
  ScatterChart,
  TrendingUp,
} from "lucide-react";

export default function ChartRecommendations({
  recommendations = [],
  selectedIndex = 0,
  onSelect,
}) {
  if (!recommendations.length) {
    return (
      <div className="visual-no-charts">
        <BarChart3 size={25} />

        <strong>
          No chart recommendations
        </strong>

        <span>
          Upload a dataset containing
          suitable numeric, categorical, or
          date columns.
        </span>
      </div>
    );
  }

  return (
    <div className="visual-recommendation-grid">
      {recommendations.map(
        (item, index) => {
          const active =
            selectedIndex === index;

          return (
            <button
              type="button"
              key={`${item.title}-${index}`}
              className={`visual-recommendation-card ${
                active
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                onSelect(index)
              }
            >
              <div
                className={`visual-recommendation-icon ${getColor(
                  item.type
                )}`}
              >
                {getIcon(item.type)}
              </div>

              <div className="visual-recommendation-content">
                <strong>
                  {item.title}
                </strong>

                <span>
                  {item.description}
                </span>
              </div>

              <span className="visual-recommendation-arrow">
                →
              </span>
            </button>
          );
        }
      )}
    </div>
  );
}

function getIcon(type) {
  switch (type) {
    case "line":
      return <LineChartIcon size={17} />;

    case "scatter":
      return <ScatterChart size={17} />;

    case "histogram":
      return <Activity size={17} />;

    case "distribution":
      return <PieChart size={17} />;

    case "area":
      return <TrendingUp size={17} />;

    default:
      return <BarChart3 size={17} />;
  }
}

function getColor(type) {
  switch (type) {
    case "line":
      return "blue";

    case "scatter":
      return "orange";

    case "histogram":
      return "cyan";

    case "distribution":
      return "pink";

    case "area":
      return "green";

    default:
      return "purple";
  }
}