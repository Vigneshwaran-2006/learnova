export const SAMPLE_ROADMAP = {
  title: "Python Mastery for Software Developers",
  learner_name: "Vignesh",
  interest: "Python",
  skill_level: "Beginner",
  career_goal: "Software Developer",
  daily_time: "1 hour",
  duration: "1 month",
  summary: "A practical 4-week roadmap to master Python fundamentals, data structures, OOP, and build clean software applications.",
  metrics: {
    total_weeks: 4,
    estimated_hours_per_week: 7,
    difficulty: "Beginner to Intermediate"
  },
  weekly_plan: [
    {
      week_number: 1,
      focus: "Python Setup, Syntax & Control Flow",
      topics: [
        "Python Setup, CLI & Virtual Environments",
        "Variables, Dynamic Typing & Expressions",
        "Control Flow (if, elif, else)",
        "Loops & Iterations (for, while)"
      ],
      practice_activities: [
        "Write a terminal-based unit converter",
        "Build an interactive number guessing game"
      ],
      topic_references: [
        { title: "Official Python 3 Tutorial: First Steps", url: "https://docs.python.org/3/tutorial/" },
        { title: "Real Python: Python Basics & Types", url: "https://realpython.com/python-basics/" },
        { title: "W3Schools: Python Conditions & If Statements", url: "https://www.w3schools.com/python/python_conditions.asp" },
        { title: "FreeCodeCamp: Python Loops Explained", url: "https://www.freecodecamp.org/news/python-for-loop-example/" }
      ],
      resources: [
        {
          title: "Python 3 Official Documentation",
          type: "documentation",
          estimated_time: "45 min",
          description: "Complete beginner documentation and standard library quickstart.",
          provider: "Python Software Foundation",
          url: "https://docs.python.org/3/"
        },
        {
          title: "Python for Beginners - Full Video Course",
          type: "video",
          estimated_time: "1 hr",
          description: "Visual walkthrough of installing Python, variables, and loop logic.",
          provider: "freeCodeCamp",
          url: "https://www.youtube.com/watch?v=rfscVS0vtbw"
        }
      ]
    },
    {
      week_number: 2,
      focus: "Data Structures & Functions",
      topics: [
        "Lists, Tuples & Slicing",
        "Dictionaries, Sets & Hash Lookups",
        "Writing Modular Functions with Docstrings",
        "List Comprehensions & Functional Built-ins"
      ],
      practice_activities: [
        "Build an in-memory Contact Book application",
        "Create an automated word frequency counter"
      ],
      topic_references: [
        { title: "Real Python: Python Lists and Tuples", url: "https://realpython.com/python-lists-tuples/" },
        { title: "Python Docs: Mapping Types — dict", url: "https://docs.python.org/3/library/stdtypes.html#mapping-types-dict" },
        { title: "Real Python: Defining Your Own Functions", url: "https://realpython.com/defining-your-own-python-function/" },
        { title: "Python Morsels: Comprehensions and Generators", url: "https://www.pythonmorsels.com/comprehensions/" }
      ],
      resources: [
        {
          title: "Core Data Structures in Python",
          type: "documentation",
          estimated_time: "40 min",
          description: "In-depth guide to choosing between lists, dicts, and sets for performance.",
          provider: "Real Python",
          url: "https://realpython.com/python-data-structures/"
        }
      ]
    },
    {
      week_number: 3,
      focus: "Object-Oriented Programming & Error Handling",
      topics: [
        "Classes, Objects & Dunder Methods (__init__, __str__)",
        "Inheritance, Polymorphism & Composition",
        "Robust Error Handling with try-except-finally",
        "File I/O and JSON Serialization"
      ],
      practice_activities: [
        "Implement a Bank Account management system",
        "Build a persistent JSON task manager CLI"
      ],
      topic_references: [
        { title: "Real Python: Object-Oriented Programming in Python", url: "https://realpython.com/python3-object-oriented-programming/" },
        { title: "GeeksforGeeks: Inheritance in Python", url: "https://www.geeksforgeeks.org/inheritance-in-python/" },
        { title: "Python Docs: Errors and Exceptions", url: "https://docs.python.org/3/tutorial/errors.html" },
        { title: "Real Python: Working with Files and JSON in Python", url: "https://realpython.com/working-with-files-in-python/" }
      ],
      resources: [
        {
          title: "Python OOP Masterclass Video",
          type: "video",
          estimated_time: "1.5 hr",
          description: "Clean code practices and OOP principles for modern Python.",
          provider: "Corey Schafer",
          url: "https://www.youtube.com/playlist?list=PL-osiE80TeTsqhIuOqKhwlXsIBIdSeYtc"
        }
      ]
    },
    {
      week_number: 4,
      focus: "Testing, Virtual Environments & Mini-Project",
      topics: [
        "Unit Testing with pytest & Test Assertions",
        "Packaging, Virtualenv & requirements.txt",
        "Working with External REST APIs using requests",
        "Capstone Project: Full CLI Portfolio Application"
      ],
      practice_activities: [
        "Write pytest test suites for your Week 3 bank system",
        "Build and package a live Weather CLI fetching data from a REST API"
      ],
      topic_references: [
        { title: "pytest Documentation: Getting Started", url: "https://docs.pytest.org/en/stable/getting-started.html" },
        { title: "Real Python: Effective Python Testing with pytest", url: "https://realpython.com/pytest-python-testing/" },
        { title: "Real Python: Python requests Library", url: "https://realpython.com/python-requests/" },
        { title: "GitHub: Python CLI Project Templates", url: "https://github.com/topics/python-cli" }
      ],
      resources: [
        {
          title: "Building Production Python CLI Apps",
          type: "tutorial",
          estimated_time: "1.5 hr",
          description: "Step-by-step tutorial on building, testing, and deploying command-line tools.",
          provider: "Real Python",
          url: "https://realpython.com/python-cli-testing/"
        }
      ]
    }
  ],
  mini_project: {
    title: "Personal Finance & Expense Tracker CLI",
    description: "An end-to-end command line application using OOP, JSON persistence, and comprehensive pytest test coverage."
  },
  career_milestone: {
    title: "Junior Python Developer Readiness",
    description: "Understand idiomatic syntax, OOP design patterns, and testing conventions expected in professional dev teams."
  }
};
