# 📊 Analytix — Intelligent Data Analytics Platform

> **INTELLIGENT DATA INTELLIGENCE**

Analytix is a modern, browser-based data analytics platform that allows users to upload datasets and automatically explore, analyze, visualize, and understand their data through an interactive dashboard.

The platform is designed to make data analysis easier by providing automated data quality checks, statistical analysis, visualizations, insights, anomaly detection, feature analysis, and reporting — without requiring a backend server.

## 🚀 Live Demo

🌐 **Live Application:**  
https://analytix-data-analytics4.onrender.com/

## 📌 Project Overview

Analytix is a frontend-focused data analytics platform built using React and Vite.

Users can upload **CSV, XLS, and XLSX** datasets directly from their browser. The application processes the uploaded data on the client side and generates useful analytical results and visualizations.

### Key capabilities

- 📂 Upload CSV, XLS, and XLSX datasets
- 👀 Preview uploaded data
- 🔍 Analyze data quality
- 📊 Generate descriptive statistics
- 📈 Create interactive visualizations
- 🔗 Analyze correlations between numerical features
- ⭐ Perform feature analysis
- 🚨 Detect potential anomalies
- 💡 Generate automated data insights
- 🧹 Perform optional data cleaning
- 📑 Generate analytical reports
- 🕒 Maintain dataset history using browser storage
- 🌙 Light and dark theme support
- 📱 Responsive professional dashboard

## ✨ Features

### 📂 Dataset Upload

Upload datasets in:

- CSV
- XLS
- XLSX

The platform automatically detects the uploaded file type and processes the dataset in the browser.

### 🔍 Data Quality Analysis

Automatically analyzes datasets for common data-quality issues such as:

- Missing values
- Duplicate records
- Data types
- Empty fields
- Dataset structure

### 📊 Statistical Analysis

Provides descriptive statistics for numerical data, including:

- Count
- Mean
- Minimum
- Maximum
- Median
- Standard deviation
- Distribution-related information

### 📈 Data Visualization

Analytix provides interactive charts to help users understand their datasets visually.

Supported visualization concepts include:

- Bar charts
- Line charts
- Pie charts
- Area charts
- Scatter plots
- KPI cards
- Correlation visualizations

### 🔗 Feature Analysis

Analyze relationships between dataset features and identify important patterns within the data.

### 🚨 Anomaly Detection

The platform identifies unusual values and potential anomalies within numerical datasets.

### 💡 Automated Insights

Analytix generates analytical observations based on the uploaded dataset, helping users quickly understand important patterns and trends.

### 🧹 Data Cleaning

Provides optional data-cleaning functionality to help prepare datasets for analysis.

### 📑 Reports

Users can generate analytical reports containing important information from their dataset and analysis.

### 🕒 Dataset History

Previously analyzed datasets can be stored locally using **IndexedDB**, allowing users to access their analysis history directly from the browser.

## 🛠️ Tech Stack

### Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- Vite

### Data Processing

- Papa Parse
- SheetJS / XLSX

### Data Visualization

- Recharts

### UI & Icons

- Lucide React

### Additional Libraries

- React Router
- date-fns
- jsPDF
- jsPDF AutoTable
- File Saver

### Storage

- IndexedDB

### Deployment

- Render

## 📁 Project Structure

```text
data-analytics-dashboard/
│
├── public/
│
├── src/
│   ├── analysis/
│   │   ├── anomalyDetection.js
│   │   ├── correlation.js
│   │   ├── featureImportance.js
│   │   ├── insights.js
│   │   ├── statistics.js
│   │   └── trends.js
│   │
│   ├── components/
│   │   ├── charts/
│   │   ├── common/
│   │   ├── layout/
│   │   └── upload/
│   │
│   ├── context/
│   │   ├── DatasetContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── UploadDataset.jsx
│   │   ├── DataPreview.jsx
│   │   ├── DataQuality.jsx
│   │   ├── Statistics.jsx
│   │   ├── FeatureAnalysis.jsx
│   │   ├── Visualizations.jsx
│   │   ├── Insights.jsx
│   │   ├── DataCleaning.jsx
│   │   ├── Reports.jsx
│   │   └── History.jsx
│   │
│   ├── services/
│   │   ├── csvParser.js
│   │   ├── excelParser.js
│   │   ├── fileParser.js
│   │   └── storageService.js
│   │
│   ├── styles/
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
