"""
Learnova Recommendation Engine - Phase 4
Rule-based personalized learning path generator.
Generates educationally sound, career-aligned roadmaps based on:
- Learning Interest
- Current Skill Level
- Career Goal
- Daily Learning Time
- Learning Duration
"""

from typing import Dict, Any, List

try:
    from resource_catalog import get_resources_for_week, get_reference_for_topic
except ImportError:
    from backend.resource_catalog import get_resources_for_week, get_reference_for_topic

# Duration to exact week count mapping
DURATION_WEEKS_MAP = {
    "2 weeks": 2,
    "1 month": 4,
    "3 months": 12,
    "6 months": 24,
}

# Daily time metrics: study hours and realistic content volume
DAILY_TIME_METRICS = {
    "30 minutes": {
        "weekly_hours": 3.5,
        "max_topics": 2,
        "max_activities": 1,
        "pacing_advice": "At 30 minutes/day (~3.5 hrs/week), focus on high-yield core concepts and 1 practical exercise per week to maintain steady progress without burnout."
    },
    "1 hour": {
        "weekly_hours": 7.0,
        "max_topics": 3,
        "max_activities": 2,
        "pacing_advice": "At 1 hour/day (~7 hrs/week), complete 1 focused topic every 2 days and dedicate weekends to completing the suggested practice activities."
    },
    "2 hours": {
        "weekly_hours": 14.0,
        "max_topics": 4,
        "max_activities": 3,
        "pacing_advice": "At 2 hours/day (~14 hrs/week), balance concept deep-dives with hands-on coding labs and daily project experiments."
    },
    "3+ hours": {
        "weekly_hours": 21.0,
        "max_topics": 5,
        "max_activities": 3,
        "pacing_advice": "At 3+ hours/day (~21+ hrs/week), follow an intensive immersion pace: build comprehensive mini-modules, write automated tests, and explore documentation."
    }
}


def build_curriculum_pool(interest: str, skill_level: str, career_goal: str) -> List[Dict[str, Any]]:
    """
    Builds a tailored 24-week progressive curriculum matching BOTH interest and career_goal at the given skill_level.
    Strictly aligns topics:
    - Data Analyst: Python, SQL, Excel, statistics, data visualization, Power BI
    - Software Developer: Programming, DSA, OOP, databases, software projects
    - AI/ML Engineer: Python, mathematics, machine learning, deep learning, deployment
    - Full Stack Developer: HTML, CSS, JavaScript, frontend, backend, databases
    Avoids inappropriate hyper-specialized topics (e.g. YOLO/ViT/Transformers) for analytics or beginner paths.
    """
    
    # -------------------------------------------------------------------------
    # 1. Career Goal: Data Analyst
    # Focus: Excel, SQL, Python, Statistics, Data Visualization, Power BI
    # -------------------------------------------------------------------------
    if career_goal == "Data Analyst" or (interest == "Data Analytics" and career_goal not in ["Software Developer", "Full Stack Developer", "AI/ML Engineer"]):
        if skill_level == "Beginner":
            return [
                {"theme": "Business Spreadsheet Modeling & Excel Fundamentals", "topics": ["Excel Data Organization & Cell Formatting", "Statistical Formulas (SUM, AVERAGE, COUNTIF)", "Data Hygiene, Deduplication & Quality Checks", "VLOOKUP & XLOOKUP Lookups for Cross-Referencing", "Summary Pivot Tables & Business KPI Reporting"], "activities": ["Clean a messy sales transaction spreadsheet", "Calculate core business metrics using Excel formulas", "Build an automated summary pivot table by department"]},
                {"theme": "SQL Fundamentals & Relational Data Extraction", "topics": ["Relational Database Concepts & Tables", "SQL SELECT, WHERE, ORDER BY & LIMIT", "Filtering with LIKE, IN, BETWEEN & NULL", "Aggregate Functions (SUM, COUNT, AVG, MIN, MAX)", "GROUP BY & HAVING Clauses"], "activities": ["Query relational tables to answer core business questions", "Extract high-value customer cohorts using SQL filters", "Aggregate monthly store performance metrics in SQL"]},
                {"theme": "Relational Data Joins & Multi-Table Queries", "topics": ["Primary & Foreign Key Relationships", "INNER JOIN & LEFT JOIN Mechanics", "Joining Multiple Relational Tables", "Handling Duplicate Records & Null Joins", "Exporting SQL Datasets for Reporting"], "activities": ["Join orders, customers, and product catalog tables", "Identify inactive users using SQL LEFT JOIN", "Export multi-table query datasets for reporting"]},
                {"theme": "Business Data Visualization & Power BI Fundamentals", "topics": ["Data Visualization Best Practices", "Building Interactive Reports in Power BI", "Connecting Power BI to SQL & Excel Sources", "Bar, Line, and Donut Charts for Business KPIs", "Designing Interactive Filter Slicers"], "activities": ["Build an interactive Power BI sales dashboard", "Create bar and line visuals tracking monthly revenue", "Configure multi-level drill-downs for product categories"]},
                {"theme": "Python for Data Analysis & Analytics Environment", "topics": ["Python Setup, Jupyter Notebooks & Virtual Environments", "Data Types, Variables & Basic Operations", "Lists, Dictionaries & Data Extraction", "Writing Modular Analysis Functions", "Importing CSVs into Python"], "activities": ["Write a script calculating sales metrics from raw data", "Filter and summarize list records in a Jupyter Notebook", "Automate basic metric calculation functions"]},
                {"theme": "Data Wrangling & Transformations with Pandas", "topics": ["Pandas Series & DataFrame Ingestion", "Reading CSV, Excel & JSON Files", "Filtering, Sorting & Column Selection", "Handling Missing Data & Imputation", "Data Type Conversions & Renaming"], "activities": ["Clean and format a dirty customer transaction CSV", "Filter customer cohorts by date and revenue thresholds", "Impute missing values using median and forward-fill methods"]},
                {"theme": "Business Statistics & Hypothesis Testing", "topics": ["Descriptive vs Inferential Statistics", "Probability Distributions & The Normal Curve", "Central Limit Theorem & Sampling Error", "Confidence Intervals for Business Metrics", "Formulating Data-Driven Hypotheses"], "activities": ["Compute 95% confidence intervals for conversion rates", "Assess whether sales changes represent statistical significance", "Document statistical findings in an executive summary"]},
                {"theme": "Advanced SQL Analytical Windows", "topics": ["SQL Window Functions (ROW_NUMBER, RANK)", "Running Totals & Moving Averages with OVER()", "LEAD() & LAG() for Growth Rates", "Partitioning Windows by Category", "Common Table Expressions (CTEs)"], "activities": ["Calculate 7-day rolling revenue averages in SQL", "Compute month-over-month growth using LAG()", "Rank top performing salespeople per region using window functions"]},
                {"theme": "Interactive Dashboarding with Streamlit & Plotly", "topics": ["Dashboard Architecture & Visual Hierarchy", "Prototyping Interactive Apps with Streamlit", "Adding Filters, Dropdowns & Date Sliders", "Displaying Dynamic Charts & Predictive Outputs", "Hosting and Sharing Dashboards"], "activities": ["Build an interactive Streamlit sales and retention dashboard", "Connect user-selectable filters to dynamic Pandas queries", "Deploy dashboard prototype for stakeholder feedback"]},
                {"theme": "Cohort Retention & Funnel Analysis", "topics": ["Building Cohort Retention Matrices", "Calculating Retention Rates Over Time", "Conversion Funnel Drop-off Analysis", "Identifying Churn Bottlenecks in User Journey", "Visualizing Cohort Heatmaps in Python"], "activities": ["Construct a monthly cohort retention matrix in Pandas", "Map user drop-off across a multi-step checkout funnel", "Plot a retention heatmap highlighting seasonal retention drops"]},
                {"theme": "Applied Predictive Modeling for Analytics", "topics": ["Supervised Learning Concepts for Analysts", "Simple & Multiple Linear Regression", "Interpreting Regression Coefficients in Business Context", "R-Squared & Mean Absolute Error (MAE)", "Train/Test Split for Validating Predictions"], "activities": ["Fit a linear regression model to predict sales from marketing spend", "Interpret regression coefficients to identify key revenue drivers", "Evaluate prediction accuracy using MAE and RMSE"]},
                {"theme": "Analytics Reporting & Capstone Synthesis", "topics": ["Synthesizing Insights into KPI Dashboards", "Data Storytelling for Business Stakeholders", "Connecting Predictive Metrics to Revenue ROI", "Validating Analysis Integrity & Sanity Checks", "Publishing Portfolio Reports on GitHub"], "activities": ["Build an integrated analytics report combining SQL, Excel & Dashboards", "Design executive presentation slides summarizing findings", "Publish well-documented Jupyter notebook to GitHub repository"]},
                {"theme": "A/B Testing & Commercial Experimentation", "topics": ["A/B Testing Framework & Experiment Design", "Two-Sample T-Tests & Chi-Square Tests", "Calculating Sample Size & Statistical Power", "Interpreting P-Values & Avoiding Pitfalls", "Writing Experiment Recommendation Memos"], "activities": ["Analyze conversion results from a live A/B test", "Determine statistical significance of checkout page redesign", "Write an experiment debrief memo with clear rollout guidance"]},
                {"theme": "Feature Engineering for Business Tabular Data", "topics": ["Creating Recency, Frequency & Monetary (RFM) Features", "One-Hot & Target Encoding for Categorical Data", "Handling Imbalanced Target Classes in Analytics", "Feature Correlation & Multicollinearity", "Building Reusable Pandas Transformation Pipelines"], "activities": ["Engineer RFM behavioral features from raw transaction logs", "Encode categorical variables for predictive modeling", "Document feature transformation pipeline for automated reuse"]},
                {"theme": "Classification for Analytics: Customer Churn", "topics": ["Binary Classification Concepts", "Logistic Regression for Churn Prediction", "Confusion Matrix, Precision & Recall", "Balancing False Positives vs False Negatives", "Probability Outputs & Decision Thresholds"], "activities": ["Build a customer churn prediction model on account data", "Calculate precision and recall for customer retention outreach", "Set optimal probability thresholds to target high-risk accounts"]},
                {"theme": "Customer Segmentation with Clustering", "topics": ["Unsupervised Learning Concepts for Business", "K-Means Clustering Fundamentals", "Feature Scaling with StandardScaler", "Determining Optimal Clusters (Elbow Method)", "Profiling Customer Segments for Marketing"], "activities": ["Standardize customer recency and spend features", "Segment customer base into distinct behavioral clusters", "Draft persona profiles for each customer cluster"]},
                {"theme": "Time Series Forecasting for Business Demand", "topics": ["Time Series Components (Trend, Seasonality, Noise)", "Moving Averages & Exponential Smoothing", "Introduction to Facebook Prophet for Demand Forecasting", "Evaluating Forecast Accuracy (MAPE, RMSE)", "Scenario Modeling & Upper/Lower Prediction Bands"], "activities": ["Decompose quarterly sales history into seasonal cycles", "Fit a Prophet model to forecast 90-day product demand", "Present best-case and conservative demand scenarios to stakeholders"]},
                {"theme": "Data Quality Assurance & Pipeline Automation", "topics": ["Automating Data Cleaning with Reusable Scripts", "Data Quality Assertion Testing (Nulls, Ranges, Types)", "Logging Pipeline Execution & Handling Edge Cases", "Scheduling Automated Data Ingestion Jobs", "Maintaining Reproducible Analytics Environments"], "activities": ["Write automated validation checks verifying input data integrity", "Build an automated script that refreshes weekly report datasets", "Implement email/log alerts when data quality anomalies are detected"]},
                {"theme": "Financial & Operational Metric Modeling", "topics": ["Customer Lifetime Value (LTV) Calculation Methods", "Customer Acquisition Cost (CAC) & Payback Periods", "Net Revenue Retention (NRR) & Churn Economics", "Unit Economics & Profit Margin Modeling", "Building Interactive Scenario Calculators"], "activities": ["Calculate customer payback periods across marketing channels", "Build an LTV scenario calculator comparing retention cohorts", "Model the revenue impact of reducing churn by 2%"]},
                {"theme": "Executive Data Storytelling & Presentation", "topics": ["Translating Analytics into Business Action", "Structuring Executive Slide Decks (Problem-Insight-Action)", "Designing Effective Charts for C-Suite Audiences", "Anticipating Stakeholder Objections & Edge Cases", "Delivering High-Impact Verbal Data Presentations"], "activities": ["Draft a 5-slide executive presentation explaining analytics insights", "Translate complex model outputs into clear business takeaways", "Deliver a simulated stakeholder presentation with Q&A"]},
                {"theme": "Analytics Portfolio Curation & Code Polish", "topics": ["Curating a High-Impact Data Analyst GitHub Portfolio", "Writing Clear Project READMEs with Business Context", "Documenting SQL Queries with Inline Comments", "Formatting Jupyter Notebooks with Markdown Explanations", "Preparing Case Studies for Data Analyst Interviews"], "activities": ["Polish capstone repository with clear setup and findings", "Draft a portfolio case study highlighting business ROI", "Review and format all SQL scripts according to professional style guides"]},
                {"theme": "Live SQL Querying & Case Study Interviews", "topics": ["Data Analyst Technical Interview Preparation", "Live SQL Querying Practice & Whiteboarding", "Answering Business Scenario & Metrics Questions", "Resume & LinkedIn Alignment for Data Analyst Roles", "Navigating the Analytics Job Search & Applications"], "activities": ["Practice 10 live SQL interview queries on sample databases", "Conduct a mock interview answering product/business metrics scenarios", "Finalize resume and portfolio links for job applications"]},
                {"theme": "Power BI Advanced DAX & Enterprise Modeling", "topics": ["DAX Formulas (CALCULATE, FILTER, RELATED)", "Star Schema vs Snowflake Data Modeling", "Row-Level Security in Power BI", "Performance Analyzer & Query Reduction", "Power BI Service Publishing & Automated Refresh"], "activities": ["Build complex DAX measures for year-over-year revenue growth", "Model star-schema relationships between facts and dimensions", "Configure scheduled dataset refresh in Power BI Service"]},
                {"theme": "Career Readiness & Portfolio Launch", "topics": ["Finalizing Capstone Deliverables", "Portfolio Review & External Feedback", "Targeted Application Strategy for Analyst Roles", "Negotiation & Offer Evaluation Basics", "Continuous Learning in Data Analytics"], "activities": ["Submit portfolio to community reviews", "Send 5 tailored applications for entry-level Data Analyst positions", "Prepare self-introduction and project walkthrough pitch"]}
            ]
        else: # Intermediate / Advanced Data Analyst
            return [
                {"theme": "Advanced SQL & Analytical Windows", "topics": ["SQL Window Functions (ROW_NUMBER, DENSE_RANK)", "Running Totals & Moving Averages with OVER()", "LEAD() & LAG() for Growth Analysis", "Recursive Common Table Expressions (CTEs)", "Query Plan Inspection & Index Optimization"], "activities": ["Write complex multi-tier CTE queries for revenue analysis", "Calculate 30-day rolling retention metrics in SQL", "Optimize query performance using indexes and execution plans"]},
                {"theme": "Memory-Optimized Pandas & Data Processing", "topics": ["Vectorized Operations vs Apply Performance", "Memory Optimization & Categorical Dtypes", "Chunked Reading of Large Datasets", "Complex Multi-Index DataFrames", "Data Quality Frameworks"], "activities": ["Optimize memory usage of a large dataset by 50%", "Process multi-gigabyte logs using chunked ingestion", "Implement automated data sanity assertions"]},
                {"theme": "Cohort Retention & Behavioral Funnels", "topics": ["Cohort Retention Matrices & Heatmaps", "Customer Churn Segmentation", "RFM (Recency, Frequency, Monetary) Modeling", "Multi-Step Funnel Drop-Off Analysis", "Customer Lifetime Value Foundations"], "activities": ["Build an automated cohort retention pipeline in Python", "Segment customer database into RFM behavioral tiers", "Map checkout conversion barriers and drop-offs"]},
                {"theme": "Statistical Inference & Controlled Experiments", "topics": ["A/B Testing Framework & Power Analysis", "Two-Sample T-Tests, ANOVA & Chi-Square Tests", "Sample Size Calculation & Variance Reduction", "Interpreting Statistical Significance & P-Values", "Handling Multiple Hypothesis Testing"], "activities": ["Execute an A/B test analysis on e-commerce transaction data", "Calculate sample size needed to detect 2% conversion lift", "Author an experiment results debrief with clear recommendations"]},
                {"theme": "Applied Predictive Analytics: Regression", "topics": ["Multiple Linear Regression & ElasticNet", "Feature Scaling & Handling Multicollinearity", "Interpreting Standardized Coefficients", "Model Validation with K-Fold Cross-Validation", "Residual Diagnostics & Error Distribution"], "activities": ["Build a multi-factor sales prediction model", "Diagnose multicollinearity using Variance Inflation Factors (VIF)", "Evaluate model stability across cross-validation folds"]},
                {"theme": "Predictive Classification for Customer Churn", "topics": ["Logistic Regression & Decision Thresholds", "Class Imbalance Techniques (SMOTE, Weights)", "ROC-AUC, Precision-Recall Curves & F1-Score", "Cost-Sensitive Classification for Business", "Calibrated Probability Predictions"], "activities": ["Train an interpretable churn prediction model", "Optimize decision thresholds based on customer acquisition cost", "Generate precision-recall trade-off curves for marketing teams"]},
                {"theme": "Tree-Based Models & Feature Attribution", "topics": ["Random Forest & Gradient Boosting (LightGBM/XGBoost)", "Hyperparameter Tuning with Optuna/GridSearch", "Global Feature Importance vs Local Attribution", "SHAP (Shapley Additive Explanations) for Tabular Data", "Translating SHAP Waterfall Plots for Business"], "activities": ["Train a LightGBM model on tabular customer data", "Generate SHAP attribution plots explaining model predictions", "Create an executive summary interpreting top business drivers"]},
                {"theme": "Unsupervised Customer Clustering & Market Basket", "topics": ["K-Means, DBSCAN & Hierarchical Clustering", "Feature Selection & Scaling for Clustering", "Cluster Profiling & Persona Generation", "Market Basket Analysis with Apriori Algorithm", "Association Rules (Support, Confidence, Lift)"], "activities": ["Segment customer database into 4 actionable personas", "Identify frequently co-purchased items using association rules", "Present cross-selling recommendations to marketing leadership"]},
                {"theme": "Time Series Forecasting for Business Planning", "topics": ["Time Series Decomposition (Trend, Seasonality, Noise)", "Autoregressive Models (ARIMA & SARIMA)", "Prophet for Business Forecasting with Regressors", "Evaluating Forecast Accuracy (MAPE, MAE)", "Scenario Planning with Confidence Bands"], "activities": ["Decompose 3-year historical sales into seasonal cycles", "Forecast 180-day revenue using Facebook Prophet", "Incorporate promotional calendar as external regressors"]},
                {"theme": "Interactive Dashboard Development with Streamlit", "topics": ["Streamlit Architecture & State Management", "Interactive Filters, Date Pickers & KPI Cards", "Embedding Dynamic Plotly Visualizations", "Connecting Dashboards to SQL Databases", "Deploying Analytics Dashboards to Cloud"], "activities": ["Build an interactive executive sales & churn dashboard in Streamlit", "Integrate live database querying with caching", "Deploy dashboard application for stakeholder review"]},
                {"theme": "Analytics Engineering with dbt & Data Warehousing", "topics": ["Modern Data Stack Overview (Warehouse + dbt)", "Dimensional Modeling (Fact & Dimension Tables)", "Writing Modular Transformations in dbt", "Data Testing & Documentation in dbt", "Materialization Strategies (Views vs Tables)"], "activities": ["Build dimensional data models transforming raw events into marts", "Configure uniqueness and non-null tests in dbt", "Generate data lineage graph for stakeholders"]},
                {"theme": "Capstone Analytics Delivery & Technical Portfolio", "topics": ["Structuring an End-to-End Analytics Case Study", "Synthesizing SQL, Predictive Modeling & Visuals", "Authoring an Executive Decision Memo", "Curating GitHub Code Portfolio for Senior Roles", "Technical Interview & Case Study Presentation Preparation"], "activities": ["Assemble a comprehensive enterprise analytics portfolio project", "Draft an executive briefing highlighting revenue ROI", "Practice live SQL and analytics case study interview questions"]},
                {"theme": "Causal Inference & Quasi-Experimentation", "topics": ["Correlation vs Causation in Business", "Difference-in-Differences (DiD) Estimation", "Propensity Score Matching (PSM) for Observational Data", "Evaluating Policy & Feature Launch Impacts", "Documenting Causal Findings"], "activities": ["Estimate revenue impact of a new feature using DiD", "Match treatment and control cohorts using propensity scores", "Author a causal inference briefing for leadership"]},
                {"theme": "Customer Lifetime Value (LTV) Modeling", "topics": ["Contractual vs Non-Contractual LTV", "Probabilistic Models (BG/NBD & Gamma-Gamma)", "Predicting Repeat Transaction Frequency", "Expected Monetary Value per Customer", "Allocating Marketing Budget by Predicted LTV"], "activities": ["Fit a BG/NBD model on retail transaction history", "Forecast 1-year expected spend for active customers", "Recommend marketing budget allocation based on LTV tiers"]},
                {"theme": "Automated Anomaly Detection in Business Metrics", "topics": ["Anomaly Detection Principles in Time Series", "Statistical Outlier Detection (Z-Score, IQR, Isolation Forest)", "Distinguishing Signal from Random Fluctuations", "Building Alerting Triggers for KPI Drops", "Root Cause Analysis Workflows"], "activities": ["Build an automated anomaly detector for daily revenue drops", "Configure automated alert logging for abnormal conversion rates", "Conduct root cause drill-down on simulated data anomalies"]},
                {"theme": "Advanced Data Storytelling & Executive Framing", "topics": ["Framing Analytical Insights for C-Suite Leaders", "Designing Minimalist, High-Impact Dashboards", "Overcoming Cognitive Bias in Data Interpretation", "Handling Conflicting Metrics in Business Reports", "Creating Executive Strategy Presentations"], "activities": ["Redesign a cluttered dashboard into a high-impact executive view", "Synthesize multiple conflicting metrics into a coherent narrative", "Present strategic recommendations to simulated executive panel"]},
                {"theme": "Data Governance, Ethics & Privacy", "topics": ["Data Privacy Regulations (GDPR, CCPA) for Analysts", "Anonymization & Pseudonymization Techniques", "Ethical Considerations in Predictive Customer Scoring", "Data Quality SLA Agreements with Engineering", "Maintaining Metric Consistency Across Teams"], "activities": ["Audit an analytics dataset for PII and privacy compliance", "Draft a data dictionary establishing canonical metric definitions", "Create a data SLA template for cross-functional teams"]},
                {"theme": "Scalable Analytics with Cloud Data Warehouses", "topics": ["Cloud Warehouse Architecture (BigQuery/Snowflake)", "Partitioning & Clustering for Cost Optimization", "Query Performance Profiling & Optimization", "Querying Semi-Structured JSON Data in SQL", "Automating Warehouse Reports"], "activities": ["Query multi-million row datasets in BigQuery", "Optimize expensive SQL queries to reduce scan costs by 40%", "Parse nested JSON arrays into structured reporting tables"]},
                {"theme": "Machine Learning Model Governance for Analysts", "topics": ["Monitoring Predictive Performance Over Time", "Detecting Data & Concept Drift in Production", "Model Auditing for Demographic Parity & Fairness", "Retraining Triggers & Feedback Loops", "Documenting Model Limitations for Stakeholders"], "activities": ["Audit an operational customer scoring model for drift", "Evaluate model fairness metrics across demographic groups", "Write a model governance documentation card"]},
                {"theme": "Marketing Attribution & Mix Modeling", "topics": ["Rule-Based Attribution (First-Touch, Last-Touch, Linear)", "Markov Chain Attribution Modeling", "Media Mix Modeling (MMM) Fundamentals", "Measuring Incremental Lift Across Channels", "Budget Optimization across Paid Channels"], "activities": ["Implement Markov chain multi-touch attribution in Python", "Compare last-touch vs data-driven attribution weights", "Model optimal ad spend distribution across digital channels"]},
                {"theme": "Product Analytics & Growth Metrics", "topics": ["Core Product Metrics (DAU, MAU, Stickiness, CAC)", "Feature Adoption & Engagement Scoring", "User Journey Funnel Drop-Off & Drop-In", "Aha-Moment Discovery & Retention Drivers", "Designing Product Experiments"], "activities": ["Calculate DAU/MAU stickiness ratios from event logs", "Identify behaviors correlated with long-term retention", "Design an onboarding experiment to boost day-7 retention"]},
                {"theme": "Financial Scenario Modeling & Forecasting", "topics": ["Three-Statement Financial Model Linkages", "Sensitivity & Monte Carlo Analysis in Python", "Gross Margin & Unit Economics Modeling", "Scenario Planning under Market Volatility", "Presenting Financial Forecasts to Leadership"], "activities": ["Build a Monte Carlo simulation forecasting annual revenue", "Run sensitivity analysis on pricing and customer churn", "Create an interactive financial model spreadsheet in Python"]},
                {"theme": "Enterprise Analytics Leadership & Strategy", "topics": ["Structuring High-Performing Analytics Teams", "Defining Enterprise Metric Architecture", "Driving Data Culture & Self-Serve Adoption", "Managing Stakeholder Expectations & Roadmaps", "Conducting Strategic Business Unit Reviews"], "activities": ["Draft an enterprise self-serve analytics strategy memo", "Design a canonical KPI matrix across business departments", "Deliver a comprehensive business performance review"]},
                {"theme": "Final Portfolio Showcase & Career Placement", "topics": ["Polishing Technical GitHub Repository Showcase", "Authoring an End-to-End Analytics Case Study", "Mastering Live SQL & Product Sense Interviews", "Resume Optimization for Senior Data Analyst Roles", "Interview Strategy & Offer Negotiation"], "activities": ["Finalize production-ready GitHub portfolio with live demo links", "Complete 5 mock live-coding SQL and product analytics interviews", "Submit targeted applications for high-impact Data Analyst positions"]}
            ]

    # -------------------------------------------------------------------------
    # 2. Career Goal: Full Stack Developer
    # Focus: HTML, CSS, JavaScript, frontend, backend, databases
    # -------------------------------------------------------------------------
    if career_goal == "Full Stack Developer" or (interest == "Web Development" and career_goal not in ["Data Analyst", "AI/ML Engineer"]):
        if skill_level == "Beginner":
            return [
                {"theme": "HTML5 Semantic Markup & Web Document Structure", "topics": ["Web Architecture Basics (Client-Server)", "Semantic HTML5 Elements & Structure", "Forms, Inputs & Accessibility (a11y) Basics", "Linking Assets & Meta Tags", "DOM Tree Hierarchy Intuition"], "activities": ["Code a multi-page semantic website structure", "Build an accessible registration form with HTML5 validation", "Validate HTML markup adhering to W3C standards"]},
                {"theme": "Modern CSS3 Styling, Flexbox & CSS Grid", "topics": ["CSS Syntax, Selectors & Cascade Specificity", "Box Model, Margins & Padding Mechanics", "Flexbox One-Dimensional Layouts", "CSS Grid Two-Dimensional Page Layouts", "Media Queries & Mobile-First Responsive Design"], "activities": ["Style a responsive landing page layout with Flexbox", "Create a responsive 3-column product grid with CSS Grid", "Implement responsive navigation with mobile breakpoint"]},
                {"theme": "JavaScript Core Fundamentals & DOM Interaction", "topics": ["Variables (let, const), Types & Operators", "Conditionals, Logic & Functions", "Selecting & Modifying DOM Elements", "Event Listeners & User Interaction", "Manipulating CSS Classes Dynamically"], "activities": ["Build an interactive to-do list with DOM manipulation", "Create an interactive modal popup triggered by button click", "Validate form inputs dynamically using JavaScript"]},
                {"theme": "Modern JavaScript (ES6+) & Asynchronous APIs", "topics": ["Arrow Functions, Template Literals & Destructuring", "Array Methods (map, filter, reduce)", "Asynchronous JavaScript & Promises", "Fetch API & Consuming Public REST Endpoints", "JSON Serialization & LocalStorage Persistence"], "activities": ["Build a dynamic weather widget fetching public API data", "Filter and render product cards using array methods", "Persist user settings and preferences in LocalStorage"]},
                {"theme": "Frontend Framework Foundations with React", "topics": ["Component-Driven Architecture Principles", "JSX Syntax & Component Composition", "Passing Data via Props", "Rendering Lists with Keys", "Conditional Component Rendering"], "activities": ["Build a modular component library for a store app", "Render dynamic list of cards passing props", "Create toggleable UI view states in React"]},
                {"theme": "React State Management & Interactive Hooks", "topics": ["State Fundamentals with useState Hook", "Side Effects & Data Fetching with useEffect", "Controlled Form Inputs & Event Handlers", "Lifting State Up Between Components", "Handling Loading & Error States in UI"], "activities": ["Build a live filterable search component in React", "Fetch remote API data on component mount with useEffect", "Implement robust error handling banners for failed network requests"]},
                {"theme": "Backend Development Foundations with Python & FastAPI", "topics": ["Backend Server Architecture & HTTP Methods", "FastAPI Framework Setup & First Endpoints", "Path Parameters, Query Strings & Request Bodies", "Pydantic Schemas for Input Validation", "Automatic OpenAPI / Swagger Documentation"], "activities": ["Build a RESTful task management API with FastAPI", "Define Pydantic models validating incoming JSON payloads", "Test API routes interactively in Swagger UI"]},
                {"theme": "Relational Databases & SQL Schema Modeling", "topics": ["Relational Database Concepts & Tables", "SQL CRUD Operations (INSERT, SELECT, UPDATE, DELETE)", "Primary Keys, Foreign Keys & Relationships", "Database Persistence with SQLite", "Parameterized Queries & SQL Injection Defense"], "activities": ["Design relational database tables for users and items", "Write safe parameterized queries in Python", "Verify relational foreign key cascade behaviors"]},
                {"theme": "Full-Stack Integration & API Communication", "topics": ["Cross-Origin Resource Sharing (CORS) Configuration", "Connecting React Frontend to FastAPI Backend", "Handling Asynchronous API Calls in Frontend", "Displaying Server Validation Errors in UI", "Optimistic UI Updates"], "activities": ["Connect React task interface to live FastAPI endpoints", "Display backend validation errors on form submission", "Implement responsive loading indicators during API calls"]},
                {"theme": "User Authentication & Web Security Essentials", "topics": ["Password Hashing (bcrypt) & Salting", "JSON Web Tokens (JWT) Architecture", "Protecting API Endpoints with Auth Guards", "Managing Auth State in React Context", "OWASP Top 10 Web Vulnerabilities Overview"], "activities": ["Implement secure signup and login API endpoints", "Store JWT tokens securely and attach to request headers", "Protect private frontend routes based on auth state"]},
                {"theme": "Automated Testing for Full Stack Applications", "topics": ["Testing Strategy: Unit, Integration & E2E", "Backend Testing with Pytest & TestClient", "Frontend Testing with React Testing Library", "Mocking API Responses in Tests", "Test Coverage Goals for Web Apps"], "activities": ["Write automated pytest suite verifying backend endpoints", "Test React form submission and error rendering", "Achieve >80% test coverage on critical user flows"]},
                {"theme": "Full-Stack Capstone Deployment & Portfolio Launch", "topics": ["Production Build Optimization (Vite build)", "Environment Variables & Secrets Management", "Deploying Backend to Cloud Services", "Hosting Static Frontend on Modern Platforms", "Curating GitHub Portfolio & Live Demos"], "activities": ["Deploy full-stack web application to production cloud hosts", "Configure production environment variables securely", "Publish GitHub repository with architecture diagram and live URL"]},
                {"theme": "Advanced Frontend State & Context Architecture", "topics": ["React Context API for Global State", "Zustand / Redux Toolkit Fundamentals", "Custom React Hooks for Reusable Logic", "Component Memoization (useMemo, useCallback)", "Performance Profiling with React DevTools"], "activities": ["Refactor component state into a centralized Zustand store", "Create custom hooks for data fetching and authentication", "Profile React rendering to eliminate redundant re-renders"]},
                {"theme": "TypeScript for Full Stack Developers", "topics": ["TypeScript Foundations & Static Typing", "Interfaces, Types & Generics", "Typing React Components, Props & State", "Type-Safe API Contracts & Shared Schemas", "TypeScript Compiler (tsconfig) Configuration"], "activities": ["Migrate frontend React components to TypeScript", "Define strict interfaces for API request/response payloads", "Verify zero compile-time TypeScript errors"]},
                {"theme": "Database ORM with SQLAlchemy & Migrations", "topics": ["Object-Relational Mapping (ORM) Principles", "SQLAlchemy Models & Relationship Declarations", "Querying & Filtering with SQLAlchemy Session", "Schema Versioning & Migrations with Alembic", "Database Indexing for Query Performance"], "activities": ["Define SQLAlchemy models with one-to-many relationships", "Configure Alembic and execute automated schema migration", "Benchmark database query performance before and after indexing"]},
                {"theme": "Containerization with Docker & Multi-Service Compose", "topics": ["Docker Concepts (Images, Containers, Volumes)", "Writing Clean Dockerfiles for Frontend & Backend", "Docker Compose for Multi-Container Apps (App + DB)", "Environment Configuration in Containers", "Multi-Stage Docker Builds for Lean Images"], "activities": ["Write multi-stage Dockerfile for React and FastAPI services", "Run frontend, backend, and PostgreSQL with Docker Compose", "Verify inter-container network communication"]},
                {"theme": "Caching & Background Tasks with Redis", "topics": ["Caching Strategies (Cache-Aside, TTL)", "In-Memory Caching with Redis", "Asynchronous Background Task Processing", "Session Store Management with Redis", "Cache Invalidation Best Practices"], "activities": ["Implement Redis caching for high-latency database queries", "Offload slow email/notification jobs to background workers", "Measure 5x latency reduction with Redis caching"]},
                {"theme": "WebSockets & Real-Time Communication", "topics": ["HTTP Polling vs WebSockets Architecture", "FastAPI WebSocket Endpoints", "Managing WebSocket Connections in React", "Broadcasting Messages to Active Clients", "Handling Connection Drops & Reconnection"], "activities": ["Build a real-time notification or chat feature", "Establish WebSocket connection between React and FastAPI", "Implement automatic reconnection on network drops"]},
                {"theme": "CI/CD & Automated Delivery Pipelines", "topics": ["Continuous Integration & Delivery (CI/CD) Principles", "Automating Tests with GitHub Actions", "Automated Linting, Type-Checking & Formatting", "Secrets Management in CI/CD Workflows", "Automated Container Image Publishing"], "activities": ["Write a GitHub Actions workflow running tests on every PR", "Configure automated build step verifying production bundle", "Deploy container automatically on merge to main"]},
                {"theme": "Web Application Security Hardening", "topics": ["Content Security Policy (CSP) & CORS Deep-Dive", "Preventing Cross-Site Scripting (XSS) & CSRF", "Rate Limiting & DDoS Mitigation", "Input Sanitization & SQL Injection Prevention", "Automated Security Scanning with Bandit"], "activities": ["Configure strict Content Security Policy headers", "Implement token-bucket rate limiting on authentication routes", "Perform security vulnerability scan and remediate findings"]},
                {"theme": "System Architecture & Scalability for Web Platforms", "topics": ["Monolithic vs Microservice Architecture", "Load Balancing & Horizontal Scaling", "Database Read Replicas & Connection Pooling", "CDN Asset Delivery & Edge Caching", "Writing Architecture Decision Records (ADRs)"], "activities": ["Design scalable full-stack system architecture diagram", "Configure CDN caching for static frontend assets", "Author an Architecture Decision Record for tech stack choices"]},
                {"theme": "GraphQL & Modern API Paradigms", "topics": ["REST vs GraphQL Architectural Trade-Offs", "GraphQL Schemas, Queries & Mutations", "Integrating Apollo Client in React", "Solving the N+1 Query Problem", "When to Choose REST vs GraphQL"], "activities": ["Build a GraphQL schema with queries and mutations", "Integrate Apollo Client fetching data into React components", "Optimize database fetching to eliminate N+1 queries"]},
                {"theme": "Full-Stack Code Hygiene & Portfolio Showcase", "topics": ["Structuring a Production Portfolio Codebase", "Authoring Comprehensive Architecture Documentation", "Full Stack Technical Interview Preparation", "Live Coding: Frontend Components & Backend APIs", "System Design Interview Scenarios for Full Stack Roles"], "activities": ["Consolidate capstone full-stack repository with clean commits", "Author detailed README with architecture diagrams and API docs", "Practice 10 full-stack coding and system design interview questions"]},
                {"theme": "Career Readiness & Full Stack Placement", "topics": ["Full Stack Developer Resume & LinkedIn Optimization", "Technical Portfolio Review & Live Demonstrations", "Navigating Full Stack Engineering Job Applications", "Behavioral Interview Prep (STAR Method)", "Offer Evaluation & Salary Negotiation"], "activities": ["Submit portfolio for senior peer review", "Complete mock full-stack technical interview with rubric", "Submit targeted applications for Full Stack Developer positions"]}
            ]
        else: # Intermediate / Advanced Full Stack Developer
            return [
                {"theme": "Micro-Frontends & Scalable Web Architecture", "topics": ["Micro-Frontend Architectural Patterns", "Module Federation with Webpack / Vite", "Independent Deployment & Team Autonomy", "Shared Component Libraries & Design Systems", "State Synchronization Across Micro-Apps"], "activities": ["Implement module federation linking two independent web apps", "Build a shared UI component design system package", "Benchmark bundle loading performance of micro-frontends"]},
                {"theme": "Distributed Backend Services & Event-Driven Architecture", "topics": ["Event-Driven Architecture Principles", "Message Brokers (Kafka / RabbitMQ) Integration", "Asynchronous Event Producers & Consumers", "Saga Pattern for Distributed Transactions", "Handling Eventual Consistency across Services"], "activities": ["Build an event producer and consumer with message brokers", "Implement the Saga pattern for multi-step order processing", "Document distributed failure modes and recovery procedures"]},
                {"theme": "Database Performance Tuning & Scalability at Scale", "topics": ["PostgreSQL Query Planner & EXPLAIN ANALYZE", "B-Tree, GIN & Partitioning Strategies", "Connection Pooling with PgBouncer", "Read Replicas & Read/Write Splitting", "Zero-Downtime Database Migrations"], "activities": ["Optimize expensive multi-join queries with EXPLAIN ANALYZE", "Configure read/write database connection splitting", "Execute a zero-downtime column migration under load"]},
                {"theme": "High-Throughput API Engineering & gRPC", "topics": ["REST vs gRPC vs GraphQL Benchmarks", "Protocol Buffers (Protobuf) Serialization", "High-Throughput Services with FastAPI & Pydantic v2", "Distributed Tracing with OpenTelemetry", "API Rate Limiting & Resilience Patterns"], "activities": ["Build a high-throughput gRPC service in Python", "Instrument full-stack transactions with OpenTelemetry traces", "Implement sliding-window rate limiting middleware"]},
                {"theme": "Kubernetes & Cloud-Native Container Orchestration", "topics": ["Kubernetes Concepts (Pods, Deployments, Services)", "Configuring Helm Charts for Full-Stack Applications", "Horizontal Pod Autoscaling (HPA)", "Ingress Controllers & SSL Termination", "Cloud Deployment on AWS/GCP/Azure"], "activities": ["Deploy full-stack services to a local Kubernetes cluster", "Configure auto-scaling based on CPU and request latency", "Set up Ingress routing with automated TLS certificates"]},
                {"theme": "Observability, Telemetry & SRE Principles", "topics": ["Three Pillars of Observability (Metrics, Logs, Traces)", "Prometheus Metric Instrumentation in Python", "Centralized Structured Logging with JSON & Loki", "Alerting Rules & Incident Response", "Defining Service Level Indicators (SLIs) and SLOs"], "activities": ["Instrument endpoints with Prometheus metrics", "Configure Grafana dashboards displaying P95/P99 latency", "Define error budget and alerting rules for production outages"]},
                {"theme": "Enterprise Caching & Edge Computing", "topics": ["Cache Invalidation Strategies (Cache-Aside, Write-Through)", "Redis Cluster Architecture & Sharding", "Handling Cache Stampedes & Dogpiling", "Edge Functions (Cloudflare Workers / Vercel Edge)", "Multi-Tier Caching Architecture"], "activities": ["Implement cache-aside pattern with TTL and mutex locks", "Deploy edge functions caching dynamic API responses", "Benchmark global latency reductions with edge compute"]},
                {"theme": "Full-Stack Security Engineering & Hardening", "topics": ["OWASP Top 10 for Web Applications", "Cryptographic Operations (Hashing, HMAC, AES)", "Secret Management (HashiCorp Vault / Cloud Secrets)", "Preventing SSRF, XSS & Deserialization Attacks", "Automated Security Auditing in CI/CD"], "activities": ["Perform an automated vulnerability scan with Bandit", "Implement secure encrypted payload storage with AES", "Integrate automated secret scanning into CI pipelines"]},
                {"theme": "Testing Strategies: Contract & Mutation Testing", "topics": ["Test-Driven Development (TDD) Workflows", "Consumer-Driven Contract Testing with Pact", "End-to-End Testing with Playwright", "Mutation Testing for Test Quality Verification", "Performance & Load Testing with Locust"], "activities": ["Implement contract tests between React frontend and API", "Automate E2E browser tests with Playwright", "Simulate 1,000 concurrent users with Locust load testing"]},
                {"theme": "Serverless & Cloud-Native Architectures", "topics": ["Serverless Computing Concepts (AWS Lambda, Cloud Functions)", "Cold Starts & Optimizing Serverless Packages", "Event-Driven Serverless Workflows (S3/SQS Triggers)", "Step Functions & State Machines", "Serverless Framework / SAM"], "activities": ["Deploy a serverless image processing pipeline", "Optimize cold start latency by trimming dependencies", "Build an automated event-driven state machine"]},
                {"theme": "System Design & Distributed Consensus", "topics": ["CAP Theorem & PACELC Implications", "Eventual Consistency vs Strong Consistency", "Event Sourcing & CQRS Architecture", "Distributed Transactions & Saga Pattern", "Message Brokers (Kafka/RabbitMQ) Internals"], "activities": ["Design an event-driven system architecture with Kafka", "Implement a compensating transaction Saga pattern", "Document distributed system failure modes and mitigations"]},
                {"theme": "Capstone Architecture & Production Deployment", "topics": ["End-to-End Scalable System Capstone", "Blue/Green and Canary Deployment Strategies", "Load Testing with Locust at 1,000+ RPS", "Writing Production Architecture Documentation", "Technical Leadership & System Design Interviews"], "activities": ["Execute load testing simulating 1,000 RPS on the capstone", "Deploy a zero-downtime blue/green release", "Complete 5 mock Senior System Design interviews"]},
                {"theme": "Developer Tooling & Platform Engineering", "topics": ["Building Internal Developer Platforms (IDPs)", "Creating Custom CLI Tools for Engineering Teams", "Automating Development Environments with Devcontainers", "Managing Monorepos with Turborepo / Pants", "Setting Up Pre-Commit Hooks & Quality Gates"], "activities": ["Build custom developer tooling CLI", "Configure standardized devcontainer for the team", "Set up pre-commit hooks enforcing strict type and lint checks"]},
                {"theme": "Technical Debt Management & Refactoring", "topics": ["Identifying Code Smells & Architectural Debt", "Refactoring Monoliths into Modular Services", "Strangler Fig Pattern for Legacy Migration", "Measuring Code Health & Maintainability Index", "Balancing Feature Velocity with Code Quality"], "activities": ["Apply the Strangler Fig pattern to extract a legacy service", "Refactor a monolithic service into clean modules", "Author a technical debt remediation roadmap"]},
                {"theme": "High-Availability Full-Stack Infrastructure", "topics": ["Multi-Region Deployment & Disaster Recovery", "Database Failover & High Availability (HA)", "Multi-Cloud Ingress Routing", "Traffic Splitting & Chaos Testing", "SLA / SLO Compliance Monitoring"], "activities": ["Configure automated database failover in staging", "Simulate region outage and verify disaster recovery", "Conduct chaos experiment testing service resilience"]},
                {"theme": "Progressive Web Applications (PWA) & Offline Sync", "topics": ["Service Workers & Offline Caching Strategies", "Web App Manifests & Installability", "Background Sync & Push Notifications", "IndexedDB for Offline Client Storage", "Conflict Resolution in Offline Data"], "activities": ["Build a progressive web app with offline capabilities", "Implement service worker caching strategies", "Synchronize offline edits upon network reconnection"]},
                {"theme": "WebAssembly & High-Performance Client Compute", "topics": ["WebAssembly (WASM) Architecture", "Compiling Rust/C to WebAssembly", "Integrating WASM Modules into React", "Offloading CPU-Heavy Compute from JS Thread", "Web Workers & Multi-Threading in Browser"], "activities": ["Compile a high-performance computation module to WASM", "Integrate WASM module into React application", "Measure 10x performance gain over pure JavaScript"]},
                {"theme": "Enterprise Web Security & Compliance", "topics": ["SOC 2, GDPR & HIPAA Compliance for Web Apps", "Role-Based & Attribute-Based Access Control (RBAC/ABAC)", "Audit Logging & Tamper-Proof Event Logs", "Data Encryption at Rest and in Transit", "Security Penetration Testing Workflows"], "activities": ["Implement granular RBAC/ABAC permission middleware", "Configure tamper-proof security audit logging", "Perform security penetration testing review"]},
                {"theme": "Search Engine Optimization (SEO) & Web Vitals", "topics": ["Core Web Vitals (LCP, FID/INP, CLS)", "Server-Side Rendering (SSR) & Static Generation", "Dynamic Meta Tags & Structured Data (JSON-LD)", "Optimizing Asset Delivery & Image Pipelines", "Performance Monitoring with Real User Metrics (RUM)"], "activities": ["Optimize Largest Contentful Paint (LCP) to under 2.0s", "Implement structured JSON-LD schema markup", "Audit web vitals scoring 95+ on Lighthouse"]},
                {"theme": "Open Source Contribution & Ecosystem Leadership", "topics": ["Navigating Major Open Source Codebases", "Writing High-Quality Pull Requests & Tests", "Communicating with Maintainers & Issue Triage", "Packaging and Publishing Libraries to NPM / PyPI", "Licensing & Open Source Governance"], "activities": ["Submit a pull request to an open source web framework", "Publish reusable utility component library to NPM", "Write comprehensive documentation and continuous testing"]},
                {"theme": "Engineering Management & Architectural Leadership", "topics": ["Leading Architecture Reviews & RFC Processes", "Mentoring Junior and Mid-Level Developers", "Technical Interview Design & Hiring Standards", "Balancing Trade-offs in System Architecture", "Communicating Technical Strategy to Executives"], "activities": ["Write a Request for Comments (RFC) for a major system change", "Conduct a structured mock technical interview with rubric", "Deliver an architectural roadmap presentation"]},
                {"theme": "Final Senior Full-Stack Engineering Showcase", "topics": ["Synthesizing Full Architectural Portfolio", "Senior Coding & System Design Interview Mastery", "Navigating Complex Technical Scenarios", "Negotiating Senior Software Engineering Offers", "Long-Term Career Strategy & Continuous Learning"], "activities": ["Deliver a comprehensive system design showcase to peer review", "Complete 5 mock senior-level technical interviews", "Finalize career placement strategy and application materials"]}
            ]

    # -------------------------------------------------------------------------
    # 3. Career Goal: AI/ML Engineer
    # Focus: Python, mathematics, machine learning, deep learning, deployment
    # -------------------------------------------------------------------------
    if career_goal == "AI/ML Engineer" or (interest in ["Machine Learning", "Artificial Intelligence"] and career_goal not in ["Data Analyst", "Software Developer", "Full Stack Developer"]):
        if skill_level == "Beginner":
            return [
                {"theme": "Python & Applied Mathematics for Machine Learning", "topics": ["Python Environment, Virtualenvs & Git Setup", "NumPy Arrays, Matrix Math & Vectorization", "Linear Algebra Foundations (Vectors, Dot Products, Matrices)", "Multivariate Calculus Intuition (Gradients & Slopes)", "Benchmark Vectorized vs Loop Performance"], "activities": ["Implement matrix multiplication with NumPy", "Perform vectorized operations on multi-dimensional arrays", "Benchmark speedup of NumPy vectorization over pure Python"]},
                {"theme": "Data Preprocessing & Feature Pipelines with Pandas", "topics": ["Pandas DataFrames, Series & Data Ingestion", "Data Cleaning, Handling Nulls & Imputation", "Filtering, Slicing & Reshaping Datasets", "Categorical Encoding (One-Hot & Ordinal)", "Feature Scaling (StandardScaler, MinMaxScaler)"], "activities": ["Clean and preprocess a raw tabular dataset", "Encode categorical features for machine learning input", "Scale numerical features and verify zero-mean distributions"]},
                {"theme": "Exploratory Data Analysis & Statistical Intuition", "topics": ["Exploratory Data Analysis Principles", "Visualizing Distributions with Seaborn & Matplotlib", "Correlation Analysis & Multicollinearity Inspection", "Detecting Outliers using Box Plots & Z-Scores", "Formulating Machine Learning Hypotheses"], "activities": ["Generate an EDA visual report with correlation heatmaps", "Detect and remove outliers from training features", "Write an analytical summary explaining feature relationships"]},
                {"theme": "Supervised Learning Fundamentals: Regression Algorithms", "topics": ["Supervised Learning Framework (X, y, loss)", "Simple & Multiple Linear Regression", "Cost Functions, Mean Squared Error & Gradient Descent", "Train/Test Split & Evaluating Regression (MAE, RMSE, R2)", "Overfitting vs Underfitting Basics"], "activities": ["Fit a linear regression model to predict numerical targets", "Evaluate model predictions using MAE, RMSE, and R2", "Plot residuals to identify non-linear error patterns"]},
                {"theme": "Supervised Learning: Classification Algorithms", "topics": ["Classification Concepts & Decision Boundaries", "Logistic Regression & Sigmoid Activation", "Evaluating Classifiers: Confusion Matrix, Precision, Recall", "F1-Score & ROC-AUC Curves", "Tuning Probability Decision Thresholds"], "activities": ["Build a binary classification model on customer data", "Generate confusion matrix and precision-recall trade-offs", "Tune decision thresholds for optimal recall on positive class"]},
                {"theme": "Tree-Based Models & Scikit-Learn Pipelines", "topics": ["Decision Tree Mechanics (Gini vs Entropy)", "Random Forest Ensembles & Bagging", "Scikit-Learn Pipeline Architecture", "Combining Preprocessors & Estimators into Pipelines", "Feature Importance Inspection"], "activities": ["Build an end-to-end Scikit-Learn preprocessing & model pipeline", "Train and visualize a decision tree classifier", "Compare single tree performance against Random Forest"]},
                {"theme": "Model Validation & Hyperparameter Optimization", "topics": ["K-Fold Cross-Validation Fundamentals", "Hyperparameter Tuning with GridSearchCV", "RandomizedSearchCV for Efficient Exploration", "Preventing Data Leakage in Preprocessing", "Model Generalization Diagnostics"], "activities": ["Tune Random Forest hyperparameters with cross-validation", "Verify zero data leakage across train/validation splits", "Plot validation curves to diagnose bias and variance"]},
                {"theme": "Unsupervised Learning & Dimensionality Reduction", "topics": ["Unsupervised Learning Intuition", "K-Means Clustering & Centroid Updates", "Determining K with the Elbow Method", "Dimensionality Reduction with PCA", "Visualizing High-Dimensional Data"], "activities": ["Segment unlabeled records into behavioral clusters", "Determine optimal cluster count using inertia and silhouette scores", "Reduce 20 features to 2 principal components via PCA"]},
                {"theme": "Deep Learning Foundations with PyTorch", "topics": ["Tensors, Operations & GPU Acceleration", "Automatic Differentiation with Autograd", "Building Multi-Layer Perceptrons (MLPs)", "Loss Functions & Optimizers (SGD, Adam)", "Writing Clean PyTorch Training Loops"], "activities": ["Build a multi-layer neural network from scratch in PyTorch", "Implement a training and validation loop with loss tracking", "Plot learning curves and evaluate convergence rate"]},
                {"theme": "Model Serialization & Artifact Persistence", "topics": ["Model Persistence with Joblib & Pickle", "Saving & Loading Model Pipelines", "Validating Serialized Model Inference Consistency", "Creating Standalone Prediction Scripts", "Version Controlling Model Artifacts"], "activities": ["Serialize trained model pipeline to disk with Joblib", "Write a Python script that loads the model and runs predictions", "Verify that saved model predictions match memory predictions"]},
                {"theme": "Serving ML Models via REST API (FastAPI)", "topics": ["Introduction to FastAPI for ML Engineers", "Defining Request/Response Schemas with Pydantic", "Loading Model Artifacts on Server Startup", "Writing a POST /predict Inference Endpoint", "Returning Prediction Outputs & Probability Confidence"], "activities": ["Build a FastAPI microservice that serves your trained model", "Validate incoming JSON feature payloads with Pydantic", "Test predictions interactively in Swagger UI"]},
                {"theme": "Containerizing ML Services with Docker & ML Capstone", "topics": ["Docker Fundamentals for ML Engineers", "Writing a Dockerfile for a FastAPI ML Service", "Managing Dependencies & Python Versions in Containers", "Building and Running Containerized Inference", "Testing Inference Across Isolated Environments"], "activities": ["Write a clean Dockerfile packaging model artifact and API", "Build and run the containerized model service locally", "Send HTTP prediction requests to the running Docker container"]},
                {"theme": "Gradient Boosting Mechanics (XGBoost/LightGBM)", "topics": ["Boosting Intuition (Sequentially Correcting Residuals)", "XGBoost Architecture & Tree Pruning", "LightGBM Histogram-Based Splitting", "Handling Categorical Data in Boosting", "Tuning Learning Rates & Tree Depth"], "activities": ["Train an XGBoost model and compare against Random Forest", "Benchmark training speed and memory of LightGBM", "Tune boosting hyperparameters to prevent overfitting"]},
                {"theme": "Handling Imbalanced Datasets & Anomaly Detection", "topics": ["Class Imbalance in Real-World ML (Fraud, Failures)", "Resampling Strategies (SMOTE, Under-Sampling)", "Focal Loss & Class Weight Balancing", "Isolation Forests for Anomaly Detection", "Evaluating PR-AUC vs ROC-AUC on Imbalanced Data"], "activities": ["Apply SMOTE to balance a rare-event classification dataset", "Train an Isolation Forest to detect anomalous records", "Evaluate performance using precision-recall curves"]},
                {"theme": "Neural Network Training & Regularization", "topics": ["Overfitting in Neural Networks", "Dropout, Weight Decay (L2) & Batch Normalization", "Learning Rate Schedulers & Warmup", "Early Stopping Strategies", "Saving and Loading PyTorch Checkpoints"], "activities": ["Add Dropout and Batch Normalization to an MLP architecture", "Implement early stopping based on validation loss", "Save model checkpoints and resume training state"]},
                {"theme": "Computer Vision & CNN Architectures", "topics": ["Image Representations as Numerical Tensors", "Convolutional Layers, Filters & Feature Maps", "Pooling Layers (MaxPooling, AveragePooling)", "Building a Custom CNN for Image Classification", "Transfer Learning with Pretrained Models (ResNet)"], "activities": ["Build and train a CNN classifier on image benchmark data", "Fine-tune a pretrained ResNet model for custom images", "Inspect learned convolutional filter feature maps"]},
                {"theme": "Natural Language Processing (NLP) Foundations", "topics": ["Text Preprocessing, Tokenization & Vocabularies", "Bag-of-Words & TF-IDF Feature Extraction", "Word Embeddings (Word2Vec, GloVe)", "Introduction to Recurrent Neural Networks (RNN/LSTM)", "Text Classification with PyTorch"], "activities": ["Build a TF-IDF text classification pipeline", "Train an LSTM model on sequential text records", "Evaluate model accuracy and confusion matrix on text categories"]},
                {"theme": "Introduction to Modern Transformer Models", "topics": ["Limitations of RNNs & Attention Intuition", "HuggingFace Transformers Library Overview", "Tokenizers, Fast Tokenization & Vocabularies", "Fine-Tuning Pretrained BERT for Text Classification", "Model Evaluation & Inference Benchmarking"], "activities": ["Fine-tune a HuggingFace BERT model on domain text", "Compare Transformer classification accuracy against TF-IDF", "Measure inference latency on CPU vs GPU"]},
                {"theme": "Model Optimization & Efficient Inference", "topics": ["Inference Latency vs Throughput Trade-Offs", "Exporting Models to ONNX (Open Neural Network Exchange)", "Inference Acceleration with ONNX Runtime", "Model Quantization (FP32 to INT8)", "Benchmarking Latency Speedups"], "activities": ["Export PyTorch and Scikit-Learn models to ONNX format", "Benchmark prediction latency using ONNX Runtime", "Quantize a neural network and measure speedup vs accuracy"]},
                {"theme": "Building Production Inference Pipelines", "topics": ["Batch vs Real-Time Streaming Inference", "Validating Input Data Schemas with Pydantic", "Handling Missing Features at Inference Time", "Asynchronous Prediction Workers in FastAPI", "Logging Inferences & Monitoring Predictions"], "activities": ["Build an asynchronous prediction API handling batch inputs", "Add defensive schema fallback for missing inference fields", "Log prediction distributions to detect anomalous inputs"]},
                {"theme": "MLOps Foundations: Experiment Tracking", "topics": ["Challenges in Reproducible Machine Learning", "Experiment Tracking with MLflow", "Logging Parameters, Metrics & Model Artifacts", "Comparing Model Runs in MLflow UI", "Model Registry & Staging vs Production Tags"], "activities": ["Track 10 experiment training runs with MLflow", "Log ROC curves and confusion matrix artifacts in MLflow", "Promote best-performing model to Production stage"]},
                {"theme": "Automated Testing & CI/CD for Machine Learning", "topics": ["Unit Testing Data Preprocessing Functions", "Testing Model Output Invariance & Directionality", "Validating Model Performance Against Baseline Benchmarks", "Automating ML Testing with GitHub Actions", "Continuous Training Pipeline Architecture"], "activities": ["Write unit tests verifying feature pipeline transformations", "Write tests ensuring model prediction outputs stay in bounds", "Configure GitHub Actions running automated model tests on push"]},
                {"theme": "Cloud Deployment for Machine Learning", "topics": ["Cloud ML Infrastructure (AWS/GCP)", "Deploying Containerized Models to Cloud Run / ECS", "Autoscaling Inference Based on Request Queue Depth", "Health Check Endpoints & Graceful Shutdowns", "Estimating Cloud Compute Costs for ML"], "activities": ["Deploy Dockerized ML service to cloud container service", "Configure health checks and automatic autoscaling", "Estimate monthly compute costs across traffic tiers"]},
                {"theme": "Final AI/ML Engineering Capstone & Career Placement", "topics": ["End-to-End Production ML System Synthesis", "Architecture Documentation & System Design Walkthrough", "AI/ML Engineer Technical Interview Preparation", "Live Coding: Algorithms, NumPy & ML Implementations", "Resume & Portfolio Optimization for ML Roles"], "activities": ["Complete production-grade deployed ML microservice with tests", "Publish comprehensive repository with architecture diagrams", "Practice 10 ML engineering technical interview challenges"]}
            ]
        else: # Intermediate / Advanced AI/ML Engineer
            return [
                {"theme": "Production ML Architecture & System Design", "topics": ["Components of Production ML Systems", "Feature Store Concepts (Feast) & Feature Serving", "Batch vs Streaming Feature Ingestion", "Online/Offline Feature Skew Prevention", "Designing End-to-End ML Architectures"], "activities": ["Design an end-to-end ML system architecture diagram", "Implement an offline feature pipeline with temporal joins", "Evaluate strategies to eliminate training-serving skew"]},
                {"theme": "Advanced Gradient Boosting & Tabular Architectures", "topics": ["XGBoost, LightGBM & CatBoost Benchmarking", "Hyperparameter Optimization with Optuna", "Custom Loss Functions for Business Objectives", "Ensembling, Blending & Stacking Classifiers", "Model Explainability with SHAP in Production"], "activities": ["Implement Optuna Bayesian optimization for hyperparameters", "Write a custom asymmetric loss function penalizing false negatives", "Generate SHAP value attributions for real-time explanations"]},
                {"theme": "Deep Learning Architecture & Custom Layers in PyTorch", "topics": ["PyTorch Custom Modules & Functional API", "Custom Loss Functions & Contrastive Learning", "Learning Rate Schedulers & Gradient Clipping", "Profiling PyTorch Code with PyTorch Profiler", "GPU Memory Management & CUDA Best Practices"], "activities": ["Build a custom neural layer and loss function in PyTorch", "Profile memory and execution bottlenecks using PyTorch Profiler", "Optimize CUDA tensor allocations to prevent out-of-memory errors"]},
                {"theme": "Transformer Architecture & LLM Engineering", "topics": ["Self-Attention & Multi-Head Projections Mechanics", "Transformer Encoders, Decoders & Pretraining", "Parameter-Efficient Fine-Tuning (LoRA, QLoRA)", "HuggingFace PEFT & TRL Libraries", "Evaluating Fine-Tuned Language Models"], "activities": ["Implement scaled dot-product attention from scratch", "Fine-tune an open-source model using LoRA on specialized data", "Evaluate perplexity and benchmark latency vs base model"]},
                {"theme": "Information Retrieval & Vector Databases (RAG)", "topics": ["Text Embeddings & Dense Retrieval", "Vector Similarity Metrics (Cosine, Dot Product)", "Vector Databases (ChromaDB, Pinecone, Qdrant)", "Retrieval-Augmented Generation (RAG) Architecture", "Chunking Strategies & Hybrid Search (BM25 + Dense)"], "activities": ["Build a document chunking and vector embedding pipeline", "Index domain documents into a vector database", "Implement a semantic search and retrieval query engine"]},
                {"theme": "High-Throughput Model Serving & Quantization", "topics": ["Serving Frameworks (Triton, vLLM, FastAPI)", "Model Quantization (FP16, INT8, AWQ, GGUF)", "ONNX Runtime & TensorRT GPU Optimization", "Batching Inferences & Dynamic Batching", "Benchmarking P95/P99 Inference Latency"], "activities": ["Quantize an inference model to INT8 and measure speedup", "Deploy model with ONNX Runtime and benchmark latency", "Configure dynamic batching for multi-request throughput"]},
                {"theme": "MLOps: Experiment Tracking & Model Registry", "topics": ["End-to-End Tracking with MLflow & Weights & Biases", "Model Artifact Versioning & Model Signatures", "Model Governance & Promotion Workflows (Dev->Staging->Prod)", "Data Versioning with DVC (Data Version Control)", "Automating Artifact Uploads to Cloud Storage"], "activities": ["Configure MLflow Model Registry with staging/prod gates", "Version a multi-gigabyte dataset using DVC and Git", "Track hyperparameters and loss curves in real time"]},
                {"theme": "Automated Machine Learning Pipelines (Airflow / Kubeflow)", "topics": ["Workflow Orchestration for Machine Learning", "Building DAGs for Data Ingestion, Training & Eval", "Automated Validation Gates Blocking Faulty Models", "Triggering Retraining Based on Schedules & Events", "Containerized Pipeline Steps"], "activities": ["Build an automated ML training pipeline with directed DAGs", "Implement an automated evaluation step validating accuracy gates", "Test pipeline execution across automated retrain cycles"]},
                {"theme": "Model Monitoring & Drift Detection in Production", "topics": ["Data Drift (Covariate Shift) & Concept Drift", "Statistical Drift Metrics (KS-Test, PSI, Wasserstein)", "Evidently AI / Great Expectations for Monitoring", "Setting Up Drift Alerts & Automated Rollbacks", "Logging Production Inference Payloads"], "activities": ["Implement KS-test and PSI calculations detecting data drift", "Build an automated dashboard tracking model prediction shifts", "Configure automated alerting when input distributions diverge"]},
                {"theme": "Testing, CI/CD & Deployment Strategies for ML", "topics": ["Continuous Integration for Machine Learning (CT/CD)", "Shadow Deployments & Canary Releases for ML", "A/B Testing Model Variants in Live Traffic", "Unit Testing Feature Transformations & Shapes", "Automated Rollback Mechanisms"], "activities": ["Build a CI/CD pipeline running automated tests on model pull requests", "Implement a shadow deployment scoring live traffic silently", "Configure automated rollback if canary error rate exceeds threshold"]},
                {"theme": "Distributed Training & Scalable Deep Learning", "topics": ["Data Parallel vs Model Parallelism", "PyTorch Distributed Data Parallel (DDP)", "Mixed-Precision Training (FP16/BF16 with AMP)", "Gradient Accumulation & Zero Redundancy Optimizer", "Scaling Training Across Multi-GPU Nodes"], "activities": ["Configure a PyTorch DDP training script for multiple GPUs", "Implement mixed-precision training reducing VRAM by 40%", "Benchmark training speedups across GPU configurations"]},
                {"theme": "Capstone Enterprise MLOps Platform & Leadership", "topics": ["Synthesizing an End-to-End Enterprise MLOps Platform", "Authoring Production Architecture & Runbooks", "Leading ML System Design & RFC Reviews", "AI Ethics, Governance & Model Explainability", "Preparing for Senior / Lead AI/ML Engineer Roles"], "activities": ["Deploy a complete automated ML training & serving platform", "Document production runbook and disaster recovery procedures", "Deliver a simulated technical architecture review to peer engineers"]},
                {"theme": "Feature Store Architecture & Real-Time Ingestion", "topics": ["Point-in-Time Correctness in Feature Stores", "Feature Engineering on Streaming Data (Kafka/Flink)", "Low-Latency Online Feature Retrieval with Redis", "Feature Standardization Across Data Teams", "Feature Deprecation & Lifecycle Management"], "activities": ["Build a real-time feature transformation pipeline using Redis", "Ensure point-in-time correctness avoiding lookahead bias", "Benchmark sub-10ms online feature lookup latency"]},
                {"theme": "Large Language Model Evaluation & Guardrails", "topics": ["Evaluating Generative Outputs & RAG Triad", "Hallucination Detection & Groundedness Metrics", "Guardrails (NeMo Guardrails, Llama-Guard)", "Prompt Injection & Jailbreak Defense Strategies", "Latency & Token Cost Optimization for LLMs"], "activities": ["Implement automated groundedness evaluation for a RAG system", "Build safety guardrails filtering inappropriate prompts", "Optimize prompt token usage reducing API costs by 30%"]},
                {"theme": "Edge AI & Embedded Machine Learning", "topics": ["Edge Constraints (Compute, Memory, Power)", "TensorFlow Lite & PyTorch Mobile Export", "Pruning, Weight Sharing & Structured Sparsity", "Running Inference on Edge Devices / Microcontrollers", "Benchmarking On-Device Performance"], "activities": ["Export and quantize an ML model for mobile/edge execution", "Prune 30% of model weights while retaining >95% accuracy", "Benchmark on-device inference speed and thermal efficiency"]},
                {"theme": "Multi-Modal Machine Learning", "topics": ["Joint Embedding Spaces (CLIP Architecture)", "Vision-Language Models (VLM) Foundations", "Audio Processing & Speech-to-Text with Whisper", "Cross-Modal Retrieval & Similarity Search", "Deploying Multi-Modal Applications"], "activities": ["Build a zero-shot image search engine using CLIP embeddings", "Transcribe and analyze audio data using Whisper", "Deploy a multi-modal search endpoint with FastAPI"]},
                {"theme": "Deep Reinforcement Learning & Alignment", "topics": ["Markov Decision Processes & Policy Optimization", "Proximal Policy Optimization (PPO)", "Reinforcement Learning from Human Feedback (RLHF)", "Direct Preference Optimization (DPO)", "Reward Modeling & Preference Datasets"], "activities": ["Train an RL agent on continuous control environments", "Implement DPO fine-tuning on a pairwise preference dataset", "Evaluate reward model scoring consistency"]},
                {"theme": "High-Availability ML Infrastructure & Kubernetes", "topics": ["KNative & Serverless Model Serving", "Kubernetes GPU Sharing & Time-Slicing", "Multi-Cluster Inference Routing", "Zero-Downtime Model Swapping", "Disaster Recovery for ML Infrastructure"], "activities": ["Configure Kubernetes GPU time-slicing for cost efficiency", "Deploy serverless model autoscaling based on queue depth", "Test zero-downtime model artifact upgrades"]},
                {"theme": "Synthetic Data Generation & Data Augmentation", "topics": ["Data Scarcity & Synthetic Data Generation", "Generative Adversarial Networks (GANs) & VAEs", "Tabular Synthetic Data with CTGAN", "Data Augmentation Strategies for Computer Vision", "Evaluating Synthetic Data Quality & Fidelity"], "activities": ["Generate synthetic tabular records with CTGAN", "Evaluate synthetic data statistical parity against real data", "Apply advanced image augmentation using Albumentations"]},
                {"theme": "Advanced MLOps CI/CD Automation & GitOps", "topics": ["GitOps Principles for Machine Learning (ArgoCD)", "Declarative Model Deployment Configurations", "Automated Canary Analysis & Statistical Validation", "Continuous Model Retraining on Live Data Streams", "Managing ML Infrastructure as Code with Terraform"], "activities": ["Configure ArgoCD for declarative model deployments", "Automate canary release promotion based on error metrics", "Provision cloud GPU compute clusters using Terraform"]},
                {"theme": "AI Safety, Bias Auditing & Compliance", "topics": ["Algorithmic Fairness Metrics (Demographic Parity, Equalized Odds)", "Auditing Models for Disparate Impact", "Explainable AI (XAI) in Regulated Industries", "Compliance with Global AI Regulations (EU AI Act)", "Model Governance Documentation & Transparency Cards"], "activities": ["Conduct a disparate impact audit on a scoring model", "Mitigate algorithmic bias using pre/in-processing techniques", "Create a comprehensive model governance card for compliance"]},
                {"theme": "Enterprise AI Engineering Strategy & Economics", "topics": ["Evaluating Build vs Buy for ML Solutions", "Estimating Infrastructure & GPU Cloud Costs", "Measuring ML Model ROI & Business Value Attribution", "Structuring Cross-Functional Data & ML Teams", "Designing Multi-Year AI Roadmaps"], "activities": ["Build a cloud compute cost projection model for ML workloads", "Draft an enterprise AI strategy memo for executive review", "Define business impact KPIs for an operational ML initiative"]},
                {"theme": "Thought Leadership & Open Source Contribution", "topics": ["Contributing to Major ML Libraries (PyTorch, Scikit-Learn, MLflow)", "Authoring High-Impact Technical Whitepapers & Posts", "Speaking at ML Conferences & Meetups", "Mentoring Engineering Teams on MLOps Best Practices", "Building Reusable Internal Tooling Libraries"], "activities": ["Submit a pull request to an open source ML repository", "Publish a comprehensive deep-dive blog post on model serving", "Lead an engineering brown-bag on scalable ML architecture"]},
                {"theme": "Final Senior AI/ML Engineer Portfolio & Placement", "topics": ["Consolidating Senior ML Architecture Portfolio", "Mastering Advanced ML System Design Interviews", "Handling Distributed Systems & Trade-Off Questions", "Executive Communication for Technical Leaders", "Negotiating Senior & Staff ML Engineer Roles"], "activities": ["Deliver an end-to-end production MLOps architecture review", "Complete 5 mock Senior ML System Design interviews", "Finalize career placement strategy and application materials"]}
            ]

    # -------------------------------------------------------------------------
    # 4. Career Goal: Software Developer
    # Focus: Programming, DSA, OOP, databases, software projects
    # -------------------------------------------------------------------------
    if career_goal == "Software Developer" or (interest == "Python" and career_goal not in ["Data Analyst", "AI/ML Engineer", "Full Stack Developer"]):
        if skill_level == "Beginner":
            return [
                {"theme": "Programming Foundations & Algorithmic Thinking", "topics": ["Python Setup, CLI & Virtual Environments", "Variables, Dynamic Typing & Expressions", "Control Flow (if, elif, else)", "While & For Loops with Range", "Writing Reusable Functions"], "activities": ["Write a terminal-based unit converter", "Build an interactive number guessing game", "Practice 5 algorithmic string and math challenges"]},
                {"theme": "Core Data Structures & Collections", "topics": ["Lists, Indexing, Slicing & Operations", "Tuples & Immutability Concepts", "Dictionaries & Key-Value Lookups", "Sets, Uniqueness & Set Algebra", "List & Dictionary Comprehensions"], "activities": ["Build a student grade management script", "Filter duplicates from contact records using sets", "Count word frequencies in a text file using dictionaries"]},
                {"theme": "Modular Code, Packages & Exception Handling", "topics": ["Defining Functions with *args and **kwargs", "Variable Scope (LEGB Rule)", "Writing and Importing Custom Modules", "Exception Handling (try, except, finally)", "Custom Exception Types"], "activities": ["Organize code into modular helper files", "Implement custom error handling for user inputs", "Build a modular calculator with input guards"]},
                {"theme": "Object-Oriented Programming (OOP) Essentials", "topics": ["Classes, Objects & Attributes", "Instance Methods & Constructor (__init__)", "Encapsulation & Private Attributes", "Class vs Instance Variables", "String Representation (__str__, __repr__)"], "activities": ["Build a Bank Account class with balance validation", "Create an Inventory Item management class", "Write unit tests verifying class instance behavior"]},
                {"theme": "Advanced OOP: Inheritance & Polymorphism", "topics": ["Class Inheritance & Code Reuse", "Method Overriding & super() Mechanics", "Polymorphism & Interface Design", "Property Decorators (@property, @setter)", "Composition vs Inheritance"], "activities": ["Implement a Vehicle class hierarchy (Car, Truck, Bike)", "Refactor duplicate procedural code into base classes", "Use property getters/setters for data validation"]},
                {"theme": "File I/O & Working with Data Formats", "topics": ["Reading and Writing Plain Text Files", "Context Managers (with statement)", "Parsing and Writing JSON Files", "Working with CSV Data using csv module", "File System Operations with pathlib"], "activities": ["Build a file-based task organizer saving to JSON", "Parse a user directory and summarize file extensions", "Write a CSV reader calculating column averages"]},
                {"theme": "Data Structures & Algorithms (DSA): Foundations", "topics": ["Algorithm Efficiency & Big-O Notation Intuition", "Linear Search vs Binary Search", "Sorting Algorithms (Bubble, Selection, Built-in Timsort)", "Stack & Queue Data Structures", "Recursion Fundamentals"], "activities": ["Implement binary search on sorted lists", "Build a browser history simulator using stacks", "Write a recursive factorial and Fibonacci function"]},
                {"theme": "Automated Software Testing with Pytest", "topics": ["Importance of Testing in Software Development", "Writing Test Functions with Pytest", "Assert Statements & Test Discovery", "Pytest Fixtures for Setup and Teardown", "Testing for Expected Exceptions"], "activities": ["Write a comprehensive pytest suite for previous classes", "Use fixtures to supply mock test data", "Achieve >85% test coverage on utility functions"]},
                {"theme": "Relational Databases with SQLite", "topics": ["Relational Database Basics & SQL Queries", "Python sqlite3 Module Fundamentals", "Creating Tables, Inserting & Querying Records", "Parameterized Queries & Preventing SQL Injection", "Database Transactions (commit, rollback)"], "activities": ["Create a local SQLite database for task records", "Write safe parameterized INSERT and UPDATE queries", "Implement a database manager class with context managers"]},
                {"theme": "Networking & Consuming REST APIs", "topics": ["HTTP Protocol Basics (GET, POST, Status Codes)", "Making HTTP Requests with requests/urllib", "Parsing JSON Responses from Web APIs", "Handling Network Timeouts & Errors", "Authentication with API Keys"], "activities": ["Build a CLI weather forecast tool fetching public APIs", "Fetch and display top news stories from an open API", "Handle connection timeouts gracefully with retries"]},
                {"theme": "Building Modular Software Applications", "topics": ["Command-Line Arguments with argparse", "Structuring a Clean CLI User Interface", "Terminal Formatting, Colors & Progress Bars", "Packaging as an Executable Script (__main__.py)", "Configuring Environment Variables"], "activities": ["Convert the task manager into a rich argparse CLI tool", "Add colorful terminal status outputs", "Package project with entry-point configuration"]},
                {"theme": "Software Engineering Capstone & Git Code Hygiene", "topics": ["PEP 8 Style Guide & Linters (Flake8, Black)", "Git Version Control (commit, branch, merge)", "Writing Clear README Documentation", "Virtual Environments & requirements.txt", "Publishing Portfolio Repositories on GitHub"], "activities": ["Format and lint the entire project codebase with Black", "Initialize Git repository with structured commit history", "Publish capstone project with architectural documentation on GitHub"]},
                {"theme": "Intermediate Data Structures & Hash Maps", "topics": ["Hash Table Mechanics & Collision Resolution", "Python collections (namedtuple, defaultdict, Counter)", "Linked Lists Implementation", "Tree Structures & Binary Search Trees (BST)", "Practical Algorithm Applications"], "activities": ["Implement a singly linked list from scratch in Python", "Solve 5 coding interview challenges using Hash Maps", "Use defaultdict and Counter to optimize frequency counting"]},
                {"theme": "Intermediate Algorithms: Divide & Conquer", "topics": ["Merge Sort & Quick Sort Mechanics", "Two-Pointer Technique for Array Problems", "Sliding Window Algorithm Patterns", "Greedy Algorithms Intuition", "Time and Space Complexity Analysis"], "activities": ["Implement Merge Sort and benchmark against built-in sorted()", "Solve 3 Two-Pointer algorithm problems", "Implement a sliding window solution for substring problems"]},
                {"theme": "Advanced Python Constructs & Decorators", "topics": ["First-Class Functions & Closures", "Writing Custom Decorators (@wraps)", "Decorators with Arguments", "Generators, Iterators & yield Keyword", "Memory-Efficient Large Data Streaming"], "activities": ["Build a custom execution timing decorator", "Create a logging and access-control decorator", "Write a generator streaming 100,000 synthetic records"]},
                {"theme": "Web API Fundamentals with FastAPI", "topics": ["Modern Web Architecture (Client-Server)", "FastAPI Framework Setup & First Routes", "Path & Query Parameters", "Pydantic Models for Request Body Validation", "Automatic Swagger/OpenAPI Documentation"], "activities": ["Build a RESTful task management API with FastAPI", "Define Pydantic schemas validating input payloads", "Test API routes interactively in Swagger UI"]},
                {"theme": "Database ORM with SQLAlchemy", "topics": ["Object-Relational Mapping (ORM) Principles", "SQLAlchemy Core vs ORM Models", "Defining One-to-Many & Many-to-Many Relationships", "Querying, Filtering & Joining with ORM", "Database Migrations with Alembic Intro"], "activities": ["Define SQLAlchemy models for user and task entities", "Perform CRUD operations via SQLAlchemy session", "Configure Alembic to manage database schema updates"]},
                {"theme": "API Authentication & Security Best Practices", "topics": ["Password Hashing (bcrypt/passlib)", "JSON Web Tokens (JWT) for Authentication", "Protecting API Endpoints with Dependency Injection", "CORS Headers & Web Security Basics", "Input Sanitization & Injection Prevention"], "activities": ["Implement secure user signup and login with hashed passwords", "Protect sensitive API routes using JWT token validation", "Configure CORS middleware for frontend access"]},
                {"theme": "Asynchronous Programming in Python", "topics": ["Concurrency vs Parallelism Intuition", "Asyncio Event Loop, Coroutines & await", "Concurrent HTTP Requests with httpx/aiohttp", "Handling Async Tasks & Gather", "When to Use Async vs Multithreading"], "activities": ["Build an asynchronous web scraper fetching 20 URLs concurrently", "Benchmark synchronous vs asynchronous API request latency", "Refactor FastAPI routes to leverage async database drivers"]},
                {"theme": "Containerization with Docker", "topics": ["Docker Concepts (Images, Containers, Volumes)", "Writing a Clean Python Dockerfile", "Managing Dependencies in Docker Containers", "Docker Compose for Multi-Container Apps (App + DB)", "Container Best Practices for Python Developers"], "activities": ["Write a production-ready Dockerfile for a FastAPI service", "Run application and PostgreSQL database with Docker Compose", "Verify containerized application health and test execution"]},
                {"theme": "CI/CD & Automated Testing Pipelines", "topics": ["Continuous Integration (CI) Principles", "Automating Tests with GitHub Actions", "Configuring Linting & Formatting Checks in CI", "Environment Secrets Management in CI/CD", "Automated Release Tagging"], "activities": ["Write a GitHub Actions workflow running pytest on every push", "Configure automated lint checks blocking failing PRs", "Test automated build pipeline end-to-end"]},
                {"theme": "Design Patterns in Python", "topics": ["Software Design Patterns Overview", "Creational Patterns (Factory, Singleton)", "Structural Patterns (Adapter, Decorator, Facade)", "Behavioral Patterns (Observer, Strategy)", "Refactoring Procedural Code to Design Patterns"], "activities": ["Implement the Factory pattern to create different notification types", "Build a Strategy pattern for interchangeable payment methods", "Refactor messy conditional logic using the State pattern"]},
                {"theme": "System Design Basics & Scalability", "topics": ["Monolithic vs Microservice Architecture", "Caching Strategies with Redis (In-Memory)", "Database Indexing & Query Optimization", "Load Balancing & Horizontal Scaling Concepts", "Writing Architecture Decision Records (ADRs)"], "activities": ["Integrate Redis caching to speed up slow database queries", "Profile and optimize an un-indexed SQL query", "Author an Architectural Decision Record for a web service"]},
                {"theme": "Capstone Software Project & Career Portfolio", "topics": ["Assembling a Complete Full-Stack/Backend Project", "Writing Comprehensive Architecture Documentation", "Software Developer Coding Interview Preparation", "Behavioral Interview Prep (STAR Method)", "Resume & LinkedIn Alignment for Developer Roles"], "activities": ["Complete a fully tested, containerized software application", "Publish repository with comprehensive README and test badges", "Practice 10 technical coding interview challenges"]}
            ]
        else: # Intermediate / Advanced Software Developer
            return [
                {"theme": "Advanced Python Constructs & Metaprogramming", "topics": ["CPython Execution Model & Bytecode", "Descriptors Protocol (__get__, __set__)", "Metaclasses & Dynamic Class Creation", "Context Managers with contextlib", "Memory Optimization & __slots__"], "activities": ["Build a custom data validation framework using descriptors", "Implement a dynamic class registry metaclass", "Profile memory usage of objects using __slots__"]},
                {"theme": "Software Architecture & Domain-Driven Design", "topics": ["Clean Architecture & Onion Architecture", "Separation of Concerns & Dependency Inversion", "Domain Entities, Repositories & Services", "Repository Pattern with SQLAlchemy", "Decoupling Business Logic from Frameworks"], "activities": ["Architect a modular Python service using Clean Architecture", "Implement the Repository Pattern separating ORM from business rules", "Write isolated unit tests with mock repositories"]},
                {"theme": "Concurrent & Distributed Programming", "topics": ["Threading vs Multiprocessing in Python", "Global Interpreter Lock (GIL) Implications", "Asyncio Internals & Custom Event Loops", "Distributed Task Queues with Celery & Redis", "Handling Deadlocks, Race Conditions & Locks"], "activities": ["Implement a distributed background task worker with Celery", "Benchmark CPU-bound multiprocessing vs I/O-bound asyncio", "Implement distributed locking with Redis for shared resources"]},
                {"theme": "Advanced API Engineering & Microservices", "topics": ["REST vs gRPC in Microservice Architectures", "High-Throughput Services with FastAPI & Pydantic v2", "Protocol Buffers (Protobuf) Serialization", "Distributed Tracing with OpenTelemetry", "API Rate Limiting & Resilience Patterns"], "activities": ["Build a high-performance gRPC microservice in Python", "Instrument FastAPI services with OpenTelemetry tracing", "Implement sliding-window rate limiting middleware"]},
                {"theme": "Database Performance Tuning & Scalability", "topics": ["PostgreSQL Query Planner & EXPLAIN ANALYZE", "B-Tree, GIN & GiST Indexing Strategies", "Database Connection Pooling & PgBouncer", "Read Replicas & Read/Write Splitting", "Database Migrations at Scale with Zero Downtime"], "activities": ["Optimize complex queries using EXPLAIN ANALYZE", "Configure connection pooling for high-concurrency loads", "Execute a zero-downtime database column migration"]},
                {"theme": "Software Testing Strategies & Mocking", "topics": ["Test-Driven Development (TDD) Workflows", "Integration vs Unit vs End-to-End Testing", "Advanced Mocking & Monkeypatching in Pytest", "Contract Testing with Pact", "Mutation Testing for Test Quality Verification"], "activities": ["Implement a complete feature using strict TDD", "Build an automated integration test suite with Docker containers", "Run mutation testing to identify untested edge cases"]},
                {"theme": "Container Orchestration & Cloud Infrastructure", "topics": ["Kubernetes Concepts (Pods, Deployments, Services)", "Configuring Helm Charts for Python Applications", "Horizontal Pod Autoscaling (HPA)", "Infrastructure as Code (Terraform) Basics", "Cloud Deployment on AWS/GCP/Azure"], "activities": ["Deploy a containerized Python service to a local Kubernetes cluster", "Configure auto-scaling based on CPU and request latency", "Provision cloud infrastructure using Terraform scripts"]},
                {"theme": "Security Engineering & Hardening", "topics": ["OWASP Top 10 for Backend Engineers", "Cryptographic Operations (Hashing, HMAC, AES)", "Secret Management (HashiCorp Vault / Cloud Secrets)", "Preventing SSRF, XSS & Deserialization Attacks", "Automated Security Auditing with Bandit & Safety"], "activities": ["Perform an automated vulnerability scan with Bandit", "Implement secure encrypted payload storage with AES", "Integrate automated secret scanning into CI pipelines"]},
                {"theme": "Observability, Telemetry & SRE Principles", "topics": ["Three Pillars of Observability (Metrics, Logs, Traces)", "Prometheus Metric Instrumentation in Python", "Centralized Structured Logging with JSON & Loki", "Alerting Rules & Incident Response", "Defining Service Level Indicators (SLIs) and SLOs"], "activities": ["Instrument Python endpoints with Prometheus metrics", "Configure Grafana dashboards displaying P95/P99 latency", "Define error budget and alerting rules for production outages"]},
                {"theme": "System Design & Distributed Consensus", "topics": ["CAP Theorem & PACELC Implications", "Eventual Consistency vs Strong Consistency", "Event Sourcing & CQRS Architecture", "Distributed Transactions & Saga Pattern", "Message Brokers (Kafka/RabbitMQ) Internals"], "activities": ["Design an event-driven ordering system with Kafka", "Implement a compensating transaction Saga pattern", "Document distributed system failure modes and mitigations"]},
                {"theme": "Performance Profiling & Optimization", "topics": ["Profiling Tools (cProfile, Py-Spy, Scalene)", "Identifying CPU & Memory Bottlenecks", "Cython & C-Extensions for Python", "Vectorization & JIT Compilation with Numba", "Zero-Copy I/O and Memory-Mapped Files"], "activities": ["Profile a slow computation and speed it up by 5x", "Compile a critical loop using Cython or Numba", "Benchmark memory retention and fix object leaks"]},
                {"theme": "Capstone Architecture & Production Deployment", "topics": ["End-to-End Scalable System Capstone", "Blue/Green and Canary Deployment Strategies", "Load Testing with Locust at 1,000+ RPS", "Writing Production Architecture Documentation", "Technical Leadership & System Design Interviews"], "activities": ["Execute load testing simulating 1,000 RPS on the capstone", "Deploy a zero-downtime blue/green release", "Complete 5 mock Senior System Design interviews"]},
                {"theme": "Enterprise Caching & Data Grids", "topics": ["Cache Invalidation Strategies (Cache-Aside, Write-Through)", "Redis Cluster Architecture & Sharding", "Handling Cache Stampedes & Dogpiling", "Distributed Session Management", "CDN Edge Caching"], "activities": ["Implement cache-aside pattern with TTL and mutex locks", "Benchmark cache hit vs miss latency on database queries", "Configure multi-tier caching across edge and application layers"]},
                {"theme": "High-Throughput Event Streaming", "topics": ["Apache Kafka Architecture (Topics, Partitions, Consumer Groups)", "Building Reliable Kafka Consumers in Python", "Handling Exactly-Once vs At-Least-Once Delivery", "Schema Registry with Avro / Protobuf", "Dead-Letter Queues for Event Failures"], "activities": ["Implement high-throughput event producer and consumer in Python", "Enforce event schema validation with Schema Registry", "Build automated dead-letter queue reprocessing"]},
                {"theme": "Resilience & Chaos Engineering", "topics": ["Fault Tolerance & Circuit Breaker Pattern", "Retry Policies with Exponential Backoff and Jitter", "Bulkhead Isolation in Microservices", "Chaos Engineering Principles (Simulating Outages)", "Graceful Degradation Strategies"], "activities": ["Implement a Circuit Breaker protecting external API dependencies", "Simulate network partitions and verify system resilience", "Conduct chaos experiment testing database failover"]},
                {"theme": "API Gateway & Service Mesh Architecture", "topics": ["API Gateway Functions (Routing, Rate Limiting, Auth)", "Service Mesh Concepts (Istio / Envoy)", "mTLS Security Between Microservices", "Traffic Splitting for Canary Deployments", "Centralized Ingress Configuration"], "activities": ["Configure an API Gateway routing traffic to Python services", "Implement token-bucket rate limiting at the gateway level", "Configure canary traffic routing (90% stable, 10% canary)"]},
                {"theme": "Large-Scale Data Processing with Python", "topics": ["Batch Processing Architectures", "Distributed Processing with PySpark & Dask", "Optimizing Distributed Joins and Shuffles", "Parquet Columnar Storage Optimization", "Connecting Spark to Distributed Storage"], "activities": ["Process a 50GB dataset using PySpark transformations", "Benchmark Parquet vs CSV query speed and compression", "Optimize skewed joins using broadcast joins"]},
                {"theme": "Serverless & Cloud-Native Architectures", "topics": ["Serverless Computing Concepts (AWS Lambda, Google Cloud Functions)", "Cold Starts & Optimizing Python Serverless Packages", "Event-Driven Serverless Workflows (S3/SQS Triggers)", "Step Functions & State Machines", "Serverless Framework / SAM"], "activities": ["Deploy a serverless Python image processing pipeline", "Optimize cold start latency by trimming dependencies", "Build an automated event-driven state machine"]},
                {"theme": "Advanced Database Internals & NoSQL", "topics": ["Relational vs Document vs Key-Value vs Graph Databases", "MongoDB Schema Design & Aggregation Pipelines", "Redis Data Structures (HyperLogLog, Geospatial, Streams)", "Graph Databases (Neo4j) for Connected Data", "Choosing the Right Storage Engine for the Job"], "activities": ["Build a social network graph query in Neo4j", "Implement real-time leaderboard using Redis Sorted Sets", "Design a MongoDB aggregation pipeline for user activity"]},
                {"theme": "Developer Tooling & Platform Engineering", "topics": ["Building Internal Developer Platforms (IDPs)", "Creating Custom CLI Tools for Engineering Teams", "Automating Development Environments with Devcontainers", "Managing Monorepos with Pants / Poetry", "Setting Up Pre-Commit Hooks & Quality Gates"], "activities": ["Build a custom Python CLI automating developer workflows", "Configure a standardized devcontainer for the team", "Set up pre-commit hooks enforcing strict type and lint checks"]},
                {"theme": "Technical Debt Management & Refactoring", "topics": ["Identifying Code Smells & Architectural Debt", "Refactoring Monoliths into Modular Services", "Strangler Fig Pattern for Legacy Migration", "Measuring Code Health & Maintainability Index", "Balancing Feature Velocity with Code Quality"], "activities": ["Apply the Strangler Fig pattern to extract a legacy service", "Refactor a 500-line monolithic function into clean modules", "Author a technical debt remediation roadmap"]},
                {"theme": "Open Source Contribution & Ecosystem Leadership", "topics": ["Navigating Open Source Codebases", "Writing High-Quality Pull Requests & Tests", "Communicating with Maintainers & Issue Triage", "Packaging and Publishing Libraries to PyPI", "Licensing & Open Source Governance"], "activities": ["Submit a validated pull request to an open source Python library", "Package and publish a reusable utility library to PyPI", "Write comprehensive documentation and continuous testing for the library"]},
                {"theme": "Engineering Management & Architectural Leadership", "topics": ["Leading Architecture Reviews & RFC Processes", "Mentoring Junior and Mid-Level Developers", "Technical Interview Design & Hiring Standards", "Balancing Trade-offs in System Architecture", "Communicating Technical Strategy to Executives"], "activities": ["Write a Request for Comments (RFC) for a major system change", "Conduct a structured mock technical interview with rubric", "Deliver an architectural roadmap presentation"]},
                {"theme": "Final Senior Software Engineering Showcase", "topics": ["Synthesizing Full Architectural Portfolio", "Senior Coding & System Design Interview Mastery", "Navigating Complex Technical Scenarios", "Negotiating Senior Software Engineering Offers", "Long-Term Career Strategy & Continuous Learning"], "activities": ["Deliver a comprehensive system design showcase to peer review", "Complete 5 mock senior-level technical interviews", "Finalize career placement strategy and application materials"]}
            ]

    # -------------------------------------------------------------------------
    # 5. Fallback / Universal Modular Track
    # -------------------------------------------------------------------------
    curriculum = []
    for w in range(1, 25):
        if w <= 6:
            theme = f"Week {w}: {interest} Core Concepts & Foundations" if w <= 3 else f"Week {w}: Applied {interest} Practice"
            topics = [f"{interest} Environment & Tooling", f"Foundational Syntax & Data Structures ({w})", f"Logic, Control Flow & Operations ({w})", f"Modular Code Structure", f"Error Handling & Input Validation"]
            activities = [f"Complete 3 guided coding exercises on {interest}", f"Build a practical utility applying week {w} concepts", f"Write automated tests verifying function correctness"]
        elif w <= 12:
            theme = f"Week {w}: Structured {interest} Algorithms & Integration" if w <= 9 else f"Week {w}: Data Persistence & API Design"
            topics = [f"Intermediate {interest} Paradigms", f"Data Structures & Algorithm Patterns ({w})", f"Working with External APIs & Data", f"Automated Testing Suites", f"Database Integration Basics"]
            activities = [f"Build an end-to-end module connecting to data sources", f"Write unit test suites achieving >80% coverage", f"Optimize algorithmic complexity of core functions"]
        elif w <= 18:
            theme = f"Week {w}: Performance Optimization & Testing" if w <= 15 else f"Week {w}: Deployment & Cloud Architecture"
            topics = [f"Performance Profiling & Bottleneck Analysis", f"Modular Architecture for {career_goal} Roles", f"Security Hardening & Best Practices", f"Containerization with Docker", f"Automated CI/CD Workflows"]
            activities = [f"Profile application execution and eliminate bottlenecks", f"Dockerize application environment for consistent deployment", f"Automate build and test pipelines with GitHub Actions"]
        else:
            theme = f"Week {w}: Capstone Development & Portfolio Refinement"
            topics = [f"Full Integration for {career_goal} Roles", f"Code Review & Documentation Hygiene", f"Technical Interview Preparation", f"System Architecture Review", f"Portfolio Deployment & Publishing"]
            activities = [f"Complete feature-complete capstone project deliverables", f"Author professional documentation and README", f"Practice technical problem-solving interview scenarios"]
            
        curriculum.append({
            "theme": theme,
            "topics": topics,
            "activities": activities
        })
        
    return curriculum


# Mini-project generator tailored to (interest, skill_level, career_goal)
def get_tailored_mini_project(interest: str, skill_level: str, career_goal: str) -> Dict[str, Any]:
    """Generates a contextualized mini-project matching the user's specific career trajectory."""
    
    if career_goal == "Data Analyst" or interest == "Data Analytics":
        return {
            "title": "Enterprise Sales, Retention & Business Intelligence Dashboard",
            "description": "Design an analytical data model using SQL queries, analyze sales and churn patterns in Excel/Pandas, and build an interactive visualization dashboard presenting strategic growth recommendations.",
            "deliverables": [
                "Multi-table relational SQL query suite with CTEs and analytical window functions",
                "Data cleaning and metric transformation pipeline in Excel / Pandas",
                "Interactive visualization dashboard (Power BI / Streamlit) tracking core KPIs",
                "Executive briefing outlining 3 strategic commercial recommendations"
            ],
            "career_relevance": "Demonstrates the essential technical triad of modern analytics: advanced SQL extraction, structured business metrics calculation, and visual data storytelling."
        }
        
    if career_goal == "Full Stack Developer" or interest == "Web Development":
        return {
            "title": "Full-Stack Interactive Task & Community Portal",
            "description": "Engineer a responsive web application featuring React component architecture, RESTful API endpoints with FastAPI, persistent database storage, and secure token authentication.",
            "deliverables": [
                "Responsive React frontend styled with modern CSS layouts (Flexbox & CSS Grid)",
                "RESTful backend API with Pydantic request validation and clean route separation",
                "Persistent relational database storage with parameterized SQL queries",
                "Automated test coverage validating frontend interactions and backend API endpoints"
            ],
            "career_relevance": "Directly proves end-to-end web engineering capabilities: frontend state management, API design, database modeling, and authentication."
        }

    if career_goal == "AI/ML Engineer" or interest in ["Machine Learning", "Artificial Intelligence"]:
        return {
            "title": "Production-Ready ML Prediction Service & Pipeline",
            "description": "Engineer a complete machine learning pipeline that ingests raw data, performs automated feature transformations, trains an optimized predictive model, and serves real-time inferences through a containerized FastAPI endpoint.",
            "deliverables": [
                "Scikit-learn / XGBoost training pipeline with cross-validation and hyperparameter tuning",
                "Model evaluation report analyzing ROC-AUC, precision, and recall trade-offs",
                "FastAPI inference endpoint returning real-time predictions and probability confidence",
                "Containerized Docker setup ensuring reproducible deployments across environments"
            ],
            "career_relevance": "Directly showcases your skills across the full ML engineering lifecycle: data transformation, model tuning, API deployment, and containerization."
        }

    if career_goal == "Software Developer" or interest == "Python":
        return {
            "title": "Modular Task & Workflow Management Application",
            "description": "Develop a production-grade software application using clean object-oriented Python, SQLite database persistence, automated Pytest coverage (>80%), modular CLI/API interface, and structured logging.",
            "deliverables": [
                "Clean object-oriented architecture following PEP 8 style standards",
                "Persistent relational database storage with SQLite and parameterized queries",
                "Automated unit test suite with >80% test coverage using pytest",
                "Interactive CLI and modular architecture ready for API expansion"
            ],
            "career_relevance": "Proves core software engineering fundamentals, database interactions, testing discipline, and clean code hygiene expected in software developer technical interviews."
        }

    # Default fallback project matching interest and goal
    return {
        "title": f"Applied {interest} Portfolio Project for {career_goal} Roles",
        "description": f"Build a feature-complete application utilizing {interest} tailored for {career_goal} positions, incorporating clean architecture, automated testing, and comprehensive documentation.",
        "deliverables": [
            f"Modular code structure adhering to industry best practices in {interest}",
            "Automated test coverage validating business logic and edge cases",
            "Interactive demonstration interface or command-line interface",
            "Comprehensive README detailing setup, architecture, and key findings"
        ],
        "career_relevance": f"Provides a tangible code asset directly aligned with technical requirements for {career_goal} job applications."
    }


# Career Milestones mapped to Career Goal and Skill Level
def get_career_milestone(career_goal: str, skill_level: str, interest: str) -> Dict[str, Any]:
    """
    Generates realistic, career-aligned milestones based on BOTH career goal and skill level.
    Strictly follows tier prefixes:
    - Beginner: Foundation Completion
    - Intermediate: Project Development
    - Advanced: Portfolio and Specialization
    Never assigns senior leadership milestones to beginner or intermediate learners!
    """
    if skill_level == "Beginner":
        if career_goal == "Data Analyst":
            return {
                "title": "Foundation Completion: Associate Data Analyst Readiness",
                "description": "Master the foundational triad of data analysis: Excel spreadsheet modeling, SQL data extraction, and visual reporting. Consolidate your core skills and prepare for entry-level analyst screenings.",
                "action_items": [
                    "Publish 2-3 documented data analysis projects on GitHub with clear business takeaways",
                    "Demonstrate SQL proficiency by solving 25+ SQL query challenges (joins, aggregations)",
                    "Create interactive dashboards in Excel / Power BI showcasing key business metrics",
                    "Prepare for entry-level Data Analyst interviews by practicing case study presentations"
                ]
            }
        elif career_goal == "Software Developer":
            return {
                "title": "Foundation Completion: Junior Software Developer Portfolio",
                "description": "Master programming fundamentals, object-oriented design, core data structures, and database persistence. Publish a clean GitHub code repository demonstrating software engineering readiness.",
                "action_items": [
                    "Publish a modular, tested application with clean Git commits and an architectural README",
                    "Solve 25+ foundational coding challenges focusing on data structures and algorithms",
                    "Write unit tests verifying core logic with >80% coverage using Pytest",
                    "Practice explaining code structure, OOP principles, and problem-solving trade-offs"
                ]
            }
        elif career_goal == "Full Stack Developer":
            return {
                "title": "Foundation Completion: Junior Full Stack Developer Readiness",
                "description": "Master HTML5, CSS3, JavaScript, React components, and backend API integration. Build and deploy a connected full-stack application.",
                "action_items": [
                    "Build and deploy an interactive web application with React and a RESTful backend API",
                    "Implement relational database persistence and safe CRUD operations",
                    "Write clean, modular frontend components with responsive CSS styling",
                    "Publish project code on GitHub with live demonstration links"
                ]
            }
        elif career_goal == "AI/ML Engineer":
            return {
                "title": "Foundation Completion: Junior AI/ML Practitioner",
                "description": "Master applied math, machine learning algorithms, Scikit-Learn pipelines, and model deployment via REST APIs. Demonstrate evaluation rigor and deploy an end-to-end model service.",
                "action_items": [
                    "Publish 2 trained ML models with clean evaluation metrics and confusion matrices on GitHub",
                    "Demonstrate data preprocessing, feature engineering, and cross-validation techniques",
                    "Expose a trained model via a containerized REST API endpoint",
                    "Practice answering core machine learning concept questions (bias-variance, metrics)"
                ]
            }
        else: # Other
            return {
                "title": f"Foundation Completion: {interest} Practical Readiness",
                "description": f"Consolidate your core {interest} knowledge into demonstrable projects and establish your technical presence.",
                "action_items": [
                    f"Publish a documented project repository demonstrating core {interest} competence",
                    "Complete targeted coding exercises proving problem-solving skills",
                    "Document your learning path and project insights in a technical write-up",
                    "Establish an online developer profile showcasing code samples"
                ]
            }

    elif skill_level == "Intermediate":
        if career_goal == "Data Analyst":
            return {
                "title": "Project Development: Data Analyst Technical & Dashboard Proficiency",
                "description": "Elevate your analytical portfolio to demonstrate advanced SQL window functions, statistical inference, predictive analytics, and executive business communication.",
                "action_items": [
                    "Build an end-to-end analytical pipeline with advanced SQL (CTEs, Window Functions)",
                    "Design an interactive executive KPI dashboard with business impact recommendations",
                    "Complete 10 mock live SQL coding and data case study interview challenges",
                    "Author a technical project debrief translating data insights into measurable ROI"
                ]
            }
        elif career_goal == "Software Developer":
            return {
                "title": "Project Development: Software Engineering & System Integration",
                "description": "Elevate your software projects to demonstrate automated testing, database ORM integration, API security, and containerized deployment for professional developer roles.",
                "action_items": [
                    "Build an end-to-end application with automated test suites achieving >80% coverage",
                    "Implement a secure RESTful API and relational database layer with ORM",
                    "Practice 15+ intermediate data structure and coding interview challenges",
                    "Containerize your application with Docker and set up automated CI workflows"
                ]
            }
        elif career_goal == "Full Stack Developer":
            return {
                "title": "Project Development: Full Stack System Architecture & Integration",
                "description": "Architect and deploy full-stack systems with modern state management, robust authentication, database migrations, and CI/CD pipelines.",
                "action_items": [
                    "Deploy a multi-tier full-stack application with automated testing and Docker",
                    "Implement JWT authentication, RBAC authorization, and API route guards",
                    "Optimize database queries with indexing and connection pooling",
                    "Build reusable frontend component libraries with accessible UI"
                ]
            }
        elif career_goal == "AI/ML Engineer":
            return {
                "title": "Project Development: AI/ML Model Deployment & Serving",
                "description": "Demonstrate the ability to train, optimize, containerize, and deploy production machine learning models with experiment tracking and automated validation.",
                "action_items": [
                    "Deploy an ML model behind a REST API (FastAPI) with Docker containerization",
                    "Implement model evaluation pipelines tracking precision, recall, and ROC-AUC trade-offs",
                    "Set up experiment tracking (MLflow) and automated testing for model artifacts",
                    "Practice ML system design and algorithm implementation interview questions"
                ]
            }
        else: # Other
            return {
                "title": f"Project Development: Applied {interest} Professional Competence",
                "description": f"Demonstrate practical competence in {interest} through tested, multi-module applications and technical interview preparation.",
                "action_items": [
                    "Deploy a complete application featuring automated tests and database persistence",
                    "Practice domain-specific problem-solving challenges",
                    "Publish a technical case study walking through architectural decisions",
                    "Prepare for technical interviews and code review walkthroughs"
                ]
            }

    else: # Advanced
        if career_goal == "Data Analyst":
            return {
                "title": "Portfolio and Specialization: Enterprise Analytics & Decision Intelligence",
                "description": "Demonstrate advanced analytical engineering, causal experimentation, dbt data modeling, and strategic executive communication.",
                "action_items": [
                    "Architect scalable analytical models and semantic metric layers using dbt/SQL",
                    "Implement advanced statistical testing and causal experimentation frameworks",
                    "Author executive data memos translating data insights into multi-million dollar ROI",
                    "Lead data governance practices and establish enterprise metric dictionaries"
                ]
            }
        elif career_goal == "Software Developer":
            return {
                "title": "Portfolio and Specialization: Software Architecture & Scalability",
                "description": "Demonstrate advanced software architecture, Clean Architecture, high-throughput concurrency, and distributed system design.",
                "action_items": [
                    "Design and benchmark high-throughput system architecture with caching and concurrency",
                    "Implement automated CI/CD pipelines, container orchestration, and monitoring",
                    "Conduct architectural code reviews and establish engineering standards",
                    "Practice complex distributed system design interview scenarios"
                ]
            }
        elif career_goal == "Full Stack Developer":
            return {
                "title": "Portfolio and Specialization: Cloud-Scale Full Stack Architecture",
                "description": "Design and lead cloud-native full-stack platforms with micro-frontends, event-driven backends, and multi-region deployment.",
                "action_items": [
                    "Architect distributed cloud services with zero-downtime deployment pipelines",
                    "Implement high-concurrency caching, CDN edge distribution, and rate-limiting",
                    "Author Architecture Decision Records (ADRs) for enterprise platforms",
                    "Lead security audits and compliance reviews (OWASP Top 10)"
                ]
            }
        elif career_goal == "AI/ML Engineer":
            return {
                "title": "Portfolio and Specialization: Production MLOps & Distributed AI Systems",
                "description": "Demonstrate end-to-end MLOps architecture, inference optimization (ONNX/quantization), model monitoring, and automated retraining pipelines.",
                "action_items": [
                    "Build automated CI/CD retraining and model monitoring pipelines with drift detection",
                    "Optimize inference latency using model quantization and runtime engines (ONNX/TensorRT)",
                    "Architect scalable ML systems handling real-time data drift and canary deployments",
                    "Lead technical architecture reviews and document production system runbooks"
                ]
            }
        else: # Other
            return {
                "title": f"Portfolio and Specialization: Advanced {interest} Architecture",
                "description": f"Establish domain authority in {interest} with scalable design, performance benchmarking, and technical leadership.",
                "action_items": [
                    "Design and benchmark an advanced system architecture with high test coverage",
                    "Publish an in-depth technical case study on optimization and scalability",
                    "Lead architectural reviews and mentor developers in best practices",
                    "Deliver a technical deep-dive presentation on advanced implementation"
                ]
            }


def generate_learning_path(
    interest: str,
    skill_level: str,
    career_goal: str,
    daily_time: str,
    duration: str,
    name: str = None
) -> Dict[str, Any]:
    """
    Main rule-based generation function.
    Deterministic, transparent pedagogical algorithm combining interest,
    skill level, career goal, schedule, and duration.
    """
    # Safe fallbacks
    safe_interest = interest.strip() if interest else "Python"
    safe_skill = skill_level.strip() if skill_level else "Beginner"
    safe_goal = career_goal.strip() if career_goal else "Software Developer"
    safe_daily = daily_time.strip() if daily_time else "1 hour"
    safe_duration = duration.strip() if duration else "1 month"
    
    # 1. Calculate duration weeks & daily time allocation
    target_weeks = DURATION_WEEKS_MAP.get(safe_duration, 4)
    time_info = DAILY_TIME_METRICS.get(safe_daily, DAILY_TIME_METRICS["1 hour"])
    
    weekly_hours = time_info["weekly_hours"]
    max_topics = time_info["max_topics"]
    max_activities = time_info["max_activities"]
    total_hours = int(weekly_hours * target_weeks)
    
    # 2. Extract 24-week progressive curriculum pool for (interest, skill_level, career_goal)
    curriculum_pool = build_curriculum_pool(safe_interest, safe_skill, safe_goal)
    pool_len = len(curriculum_pool)
    
    # 3. Assemble weekly plan matching EXACTLY target_weeks
    weekly_plan = []
    for i in range(target_weeks):
        # Map week index smoothly across curriculum pool
        if target_weeks <= pool_len:
            item = curriculum_pool[i]
        else:
            item = curriculum_pool[i % pool_len]
            
        week_num = i + 1
        
        # Filter topics and activities according to daily time capacity
        filtered_topics = item.get("topics", [])[:max_topics]
        filtered_activities = (item.get("activities") or item.get("practice_activities") or [])[:max_activities]
        
        # Clean title: e.g. "Week 1: Python Basics & Algorithmic Thinking"
        raw_theme = item.get("theme", item.get("week_theme", "Weekly Learning Focus"))
        clean_theme = raw_theme.split(": ", 1)[-1] if ": " in raw_theme else raw_theme
        week_title = f"Week {week_num}: {clean_theme}"
        
        week_resources = get_resources_for_week(
            theme=clean_theme,
            topics=filtered_topics,
            activities=filtered_activities,
            interest=safe_interest
        )

        topic_references = [
            get_reference_for_topic(topic=t, interest=safe_interest)
            for t in filtered_topics
        ]

        weekly_plan.append({
            "week_number": week_num,
            "title": week_title,
            "focus": clean_theme,
            "topics": filtered_topics,
            "topic_references": topic_references,
            "practice_activities": filtered_activities,
            "resources": week_resources
        })
        
    # 4. Generate tailored mini-project
    mini_project = get_tailored_mini_project(safe_interest, safe_skill, safe_goal)
    
    # 5. Generate career milestone matching skill level and goal
    career_milestone = get_career_milestone(safe_goal, safe_skill, safe_interest)
    
    # 6. Roadmap title
    learner_display_name = name.strip() if name and name.strip() else "Learner"
    roadmap_title = f"{safe_interest} {safe_skill} Pathway to {safe_goal}"
    
    return {
        "status": "success",
        "roadmap": {
            "title": roadmap_title,
            "learner_name": learner_display_name,
            "interest": safe_interest,
            "skill_level": safe_skill,
            "career_goal": safe_goal,
            "daily_time": safe_daily,
            "duration": safe_duration,
            "metrics": {
                "total_estimated_hours": total_hours,
                "weekly_commitment_hours": weekly_hours,
                "total_milestones": target_weeks,
                "pacing_advice": time_info["pacing_advice"]
            },
            "weekly_plan": weekly_plan,
            "mini_project": mini_project,
            "career_milestone": career_milestone
        }
    }
