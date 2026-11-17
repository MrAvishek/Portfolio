from pathlib import Path

# Root project directory
PROJECT_NAME = "Portfolio"

# Directory structure
directories = [
    "assets",
    "assets/images",
    "assets/icons",
    "assets/fonts",

    "css",
    "css/components",
    "css/pages",

    "js",
    "js/components",
    "js/pages",
    "js/utils",

    "data",

    "projects",
    "projects/agentic-ai",
    "projects/genai-rag",
    "projects/ml-computer-vision",
    "projects/robotics-iot",
    "projects/web-development",

    "docs",
]

# Files to create
files = [
    "index.html",
    "README.md",
    ".gitignore",

    "css/style.css",

    "js/main.js",

    "data/projects.json",

    "about.html",
]

# Create root directory
root = Path(PROJECT_NAME)
root.mkdir(exist_ok=True)

# Create directories
for directory in directories:
    (root / directory).mkdir(parents=True, exist_ok=True)

# Create files
for file in files:
    file_path = root / file
    file_path.parent.mkdir(parents=True, exist_ok=True)

    if not file_path.exists():
        file_path.touch()

print(f"Portfolio structure created successfully at: {root.resolve()}")