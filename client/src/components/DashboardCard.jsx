import "./DashboardCard.css";

function DashboardCard({ title, value, icon, iconBg, iconColor, trendText, isPositive }) {
  return (
    <div className="dashboard-card">
      <div className="kpi-header">
        <div className="icon-wrapper" style={{ backgroundColor: iconBg, color: iconColor }}>
          {icon}
        </div>
        <div className="kpi-info">
          <h3>{title}</h3>
          <h2>{value}</h2>
        </div>
      </div>
      <div className="kpi-footer">
        <span className={isPositive ? "trend-up" : "trend-down"}>
          {trendText}
        </span>
      </div>
    </div>
  );
}

export default DashboardCard;