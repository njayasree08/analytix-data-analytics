import { useState } from "react";

import {
  Activity,
  BarChart3,
  Bell,
  Broom,
  Database,
  FileSpreadsheet,
  FileText,
  History,
  LayoutDashboard,
  Lightbulb,
  Search,
  Settings,
  ShieldCheck,
  Upload,
} from "lucide-react";

import "./styles/global.css";
import "./styles/common-header.css";

import FileUpload from "./components/upload/FileUpload";

import DashboardOverview from "./components/overview/DashboardOverview";

import DataPreviewPage from "./pages/DataPreviewPage";

import DataQualityPage from "./pages/DataQualityPage";

import StatisticsPage from "./pages/StatisticsPage";

import FeatureAnalysisPage from "./pages/FeatureAnalysisPage";

import VisualizationPage from "./pages/VisualizationPage";

import InsightsPage from "./pages/InsightsPage";

import CleaningPage from "./pages/CleaningPage";

import ReportsPage from "./pages/ReportsPage";

import HistoryPage from "./pages/HistoryPage";

import { useDataset } from "./context/DatasetContext";

/* =========================================================
   NAVIGATION
========================================================= */

const navigationGroups = [
  {
    title: "OVERVIEW",
    items: [
      {
        name: "Dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Upload Dataset",
        icon: Upload,
      },
      {
        name: "Data Preview",
        icon: Database,
      },
    ],
  },

  {
    title: "ANALYSIS",
    items: [
      {
        name: "Data Quality",
        icon: ShieldCheck,
      },
      {
        name: "Statistics",
        icon: BarChart3,
      },
      {
        name: "Feature Analysis",
        icon: BarChart3,
      },
    ],
  },

  {
    title: "VISUAL ANALYTICS",
    items: [
      {
        name: "Visualizations",
        icon: BarChart3,
      },
      {
        name: "Insights",
        icon: Lightbulb,
      },
    ],
  },

  {
    title: "DATA OPERATIONS",
    items: [
      {
        name: "Data Cleaning",
        icon: Broom,
      },
      {
        name: "Reports",
        icon: FileText,
      },
      {
        name: "History",
        icon: History,
      },
    ],
  },
];

/* =========================================================
   APP
========================================================= */

export default function App() {
  const [activePage, setActivePage] =
    useState("Dashboard");

  const {
    dataset,
    setUploadedDataset,
  } = useDataset();

  function handleNavigation(page) {
    setActivePage(page);
  }

  function renderPage() {
    switch (activePage) {
      case "Dashboard":
        return <DashboardOverview />;

      case "Upload Dataset":
        return (
          <UploadPage
            onFileLoaded={setUploadedDataset}
            dataset={dataset}
          />
        );

      case "Data Preview":
        return <DataPreviewPage />;

      case "Data Quality":
        return <DataQualityPage />;

      case "Statistics":
        return <StatisticsPage />;

      case "Feature Analysis":
        return <FeatureAnalysisPage />;

      case "Visualizations":
        return <VisualizationPage />;

      case "Insights":
        return <InsightsPage />;

      case "Data Cleaning":
        return <CleaningPage />;

      case "Reports":
        return <ReportsPage />;

      case "History":
        return <HistoryPage />;

      default:
        return <DashboardOverview />;
    }
  }

  return (
    <div className="app">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-icon">
            <Activity size={24} />
          </div>

          <div className="brand-text">
            <h2>DataSphere</h2>

            <span>
              INTELLIGENT ANALYTICS
            </span>
          </div>

        </div>

        <div className="sidebar-navigation">

          {navigationGroups.map(
            (group) => (
              <div
                className="navigation-group"
                key={group.title}
              >

                <p className="nav-label">
                  {group.title}
                </p>

                <nav>

                  {group.items.map(
                    ({
                      name,
                      icon: Icon,
                    }) => (
                      <button
                        key={name}
                        type="button"
                        className={`nav-item ${
                          activePage === name
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          handleNavigation(name)
                        }
                      >

                        <Icon
                          size={18}
                          strokeWidth={1.8}
                        />

                        <span>
                          {name}
                        </span>

                      </button>
                    )
                  )}

                </nav>

              </div>
            )
          )}

        </div>

        <div className="sidebar-bottom">

          <button
            type="button"
            className="settings-button"
          >

            <Settings size={18} />

            <span>
              Settings
            </span>

          </button>

        </div>

      </aside>

      {/* =====================================================
          MAIN AREA
      ====================================================== */}

      <main className="main">

        {/* ===================================================
            TOP BAR
        ==================================================== */}

        <header className="topbar">

          <div className="topbar-left">

            <span className="breadcrumb">
              Analytics
            </span>

            <span className="breadcrumb-separator">
              /
            </span>

            <strong>
              {activePage}
            </strong>

          </div>

          <div className="top-actions">

            {dataset && (
              <div className="dataset-status">

                <span className="dataset-status-dot" />

                <span>
                  {dataset.fileName}
                </span>

              </div>
            )}

            <button
              type="button"
              className="icon-button"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            <button
              type="button"
              className="icon-button"
              aria-label="Notifications"
            >
              <Bell size={18} />
            </button>

            <div className="avatar">
              JD
            </div>

          </div>

        </header>

        {/* ===================================================
            PAGE CONTENT
        ==================================================== */}

        <section className="content">

          {/* =================================================
              COMMON PAGE HEADER
          ================================================= */}

          <div className="page-header">

            <div className="page-header-content">

              <p className="eyebrow">
                YOUR ANALYTICS WORKSPACE
              </p>

              <h1>
                {getPageTitle(activePage)}
              </h1>

              <p className="subtitle">
                {getPageDescription(activePage)}
              </p>

            </div>

            <div className="page-header-actions">

              {dataset && (
                <div className="header-dataset">

                  <span className="status-dot-online" />

                  <div>
                    <strong>
                      Dataset Loaded
                    </strong>

                    <span>
                      {dataset.rowCount?.toLocaleString() || 0}{" "}
                      rows ·{" "}
                      {dataset.columnCount || 0} columns
                    </span>
                  </div>

                </div>
              )}

              <button
                type="button"
                className="primary-button"
                onClick={() =>
                  setActivePage("Upload Dataset")
                }
              >

                <Upload size={16} />

                Upload dataset

              </button>

            </div>

          </div>

          {/* =================================================
              CURRENT PAGE
          ================================================= */}

          {renderPage()}

        </section>

      </main>

    </div>
  );
}

/* =========================================================
   UPLOAD PAGE
========================================================= */

function UploadPage({
  onFileLoaded,
  dataset,
}) {
  return (
    <>

      {/* ===================================================
          DATA UPLOAD
      ==================================================== */}

      <section className="panel upload-panel">

        <div className="panel-heading">

          <div>

            <div className="section-kicker">
              DATA INGESTION
            </div>

            <h2>
              Upload your dataset
            </h2>

            <p>
              Import CSV or Excel files
              and automatically analyze
              your data.
            </p>

          </div>

          <span
            className={`status-badge ${
              dataset
                ? "status-success"
                : ""
            }`}
          >
            {dataset
              ? "Dataset Loaded"
              : "Ready"}
          </span>

        </div>

        <FileUpload
          onFileLoaded={onFileLoaded}
        />

      </section>

      {/* ===================================================
          ACTIVE DATASET
      ==================================================== */}

      {dataset && (

        <section className="panel dataset-active-panel">

          <div className="dataset-active-heading">

            <div>

              <div className="section-kicker">
                ACTIVE DATASET
              </div>

              <h2>
                Current dataset
              </h2>

              <p>
                This dataset is available
                across all analytics modules
                and ready for analysis.
              </p>

            </div>

            <div className="dataset-heading-icon">
              <FileSpreadsheet size={20} />
            </div>

          </div>

          <div className="dataset-loaded-card">

            <div className="dataset-file-icon">
              <FileSpreadsheet size={24} />
            </div>

            <div className="dataset-file-info">

              <strong>
                {dataset.fileName}
              </strong>

              <span>

                {dataset.fileType || "Dataset"}

                {" · "}

                {dataset.rowCount?.toLocaleString() || 0}

                {" rows · "}

                {dataset.columnCount || 0}

                {" columns"}

              </span>

            </div>

            <div className="dataset-loaded-status">

              <span className="status-dot-online" />

              <span>
                Analysis ready
              </span>

            </div>

          </div>

        </section>

      )}

    </>
  );
}

/* =========================================================
   PAGE TITLES
========================================================= */

function getPageTitle(page) {

  const titles = {

    Dashboard:
      "Analytics Dashboard",

    "Upload Dataset":
      "Upload Dataset",

    "Data Preview":
      "Data Preview",

    "Data Quality":
      "Data Quality Analysis",

    Statistics:
      "Statistical Analysis",

    "Feature Analysis":
      "Feature Analysis",

    Visualizations:
      "Visual Analytics",

    Insights:
      "Intelligent Insights",

    "Data Cleaning":
      "Data Cleaning",

    Reports:
      "Analytics Reports",

    History:
      "Analysis History",

  };

  return titles[page] || page;
}

/* =========================================================
   PAGE DESCRIPTIONS
========================================================= */

function getPageDescription(page) {

  const descriptions = {

    Dashboard:
      "Understand your dataset through key metrics, quality indicators, visual analytics, and automated findings.",

    "Upload Dataset":
      "Import your CSV or Excel dataset for automatic profiling and analysis.",

    "Data Preview":
      "Explore the rows, columns, values, and structure of your uploaded dataset.",

    "Data Quality":
      "Identify missing values, duplicates, completeness issues, and potential data-quality problems.",

    Statistics:
      "Explore descriptive statistics, distributions, variability, and numerical characteristics of your data.",

    "Feature Analysis":
      "Understand the statistical relevance and characteristics of the features in your dataset.",

    Visualizations:
      "Explore automatically generated charts and visual relationships discovered in your dataset.",

    Insights:
      "Discover data-backed observations generated from statistical and analytical patterns.",

    "Data Cleaning":
      "Prepare your dataset by handling missing values, duplicates, whitespace, and outliers.",

    Reports:
      "Export your dataset and generate a complete analytics report.",

    History:
      "View and restore previously analyzed datasets and analysis sessions.",

  };

  return (
    descriptions[page] ||
    "Turn your datasets into meaningful insights."
  );
}