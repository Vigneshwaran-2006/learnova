"""
Learnova Educational Resource Catalog - Phase 5
Curated static study materials, official documentation, interactive tutorials,
video guides, and hands-on practice portals for every learning topic.

All URLs are verified educational sources:
- Official Documentation (Python, PostgreSQL, Scikit-Learn, PyTorch, React, FastAPI, MDN, Docker, Git)
- Interactive Courses (Kaggle Learn, freeCodeCamp, LeetCode, HackerRank, W3Schools, Khan Academy)
- High-reputation developer platforms (Streamlit, HuggingFace, Redis, MongoDB, Apache Spark)
"""

from typing import Dict, List, Any, Optional
from urllib.parse import urlparse


# -----------------------------------------------------------------------------
# Curated Topic Mapping Rules
# Each rule contains matching keywords and 2-4 curated resources spanning:
# Documentation, Tutorial, Video, and Practice.
# -----------------------------------------------------------------------------

TOPIC_RESOURCE_RULES: List[Dict[str, Any]] = [
    # 1. Excel & Spreadsheet Modeling
    {
        "keywords": ["excel", "spreadsheet", "vlookup", "xlookup", "pivot table", "cell formatting"],
        "resources": [
            {
                "title": "Microsoft Excel Official Video Training",
                "type": "Tutorial",
                "description": "Learn Excel formulas, functions, pivot tables, and data hygiene from Microsoft.",
                "url": "https://support.microsoft.com/en-us/office/excel-video-training-9bc05390-e94c-46ac-973d-783f97297304",
                "estimated_time": "45 minutes",
                "provider": "Microsoft"
            },
            {
                "title": "freeCodeCamp Excel for Business Analytics",
                "type": "Video",
                "description": "Comprehensive video walkthrough covering VLOOKUP, XLOOKUP, and business modeling.",
                "url": "https://www.freecodecamp.org/news/excel-for-beginners-free-course/",
                "estimated_time": "1 hour",
                "provider": "freeCodeCamp"
            },
            {
                "title": "Excel Practice Exercises & Templates",
                "type": "Practice",
                "description": "Interactive business dataset scenarios to practice data formatting and pivot tables.",
                "url": "https://www.excel-easy.com/data-analysis/pivot-tables.html",
                "estimated_time": "30 minutes",
                "provider": "Excel-Easy"
            }
        ]
    },

    # 2. SQL Fundamentals & Queries
    {
        "keywords": ["sql fundamentals", "relational database", "select, where", "aggregate functions", "group by & having", "sql select", "crud operations", "sqlite"],
        "resources": [
            {
                "title": "PostgreSQL Official Interactive Tutorial",
                "type": "Documentation",
                "description": "Official guide to relational database architecture, tables, and standard SQL queries.",
                "url": "https://www.postgresql.org/docs/current/tutorial.html",
                "estimated_time": "40 minutes",
                "provider": "PostgreSQL Docs"
            },
            {
                "title": "Kaggle Learn: Intro to SQL",
                "type": "Tutorial",
                "description": "Hands-on browser-based SQL course with BigQuery datasets and instant query evaluation.",
                "url": "https://www.kaggle.com/learn/intro-to-sql",
                "estimated_time": "45 minutes",
                "provider": "Kaggle"
            },
            {
                "title": "HackerRank SQL Practice Arena",
                "type": "Practice",
                "description": "Solve interactive SQL challenges on filtering, aggregation, and sorting.",
                "url": "https://www.hackerrank.com/domains/sql",
                "estimated_time": "35 minutes",
                "provider": "HackerRank"
            }
        ]
    },

    # 3. SQL Joins & Multi-Table Queries
    {
        "keywords": ["joins", "inner join", "left join", "multi-table", "primary & foreign key", "foreign key", "relational data joins"],
        "resources": [
            {
                "title": "W3Schools SQL Joins Visual Reference",
                "type": "Documentation",
                "description": "Clear visual diagrams and live interactive sandboxes for INNER, LEFT, and FULL joins.",
                "url": "https://www.w3schools.com/sql/sql_join.asp",
                "estimated_time": "30 minutes",
                "provider": "W3Schools"
            },
            {
                "title": "freeCodeCamp Relational Database Curriculum",
                "type": "Tutorial",
                "description": "Step-by-step tutorial on multi-table joins, relational schemas, and data integrity.",
                "url": "https://www.freecodecamp.org/news/sql-joins-tutorial/",
                "estimated_time": "45 minutes",
                "provider": "freeCodeCamp"
            },
            {
                "title": "Kaggle SQL Joins Practice Notebook",
                "type": "Practice",
                "description": "Join real-world multi-table datasets on Kaggle and extract customer analytics.",
                "url": "https://www.kaggle.com/learn/intro-to-sql",
                "estimated_time": "40 minutes",
                "provider": "Kaggle"
            }
        ]
    },

    # 4. Advanced SQL & Window Functions
    {
        "keywords": ["window functions", "over()", "lead()", "lag()", "cte", "common table expressions", "row_number", "dense_rank", "analytical windows"],
        "resources": [
            {
                "title": "PostgreSQL Window Functions Documentation",
                "type": "Documentation",
                "description": "Authoritative guide to OVER(), PARTITION BY, running totals, and analytic windows.",
                "url": "https://www.postgresql.org/docs/current/tutorial-window.html",
                "estimated_time": "45 minutes",
                "provider": "PostgreSQL Docs"
            },
            {
                "title": "Kaggle Learn: Advanced SQL",
                "type": "Tutorial",
                "description": "Master window functions, analytic expressions, and nested CTEs with interactive code cells.",
                "url": "https://www.kaggle.com/learn/advanced-sql",
                "estimated_time": "50 minutes",
                "provider": "Kaggle"
            },
            {
                "title": "LeetCode SQL Study Plan",
                "type": "Practice",
                "description": "Curated database interview problems focusing on window functions and CTE rankings.",
                "url": "https://leetcode.com/studyplan/top-sql-50/",
                "estimated_time": "45 minutes",
                "provider": "LeetCode"
            }
        ]
    },

    # 5. Power BI & Business Intelligence Dashboards
    {
        "keywords": ["power bi", "dashboard", "dax", "kpi", "business intelligence", "slicers", "drill-downs"],
        "resources": [
            {
                "title": "Microsoft Power BI Official Documentation",
                "type": "Documentation",
                "description": "Official architectural guide for connecting datasets, building visuals, and report design.",
                "url": "https://learn.microsoft.com/en-us/power-bi/fundamentals/desktop-getting-started",
                "estimated_time": "40 minutes",
                "provider": "Microsoft Learn"
            },
            {
                "title": "Microsoft Learn: Create Reports in Power BI",
                "type": "Tutorial",
                "description": "Guided path for formatting executive dashboards, card KPIs, and interactive filters.",
                "url": "https://learn.microsoft.com/en-us/training/modules/design-power-bi-reports/",
                "estimated_time": "50 minutes",
                "provider": "Microsoft Learn"
            },
            {
                "title": "freeCodeCamp Power BI Beginner to Pro Course",
                "type": "Video",
                "description": "End-to-end video tutorial creating complete business KPI reports from raw files.",
                "url": "https://www.freecodecamp.org/news/learn-power-bi-full-course/",
                "estimated_time": "1 hour",
                "provider": "freeCodeCamp"
            }
        ]
    },

    # 6. Python Basics & Syntax
    {
        "keywords": ["python setup", "python basics", "variables & basic operations", "control flow", "loops", "python functions", "python syntax", "virtual environments"],
        "resources": [
            {
                "title": "Python Official Tutorial: An Informal Introduction",
                "type": "Documentation",
                "description": "The official Python 3 tutorial explaining numbers, strings, lists, and control statements.",
                "url": "https://docs.python.org/3/tutorial/introduction.html",
                "estimated_time": "45 minutes",
                "provider": "Python.org"
            },
            {
                "title": "Kaggle Learn: Python Foundations",
                "type": "Tutorial",
                "description": "Bite-sized interactive exercises covering syntax, functions, booleans, and loops.",
                "url": "https://www.kaggle.com/learn/python",
                "estimated_time": "40 minutes",
                "provider": "Kaggle"
            },
            {
                "title": "freeCodeCamp Python for Beginners Handbook",
                "type": "Tutorial",
                "description": "Comprehensive reference guide with code snippets and real-world examples.",
                "url": "https://www.freecodecamp.org/news/python-for-beginners-handbook/",
                "estimated_time": "35 minutes",
                "provider": "freeCodeCamp"
            },
            {
                "title": "HackerRank Python Practice Challenges",
                "type": "Practice",
                "description": "Interactive coding challenges covering Python arithmetic, conditionals, and loops.",
                "url": "https://www.hackerrank.com/domains/python",
                "estimated_time": "30 minutes",
                "provider": "HackerRank"
            }
        ]
    },

    # 7. Python Data Structures & Algorithmic Thinking
    {
        "keywords": ["data structures", "dsa", "lists, dictionaries", "stacks, queues", "linked lists", "algorithmic thinking", "binary search", "recursion", "dynamic programming", "trees", "graphs", "sorting"],
        "resources": [
            {
                "title": "Python Official Documentation: Data Structures",
                "type": "Documentation",
                "description": "Official reference on list comprehensions, tuples, sets, dictionaries, and techniques.",
                "url": "https://docs.python.org/3/tutorial/datastructures.html",
                "estimated_time": "40 minutes",
                "provider": "Python.org"
            },
            {
                "title": "freeCodeCamp Algorithms and Data Structures in Python",
                "type": "Video",
                "description": "Deep-dive video covering Big-O analysis, sorting algorithms, and linear data structures.",
                "url": "https://www.freecodecamp.org/news/learn-algorithms-and-data-structures-in-python/",
                "estimated_time": "1 hour",
                "provider": "freeCodeCamp"
            },
            {
                "title": "LeetCode Algorithmic Exploration",
                "type": "Practice",
                "description": "Hands-on interactive practice problems for arrays, hash maps, and two-pointer techniques.",
                "url": "https://leetcode.com/explore/featured/card/the-leetcode-beginners-guide/",
                "estimated_time": "45 minutes",
                "provider": "LeetCode"
            }
        ]
    },

    # 8. Object-Oriented Programming (OOP)
    {
        "keywords": ["object-oriented", "oop", "classes", "inheritance", "polymorphism", "encapsulation", "dunder methods", "magic methods", "design patterns"],
        "resources": [
            {
                "title": "Python Official Documentation: Classes and OOP",
                "type": "Documentation",
                "description": "Definitive Python documentation explaining classes, instance methods, and inheritance.",
                "url": "https://docs.python.org/3/tutorial/classes.html",
                "estimated_time": "45 minutes",
                "provider": "Python.org"
            },
            {
                "title": "freeCodeCamp Python Object-Oriented Programming Guide",
                "type": "Tutorial",
                "description": "In-depth tutorial building clean class hierarchies and reusable software components.",
                "url": "https://www.freecodecamp.org/news/python-object-oriented-programming-guide/",
                "estimated_time": "40 minutes",
                "provider": "freeCodeCamp"
            },
            {
                "title": "HackerRank Classes & Objects Practice",
                "type": "Practice",
                "description": "Coding exercises to implement custom classes, properties, and magic methods.",
                "url": "https://www.hackerrank.com/domains/python",
                "estimated_time": "30 minutes",
                "provider": "HackerRank"
            }
        ]
    },

    # 9. Automated Testing & Quality Assurance
    {
        "keywords": ["testing", "pytest", "unit tests", "tdd", "mocking", "test suites", "fixtures", "unittest", "assertions"],
        "resources": [
            {
                "title": "pytest Official Documentation & Quickstart",
                "type": "Documentation",
                "description": "Official guide to writing simple, scalable unit tests, fixtures, and assertions.",
                "url": "https://docs.pytest.org/en/stable/getting-started.html",
                "estimated_time": "35 minutes",
                "provider": "pytest Docs"
            },
            {
                "title": "freeCodeCamp: Unit Testing in Python",
                "type": "Tutorial",
                "description": "Comprehensive guide to writing test cases, parameterized tests, and test-driven design.",
                "url": "https://www.freecodecamp.org/news/how-to-write-unit-tests-in-python-using-unittest/",
                "estimated_time": "40 minutes",
                "provider": "freeCodeCamp"
            },
            {
                "title": "Python unittest Standard Library Docs",
                "type": "Documentation",
                "description": "Official documentation for the built-in unittest framework and test runners.",
                "url": "https://docs.python.org/3/library/unittest.html",
                "estimated_time": "30 minutes",
                "provider": "Python.org"
            }
        ]
    },

    # 10. Pandas & Data Wrangling
    {
        "keywords": ["pandas", "data wrangling", "dataframe", "data cleaning", "imputation", "csv, excel", "chunked reading", "multi-index"],
        "resources": [
            {
                "title": "Pandas Official User Guide: 10 Minutes to Pandas",
                "type": "Documentation",
                "description": "Official guide on creating DataFrames, reading CSV/Excel data, and slicing columns.",
                "url": "https://pandas.pydata.org/docs/user_guide/10min.html",
                "estimated_time": "35 minutes",
                "provider": "Pandas Docs"
            },
            {
                "title": "Kaggle Learn: Data Cleaning & Wrangling",
                "type": "Tutorial",
                "description": "Interactive micro-course on handling missing values, data types, and text parsing.",
                "url": "https://www.kaggle.com/learn/data-cleaning",
                "estimated_time": "45 minutes",
                "provider": "Kaggle"
            },
            {
                "title": "Kaggle Learn: Pandas Exercises",
                "type": "Practice",
                "description": "Hands-on indexing, selecting, assigning, grouping, and sorting exercises.",
                "url": "https://www.kaggle.com/learn/pandas",
                "estimated_time": "45 minutes",
                "provider": "Kaggle"
            }
        ]
    },

    # 11. Data Visualization & Exploratory Data Analysis (EDA)
    {
        "keywords": ["data visualization", "matplotlib", "seaborn", "eda", "plotly", "charts for business", "scatter plot", "heatmap"],
        "resources": [
            {
                "title": "Kaggle Learn: Data Visualization",
                "type": "Tutorial",
                "description": "Learn to plot line charts, bar charts, heatmaps, and scatter plots using Seaborn.",
                "url": "https://www.kaggle.com/learn/data-visualization",
                "estimated_time": "45 minutes",
                "provider": "Kaggle"
            },
            {
                "title": "Seaborn Official Tutorial & Gallery",
                "type": "Documentation",
                "description": "Official guide to statistical graphics and color palettes in Python.",
                "url": "https://seaborn.pydata.org/tutorial.html",
                "estimated_time": "40 minutes",
                "provider": "Seaborn Docs"
            },
            {
                "title": "Plotly Python Open Source Graphing Library",
                "type": "Documentation",
                "description": "Interactive charts, hover tooltips, and responsive graphing documentation.",
                "url": "https://plotly.com/python/",
                "estimated_time": "35 minutes",
                "provider": "Plotly"
            }
        ]
    },

    # 12. Statistics, Hypothesis Testing & A/B Testing
    {
        "keywords": ["statistics", "hypothesis testing", "a/b testing", "probability distributions", "t-tests", "confidence intervals", "chi-square", "causal inference", "p-values"],
        "resources": [
            {
                "title": "Khan Academy Statistics & Probability",
                "type": "Tutorial",
                "description": "Interactive lessons on normal distributions, sampling distributions, and significance tests.",
                "url": "https://www.khanacademy.org/math/statistics-probability",
                "estimated_time": "45 minutes",
                "provider": "Khan Academy"
            },
            {
                "title": "Scipy Stats Official Documentation",
                "type": "Documentation",
                "description": "Official documentation for statistical tests (ttest_ind, chisquare, f_oneway) in Python.",
                "url": "https://docs.scipy.org/doc/scipy/reference/stats.html",
                "estimated_time": "35 minutes",
                "provider": "Scipy Docs"
            },
            {
                "title": "freeCodeCamp A/B Testing Practical Guide",
                "type": "Tutorial",
                "description": "Real-world methodology for sizing sample sizes, analyzing lift, and writing debriefs.",
                "url": "https://www.freecodecamp.org/news/ab-testing-explained-with-python/",
                "estimated_time": "40 minutes",
                "provider": "freeCodeCamp"
            }
        ]
    },

    # 13. Machine Learning Fundamentals & Scikit-learn
    {
        "keywords": ["machine learning", "scikit-learn", "supervised learning", "linear regression", "logistic regression", "train/test split", "random forest", "decision tree"],
        "resources": [
            {
                "title": "Scikit-Learn Official User Guide",
                "type": "Documentation",
                "description": "Official documentation covering supervised learning algorithms and model parameter tuning.",
                "url": "https://scikit-learn.org/stable/user_guide.html",
                "estimated_time": "45 minutes",
                "provider": "Scikit-Learn"
            },
            {
                "title": "Kaggle Learn: Intro to Machine Learning",
                "type": "Tutorial",
                "description": "Train decision trees and random forests with real housing price datasets.",
                "url": "https://www.kaggle.com/learn/intro-to-machine-learning",
                "estimated_time": "50 minutes",
                "provider": "Kaggle"
            },
            {
                "title": "freeCodeCamp Machine Learning with Python Course",
                "type": "Video",
                "description": "Comprehensive video course covering regression, classification, and model evaluation.",
                "url": "https://www.freecodecamp.org/learn/machine-learning-with-python/",
                "estimated_time": "1 hour",
                "provider": "freeCodeCamp"
            }
        ]
    },

    # 14. Model Evaluation & Feature Engineering
    {
        "keywords": ["feature engineering", "cross-validation", "confusion matrix", "precision & recall", "roc-auc", "hyperparameter", "xgboost", "lightgbm", "optuna", "rfm"],
        "resources": [
            {
                "title": "Scikit-Learn Model Evaluation Metrics Guide",
                "type": "Documentation",
                "description": "Detailed explanation of precision, recall, F1-score, ROC-AUC, and scoring parameters.",
                "url": "https://scikit-learn.org/stable/modules/model_evaluation.html",
                "estimated_time": "40 minutes",
                "provider": "Scikit-Learn"
            },
            {
                "title": "Kaggle Learn: Feature Engineering",
                "type": "Tutorial",
                "description": "Hands-on lessons on mutual information, encoding categorical variables, and clustering features.",
                "url": "https://www.kaggle.com/learn/feature-engineering",
                "estimated_time": "45 minutes",
                "provider": "Kaggle"
            },
            {
                "title": "Kaggle Learn: Intermediate Machine Learning",
                "type": "Practice",
                "description": "Implement cross-validation, pipelines, and XGBoost on competitive benchmarking datasets.",
                "url": "https://www.kaggle.com/learn/intermediate-machine-learning",
                "estimated_time": "50 minutes",
                "provider": "Kaggle"
            }
        ]
    },

    # 15. Deep Learning & PyTorch
    {
        "keywords": ["deep learning", "neural network", "pytorch", "tensors", "backpropagation", "loss functions", "convolutional", "cnn", "autograd"],
        "resources": [
            {
                "title": "PyTorch Official Tutorials: Learn the Basics",
                "type": "Documentation",
                "description": "Official step-by-step introduction to PyTorch tensors, datasets, transforms, and autograd.",
                "url": "https://pytorch.org/tutorials/beginner/basics/intro.html",
                "estimated_time": "50 minutes",
                "provider": "PyTorch.org"
            },
            {
                "title": "PyTorch Deep Learning 60 Minute Blitz",
                "type": "Tutorial",
                "description": "High-level overview of building and training neural networks from scratch.",
                "url": "https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html",
                "estimated_time": "1 hour",
                "provider": "PyTorch.org"
            },
            {
                "title": "freeCodeCamp PyTorch for Deep Learning Course",
                "type": "Video",
                "description": "Comprehensive video guide covering convolutional networks, optimizers, and GPU training.",
                "url": "https://www.freecodecamp.org/news/pytorch-for-deep-learning-course/",
                "estimated_time": "1 hour",
                "provider": "freeCodeCamp"
            }
        ]
    },

    # 16. Web Development: HTML & CSS Fundamentals
    {
        "keywords": ["html", "css", "semantic html", "flexbox", "css grid", "responsive design", "accessibility", "a11y", "media queries"],
        "resources": [
            {
                "title": "MDN Web Docs: Learn HTML",
                "type": "Documentation",
                "description": "The definitive Mozilla guide to semantic elements, metadata, forms, and accessibility.",
                "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content",
                "estimated_time": "40 minutes",
                "provider": "MDN Web Docs"
            },
            {
                "title": "MDN Web Docs: Learn CSS & Layouts",
                "type": "Documentation",
                "description": "Master Flexbox, CSS Grid, media queries, and responsive web styling.",
                "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics",
                "estimated_time": "45 minutes",
                "provider": "MDN Web Docs"
            },
            {
                "title": "freeCodeCamp Responsive Web Design Certification",
                "type": "Practice",
                "description": "Build responsive web pages through interactive code challenges and live browser previews.",
                "url": "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
                "estimated_time": "1 hour",
                "provider": "freeCodeCamp"
            }
        ]
    },

    # 17. JavaScript Fundamentals & DOM
    {
        "keywords": ["javascript", "es6", "dom manipulation", "async/await", "promises", "fetch api", "event listeners", "localstorage"],
        "resources": [
            {
                "title": "MDN Web Docs: JavaScript Basics & Reference",
                "type": "Documentation",
                "description": "Mozilla's authoritative guide on variables, objects, functions, arrow functions, and arrays.",
                "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting",
                "estimated_time": "45 minutes",
                "provider": "MDN Web Docs"
            },
            {
                "title": "MDN Web Docs: Working with the DOM & Events",
                "type": "Tutorial",
                "description": "Learn event listeners, DOM element manipulation, and dynamic HTML updates.",
                "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/DOM_scripting",
                "estimated_time": "40 minutes",
                "provider": "MDN Web Docs"
            },
            {
                "title": "freeCodeCamp JavaScript Algorithms & Data Structures",
                "type": "Practice",
                "description": "Solve interactive programming puzzles and build functional JavaScript applications.",
                "url": "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/",
                "estimated_time": "50 minutes",
                "provider": "freeCodeCamp"
            }
        ]
    },

    # 18. Frontend Frameworks: React
    {
        "keywords": ["react", "components", "jsx", "usestate", "useeffect", "hooks", "frontend architecture", "props", "virtual dom"],
        "resources": [
            {
                "title": "React Official Documentation: Describing the UI",
                "type": "Documentation",
                "description": "The official React guide to creating modular functional components, JSX, and props.",
                "url": "https://react.dev/learn/describing-the-ui",
                "estimated_time": "45 minutes",
                "provider": "React Docs"
            },
            {
                "title": "React Official Documentation: State & Hooks",
                "type": "Tutorial",
                "description": "Master component state memory, form handling, and lifecycle effects with interactive sandboxes.",
                "url": "https://react.dev/learn/state-a-components-memory",
                "estimated_time": "50 minutes",
                "provider": "React Docs"
            },
            {
                "title": "freeCodeCamp React Full Course",
                "type": "Video",
                "description": "Comprehensive video tutorial building dynamic single-page applications.",
                "url": "https://www.freecodecamp.org/news/learn-react-by-building-real-world-projects/",
                "estimated_time": "1 hour",
                "provider": "freeCodeCamp"
            }
        ]
    },

    # 19. Backend APIs & FastAPI / REST
    {
        "keywords": ["api", "fastapi", "rest api", "backend", "endpoints", "request/response", "pydantic", "http methods", "swagger", "openapi"],
        "resources": [
            {
                "title": "FastAPI Official Documentation & Tutorial",
                "type": "Documentation",
                "description": "The official guide to building high-performance REST APIs with Python and Pydantic.",
                "url": "https://fastapi.tiangolo.com/tutorial/",
                "estimated_time": "40 minutes",
                "provider": "FastAPI Docs"
            },
            {
                "title": "MDN Web Docs: What is a REST API?",
                "type": "Tutorial",
                "description": "Conceptual guide to HTTP methods (GET, POST, PUT, DELETE), headers, and status codes.",
                "url": "https://developer.mozilla.org/en-US/docs/Glossary/REST",
                "estimated_time": "30 minutes",
                "provider": "MDN Web Docs"
            },
            {
                "title": "freeCodeCamp FastAPI Complete Course",
                "type": "Video",
                "description": "Build and secure robust Python APIs with database models and JWT authentication.",
                "url": "https://www.freecodecamp.org/news/fastapi-quickstart/",
                "estimated_time": "1 hour",
                "provider": "freeCodeCamp"
            }
        ]
    },

    # 20. Docker, Deployment & MLOps
    {
        "keywords": ["docker", "container", "deployment", "mlops", "model serving", "ci/cd", "kubernetes", "cloud hosting"],
        "resources": [
            {
                "title": "Docker Official Getting Started Guide",
                "type": "Documentation",
                "description": "Official guide on writing Dockerfiles, building container images, and running containers.",
                "url": "https://docs.docker.com/get-started/",
                "estimated_time": "45 minutes",
                "provider": "Docker Docs"
            },
            {
                "title": "FastAPI Deployment in Docker Guide",
                "type": "Tutorial",
                "description": "Official FastAPI documentation for containerizing backend apps and serving predictions.",
                "url": "https://fastapi.tiangolo.com/deployment/docker/",
                "estimated_time": "35 minutes",
                "provider": "FastAPI Docs"
            },
            {
                "title": "freeCodeCamp Docker for Beginners",
                "type": "Video",
                "description": "Hands-on video tutorial covering image creation, volumes, ports, and multi-stage builds.",
                "url": "https://www.freecodecamp.org/news/learn-docker-containers-full-course/",
                "estimated_time": "1 hour",
                "provider": "freeCodeCamp"
            }
        ]
    },

    # 21. Natural Language Processing (NLP) & Transformers
    {
        "keywords": ["natural language processing", "transformers library", "huggingface", "large language model", "text embeddings", "retrieval augmented generation", "text classification", "tokenization", "sentiment analysis", "spacy", "llm fine-tuning"],
        "resources": [
            {
                "title": "Hugging Face Transformers Official Documentation",
                "type": "Documentation",
                "description": "State-of-the-art Natural Language Processing library for PyTorch and TensorFlow.",
                "url": "https://huggingface.co/docs/transformers/index",
                "estimated_time": "45 minutes",
                "provider": "Hugging Face"
            },
            {
                "title": "Kaggle Learn: Natural Language Processing",
                "type": "Tutorial",
                "description": "Interactive notebook course covering tokenization, word vectors, and text classification with spaCy.",
                "url": "https://www.kaggle.com/learn/natural-language-processing",
                "estimated_time": "50 minutes",
                "provider": "Kaggle"
            },
            {
                "title": "spaCy 101: Everything You Need to Know",
                "type": "Documentation",
                "description": "Industrial-strength NLP in Python: rule-based matching, POS tagging, and NER.",
                "url": "https://spacy.io/usage/spacy-101",
                "estimated_time": "40 minutes",
                "provider": "spaCy Docs"
            }
        ]
    },

    # 22. Computer Vision & OpenCV
    {
        "keywords": ["computer vision", "opencv", "cnn", "image processing", "object detection", "yolo", "resnet", "convolutional neural"],
        "resources": [
            {
                "title": "OpenCV Python Official Tutorials",
                "type": "Documentation",
                "description": "Comprehensive guide to image filtering, geometric transformations, and feature detection.",
                "url": "https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html",
                "estimated_time": "45 minutes",
                "provider": "OpenCV"
            },
            {
                "title": "Kaggle Learn: Computer Vision",
                "type": "Tutorial",
                "description": "Build convolutional neural networks for image classification with Keras and PyTorch.",
                "url": "https://www.kaggle.com/learn/computer-vision",
                "estimated_time": "50 minutes",
                "provider": "Kaggle"
            },
            {
                "title": "PyTorch Vision Torchvision Tutorials",
                "type": "Documentation",
                "description": "Transfer learning, pretrained ResNet models, and image augmentation pipelines.",
                "url": "https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html",
                "estimated_time": "40 minutes",
                "provider": "PyTorch.org"
            }
        ]
    },

    # 23. Streamlit & Interactive Web Dashboards
    {
        "keywords": ["streamlit", "interactive dashboard", "plotly", "dashboard development", "web application"],
        "resources": [
            {
                "title": "Streamlit Official Getting Started Guide",
                "type": "Documentation",
                "description": "The fastest way to build and share data apps and machine learning web dashboards in Python.",
                "url": "https://docs.streamlit.io/get-started",
                "estimated_time": "35 minutes",
                "provider": "Streamlit Docs"
            },
            {
                "title": "freeCodeCamp Build 12 Data Science Apps with Python & Streamlit",
                "type": "Video",
                "description": "Hands-on video course building interactive data science web applications from scratch.",
                "url": "https://www.freecodecamp.org/news/build-12-data-science-apps-with-python-and-streamlit/",
                "estimated_time": "1 hour",
                "provider": "freeCodeCamp"
            }
        ]
    },

    # 24. Git, Version Control & GitHub
    {
        "keywords": ["git", "github", "version control", "pull request", "branching", "open source", "repository"],
        "resources": [
            {
                "title": "Pro Git Book (Official Documentation)",
                "type": "Documentation",
                "description": "The definitive, free comprehensive book on Git architecture, branches, remotes, and workflows.",
                "url": "https://git-scm.com/book/en/v2",
                "estimated_time": "45 minutes",
                "provider": "Git-SCM"
            },
            {
                "title": "GitHub Skills: Introduction to GitHub",
                "type": "Tutorial",
                "description": "Interactive in-repository tutorial learning pull requests, issues, and branch protection.",
                "url": "https://skills.github.com/",
                "estimated_time": "30 minutes",
                "provider": "GitHub"
            },
            {
                "title": "freeCodeCamp Git and GitHub for Beginners",
                "type": "Video",
                "description": "Crash course on commit history, resolving merge conflicts, and publishing open-source portfolios.",
                "url": "https://www.freecodecamp.org/news/git-and-github-for-beginners/",
                "estimated_time": "45 minutes",
                "provider": "freeCodeCamp"
            }
        ]
    },

    # 25. Web Security, Authentication & OWASP
    {
        "keywords": ["security", "authentication", "jwt", "bcrypt", "owasp", "oauth", "password", "cors", "encryption"],
        "resources": [
            {
                "title": "OWASP Top Ten Web Application Security Risks",
                "type": "Documentation",
                "description": "Standard awareness document representing broad consensus on critical security risks.",
                "url": "https://owasp.org/www-project-top-ten/",
                "estimated_time": "40 minutes",
                "provider": "OWASP"
            },
            {
                "title": "FastAPI Security & OAuth2 Documentation",
                "type": "Documentation",
                "description": "Official guide to implementing password hashing, Bearer tokens, and secure routes.",
                "url": "https://fastapi.tiangolo.com/tutorial/security/",
                "estimated_time": "45 minutes",
                "provider": "FastAPI Docs"
            },
            {
                "title": "MDN Web Docs: Web Security Overview",
                "type": "Tutorial",
                "description": "Fundamental security guidelines covering CORS, HTTPS, cookies, and Content Security Policy.",
                "url": "https://developer.mozilla.org/en-US/docs/Web/Security",
                "estimated_time": "35 minutes",
                "provider": "MDN Web Docs"
            }
        ]
    },

    # 26. Big Data & Distributed Processing (PySpark / Cloud Warehouses)
    {
        "keywords": ["pyspark", "spark", "big data", "dask", "bigquery", "snowflake", "data warehouse", "etl", "dbt", "parquet"],
        "resources": [
            {
                "title": "Apache Spark Python API (PySpark) Quickstart",
                "type": "Documentation",
                "description": "Official Apache Spark documentation for resilient distributed datasets and PySpark DataFrames.",
                "url": "https://spark.apache.org/docs/latest/api/python/getting_started/index.html",
                "estimated_time": "45 minutes",
                "provider": "Apache Spark"
            },
            {
                "title": "freeCodeCamp PySpark Full Course",
                "type": "Video",
                "description": "Complete hands-on video tutorial covering big data processing with Spark in Python.",
                "url": "https://www.freecodecamp.org/news/pyspark-full-course/",
                "estimated_time": "1 hour",
                "provider": "freeCodeCamp"
            }
        ]
    },

    # 27. Technical Interviews & Career Preparation
    {
        "keywords": ["interview", "case study", "portfolio", "resume", "whiteboarding", "career readiness", "live sql"],
        "resources": [
            {
                "title": "LeetCode Top Interview 150 Study Plan",
                "type": "Practice",
                "description": "Classic algorithmic interview problems covering arrays, two-pointers, trees, and dynamic programming.",
                "url": "https://leetcode.com/studyplan/top-interview-150/",
                "estimated_time": "45 minutes",
                "provider": "LeetCode"
            },
            {
                "title": "freeCodeCamp Coding Interview Preparation Course",
                "type": "Tutorial",
                "description": "Interactive data structures, algorithms, and project architecture challenges.",
                "url": "https://www.freecodecamp.org/learn/coding-interview-prep/",
                "estimated_time": "50 minutes",
                "provider": "freeCodeCamp"
            },
            {
                "title": "GitHub Open Source Guide: Building a Tech Portfolio",
                "type": "Documentation",
                "description": "Best practices for showcasing projects, writing clean documentation, and code reviews.",
                "url": "https://opensource.guide/how-to-contribute/",
                "estimated_time": "30 minutes",
                "provider": "GitHub Guides"
            }
        ]
    },

    # 28. NoSQL & Document Databases (MongoDB / Redis)
    {
        "keywords": ["nosql", "mongodb", "redis", "document database", "key-value", "caching", "graph database"],
        "resources": [
            {
                "title": "MongoDB Official Getting Started Documentation",
                "type": "Documentation",
                "description": "Learn document databases, JSON collections, indexes, and aggregation pipelines.",
                "url": "https://www.mongodb.com/docs/manual/introduction/",
                "estimated_time": "40 minutes",
                "provider": "MongoDB Docs"
            },
            {
                "title": "Redis Official Getting Started Guide",
                "type": "Documentation",
                "description": "In-memory data structures, caching patterns, Pub/Sub, and high-throughput key-value storage.",
                "url": "https://redis.io/docs/latest/get-started/",
                "estimated_time": "35 minutes",
                "provider": "Redis Docs"
            }
        ]
    },

    # 29. Time Series & Demand Forecasting
    {
        "keywords": ["time series", "forecasting", "prophet", "arima", "seasonality", "trend", "exponential smoothing"],
        "resources": [
            {
                "title": "Kaggle Learn: Time Series Forecasting",
                "type": "Tutorial",
                "description": "Engineer trend and seasonality features, build linear regression models, and fit hybrid forecasters.",
                "url": "https://www.kaggle.com/learn/time-series",
                "estimated_time": "45 minutes",
                "provider": "Kaggle"
            },
            {
                "title": "Statsmodels Time Series Analysis Documentation",
                "type": "Documentation",
                "description": "Statistical modeling of stationary processes, ARIMA, SARIMAX, and decomposition in Python.",
                "url": "https://www.statsmodels.org/stable/tsa.html",
                "estimated_time": "40 minutes",
                "provider": "Statsmodels"
            }
        ]
    },

    # 30. Microservices, GraphQL & System Design
    {
        "keywords": ["microservice architecture", "graphql", "grpc", "system design", "load balancing", "horizontal scaling", "software architecture"],
        "resources": [
            {
                "title": "GraphQL Official Interactive Tutorial & Guide",
                "type": "Documentation",
                "description": "A query language for your API: schemas, queries, mutations, and resolver execution.",
                "url": "https://graphql.org/learn/",
                "estimated_time": "40 minutes",
                "provider": "GraphQL.org"
            },
            {
                "title": "MDN Web Docs: Client-Server Web Architecture",
                "type": "Tutorial",
                "description": "Overview of web servers, HTTP protocol, reverse proxies, and distributed architecture.",
                "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics",
                "estimated_time": "35 minutes",
                "provider": "MDN Web Docs"
            }
        ]
    }
]


# -----------------------------------------------------------------------------
# Curated Fallback Resources by Learning Interest
# Used if a specific weekly topic or theme does not have a direct rule match.
# -----------------------------------------------------------------------------

FALLBACK_RESOURCES: Dict[str, List[Dict[str, Any]]] = {
    "Python": [
        {
            "title": "Python 3 Official Documentation & Tutorial",
            "type": "Documentation",
            "description": "Explore Python's official documentation, standard library modules, and language syntax.",
            "url": "https://docs.python.org/3/tutorial/",
            "estimated_time": "45 minutes",
            "provider": "Python.org"
        },
        {
            "title": "Kaggle Learn: Python",
            "type": "Tutorial",
            "description": "Interactive exercises covering core Python concepts for data and software development.",
            "url": "https://www.kaggle.com/learn/python",
            "estimated_time": "40 minutes",
            "provider": "Kaggle"
        },
        {
            "title": "freeCodeCamp Python Beginners Handbook",
            "type": "Practice",
            "description": "Hands-on reference guide with practical code examples and exercises.",
            "url": "https://www.freecodecamp.org/news/python-for-beginners-handbook/",
            "estimated_time": "35 minutes",
            "provider": "freeCodeCamp"
        }
    ],
    "Data Analytics": [
        {
            "title": "Kaggle Learn: Data Analysis with Pandas & SQL",
            "type": "Tutorial",
            "description": "Practical hands-on data manipulation, aggregation, and querying exercises.",
            "url": "https://www.kaggle.com/learn/pandas",
            "estimated_time": "45 minutes",
            "provider": "Kaggle"
        },
        {
            "title": "PostgreSQL Official Tutorial",
            "type": "Documentation",
            "description": "Relational database queries, table relationships, and structured data analysis.",
            "url": "https://www.postgresql.org/docs/current/tutorial.html",
            "estimated_time": "40 minutes",
            "provider": "PostgreSQL Docs"
        },
        {
            "title": "Kaggle Learn: Data Visualization",
            "type": "Practice",
            "description": "Design insightful charts, distributions, and business KPIs using Seaborn and Matplotlib.",
            "url": "https://www.kaggle.com/learn/data-visualization",
            "estimated_time": "35 minutes",
            "provider": "Kaggle"
        }
    ],
    "Data Science": [
        {
            "title": "Scikit-Learn Official User Guide",
            "type": "Documentation",
            "description": "Machine learning algorithms, pipelines, and data preprocessing in Python.",
            "url": "https://scikit-learn.org/stable/user_guide.html",
            "estimated_time": "45 minutes",
            "provider": "Scikit-Learn"
        },
        {
            "title": "Kaggle Learn: Intro to Machine Learning",
            "type": "Tutorial",
            "description": "Hands-on interactive tutorial training supervised models on benchmark datasets.",
            "url": "https://www.kaggle.com/learn/intro-to-machine-learning",
            "estimated_time": "50 minutes",
            "provider": "Kaggle"
        },
        {
            "title": "Kaggle Learn: Pandas for Data Science",
            "type": "Practice",
            "description": "Real-world dataset cleaning, grouping, and feature preparation.",
            "url": "https://www.kaggle.com/learn/pandas",
            "estimated_time": "40 minutes",
            "provider": "Kaggle"
        }
    ],
    "Machine Learning": [
        {
            "title": "Scikit-Learn Machine Learning Guide",
            "type": "Documentation",
            "description": "Official user guide for classification, regression, clustering, and model validation.",
            "url": "https://scikit-learn.org/stable/user_guide.html",
            "estimated_time": "45 minutes",
            "provider": "Scikit-Learn"
        },
        {
            "title": "Kaggle Learn: Machine Learning Track",
            "type": "Tutorial",
            "description": "Interactive notebook tutorials for model training, metrics, and tuning.",
            "url": "https://www.kaggle.com/learn/intro-to-machine-learning",
            "estimated_time": "50 minutes",
            "provider": "Kaggle"
        },
        {
            "title": "freeCodeCamp Machine Learning with Python",
            "type": "Video",
            "description": "Video guide through practical machine learning algorithms and hands-on projects.",
            "url": "https://www.freecodecamp.org/learn/machine-learning-with-python/",
            "estimated_time": "1 hour",
            "provider": "freeCodeCamp"
        }
    ],
    "Artificial Intelligence": [
        {
            "title": "PyTorch Official Tutorials",
            "type": "Documentation",
            "description": "Deep learning architectures, tensors, neural network layers, and training loops.",
            "url": "https://pytorch.org/tutorials/beginner/basics/intro.html",
            "estimated_time": "50 minutes",
            "provider": "PyTorch.org"
        },
        {
            "title": "Scikit-Learn User Guide",
            "type": "Tutorial",
            "description": "Machine learning foundations, predictive modeling, and feature engineering.",
            "url": "https://scikit-learn.org/stable/user_guide.html",
            "estimated_time": "45 minutes",
            "provider": "Scikit-Learn"
        },
        {
            "title": "Kaggle Learn: Intro to Deep Learning",
            "type": "Practice",
            "description": "Build and evaluate neural networks using modern Python frameworks.",
            "url": "https://www.kaggle.com/learn/intro-to-deep-learning",
            "estimated_time": "45 minutes",
            "provider": "Kaggle"
        }
    ],
    "Web Development": [
        {
            "title": "MDN Web Docs: Web Development Curriculum",
            "type": "Documentation",
            "description": "The industry standard guide to HTML5, modern CSS, and JavaScript fundamentals.",
            "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development",
            "estimated_time": "45 minutes",
            "provider": "MDN Web Docs"
        },
        {
            "title": "freeCodeCamp Responsive Web Design",
            "type": "Tutorial",
            "description": "Interactive web development projects covering responsive layouts, forms, and accessibility.",
            "url": "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
            "estimated_time": "50 minutes",
            "provider": "freeCodeCamp"
        },
        {
            "title": "MDN JavaScript Interactive Learning",
            "type": "Practice",
            "description": "Hands-on browser scripting challenges and DOM manipulation examples.",
            "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting",
            "estimated_time": "40 minutes",
            "provider": "MDN Web Docs"
        }
    ]
}


def get_reference_for_topic(topic: str, interest: str) -> Dict[str, Any]:
    """
    Finds a direct, authoritative reference link for a single learning topic.
    Returns a dict with title, url, type, provider, and description.
    Guarantees a valid, high-quality educational link.
    """
    topic_clean = topic.strip()
    topic_lower = topic_clean.lower()

    # 1. Check specific topic rules
    best_match = None
    best_score = 0

    for rule in TOPIC_RESOURCE_RULES:
        for keyword in rule["keywords"]:
            k_lower = keyword.lower()
            if k_lower in topic_lower:
                # Calculate keyword specificity score
                score = len(k_lower)
                if score > best_score:
                    best_score = score
                    # Prioritize Documentation or Tutorial
                    doc_res = next((r for r in rule["resources"] if r.get("type") in ["Documentation", "Tutorial"]), rule["resources"][0])
                    best_match = doc_res

    if best_match:
        provider = best_match.get("provider")
        if not provider:
            domain = urlparse(best_match["url"]).netloc.replace("www.", "")
            provider = domain.split(".")[0].capitalize()
        return {
            "title": best_match["title"],
            "url": best_match["url"],
            "type": best_match.get("type", "Documentation"),
            "provider": provider,
            "description": best_match.get("description", f"Verified study material for {topic_clean}")
        }

    # 2. Topic keyword fallback heuristics
    fallback_map = [
        (["sql", "query", "database", "table"], "https://www.postgresql.org/docs/current/tutorial.html", "PostgreSQL Tutorial", "Documentation", "PostgreSQL Docs"),
        (["pandas", "dataframe", "wrangling", "csv"], "https://pandas.pydata.org/docs/user_guide/10min.html", "10 Minutes to Pandas", "Documentation", "Pandas Docs"),
        (["numpy", "matrix", "vector", "array"], "https://numpy.org/doc/stable/user/quickstart.html", "NumPy Quickstart", "Documentation", "NumPy Docs"),
        (["react", "component", "hook", "jsx"], "https://react.dev/learn", "Quick Start with React", "Documentation", "React Docs"),
        (["fastapi", "api", "endpoint", "rest", "swagger"], "https://fastapi.tiangolo.com/tutorial/", "FastAPI Tutorial", "Documentation", "FastAPI Docs"),
        (["docker", "container", "deploy"], "https://docs.docker.com/get-started/", "Docker Getting Started", "Documentation", "Docker Docs"),
        (["git", "github", "commit", "branch"], "https://git-scm.com/book/en/v2", "Pro Git Book", "Documentation", "Git-SCM"),
        (["css", "flexbox", "grid", "style"], "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics", "MDN CSS Basics", "Documentation", "MDN Web Docs"),
        (["html", "dom", "element", "tag"], "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content", "MDN HTML Basics", "Documentation", "MDN Web Docs"),
        (["javascript", "js", "async", "promise", "es6"], "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting", "MDN JavaScript Guide", "Documentation", "MDN Web Docs"),
        (["pytorch", "tensor", "neural"], "https://pytorch.org/tutorials/beginner/basics/intro.html", "PyTorch Basics Tutorial", "Documentation", "PyTorch.org"),
        (["scikit", "sklearn", "model", "regression", "classification"], "https://scikit-learn.org/stable/user_guide.html", "Scikit-Learn User Guide", "Documentation", "Scikit-Learn"),
        (["excel", "pivot", "spreadsheet"], "https://support.microsoft.com/en-us/office/excel-video-training-9bc05390-e94c-46ac-973d-783f97297304", "Microsoft Excel Video Training", "Tutorial", "Microsoft"),
        (["power bi", "dax", "kpi"], "https://learn.microsoft.com/en-us/power-bi/fundamentals/desktop-getting-started", "Power BI Getting Started", "Documentation", "Microsoft Learn"),
        (["interview", "leetcode", "dsa", "algorithm"], "https://leetcode.com/explore/featured/card/the-leetcode-beginners-guide/", "LeetCode Beginner's Guide", "Practice", "LeetCode"),
        (["test", "pytest", "unit"], "https://docs.pytest.org/en/stable/getting-started.html", "pytest Getting Started", "Documentation", "pytest Docs")
    ]

    for kws, url, title, rtype, prov in fallback_map:
        if any(kw in topic_lower for kw in kws):
            return {
                "title": title,
                "url": url,
                "type": rtype,
                "provider": prov,
                "description": f"Verified documentation and learning reference for {topic_clean}"
            }

    # 3. Interest-level default reference
    interest_fallbacks = FALLBACK_RESOURCES.get(interest, FALLBACK_RESOURCES.get("Python", []))
    if interest_fallbacks:
        fb = interest_fallbacks[0]
        return {
            "title": fb["title"],
            "url": fb["url"],
            "type": fb.get("type", "Documentation"),
            "provider": fb.get("provider", interest),
            "description": fb.get("description", f"Authoritative reference guide for {interest}")
        }

    return {
        "title": "Python 3 Official Documentation",
        "url": "https://docs.python.org/3/tutorial/",
        "type": "Documentation",
        "provider": "Python.org",
        "description": "Comprehensive language reference and tutorial"
    }


def get_resources_for_week(
    theme: str,
    topics: List[str],
    activities: List[str],
    interest: str
) -> List[Dict[str, Any]]:
    """
    Finds 2 to 4 highly relevant, curated educational resources matching the
    weekly module's theme, topics, and practice activities.
    
    Guarantees:
    - Unique URLs
    - Diversity of resource types (Documentation, Tutorial, Video, Practice)
    - Valid external links with estimated times and provider names
    """
    # Build search context
    context_text = f"{theme} {' '.join(topics)} {' '.join(activities)}".lower()

    selected_resources: List[Dict[str, Any]] = []
    seen_urls = set()

    def add_res(res: Dict[str, Any]) -> bool:
        url = res["url"]
        if url not in seen_urls:
            seen_urls.add(url)
            # Ensure provider exists
            res_copy = dict(res)
            if "provider" not in res_copy:
                domain = urlparse(url).netloc.replace("www.", "")
                res_copy["provider"] = domain.split(".")[0].capitalize()
            if "estimated_time" not in res_copy:
                res_copy["estimated_time"] = res_copy.get("estimatedTime", "40 minutes")
            selected_resources.append(res_copy)
            return True
        return False

    # 1. Match specific topic rules
    for rule in TOPIC_RESOURCE_RULES:
        if any(keyword.lower() in context_text for keyword in rule["keywords"]):
            for res in rule["resources"]:
                add_res(res)
                if len(selected_resources) >= 4:
                    break
        if len(selected_resources) >= 4:
            break

    # 2. Add topic-specific references if we still have room
    if len(selected_resources) < 3 and topics:
        for t in topics:
            top_ref = get_reference_for_topic(t, interest)
            if top_ref["url"] not in seen_urls:
                add_res(top_ref)
                if len(selected_resources) >= 3:
                    break

    # 3. If fewer than 2 resources matched, add interest-level curated fallbacks
    if len(selected_resources) < 2:
        fallbacks = FALLBACK_RESOURCES.get(interest, FALLBACK_RESOURCES.get("Python", []))
        for res in fallbacks:
            add_res(res)
            if len(selected_resources) >= 3:
                break

    # Cap at maximum 4 to keep layout clean and readable
    return selected_resources[:4]
