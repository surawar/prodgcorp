"use strict";

/*
 * ProDG content catalogue
 * ----------------------
 * This is the single source of placeholder content for the Learn / Build UI.
 * Replace placeholder values as content is produced; IDs should remain stable
 * because links, progress records, and future APIs can use them as references.
 *
 * A lesson's videoUrl is deliberately null until a hosted video exists.
 * sourceUrl and githubUrl are deliberately null until a public resource exists.
 * No enrolment, payment, authentication, completion, or certificate logic lives here.
 */
window.PRODG_CATALOG = {
    courses: [
        {
            id: "python-problem-solvers",
            title: "Python for problem solvers",
            status: "coming-soon",
            level: "Beginner",
            duration: "6h 20m",
            totalCredits: 180,
            summary: "Get fluent in the language behind automation, data, AI and so much more.",
            description: "A practical introduction to Python for learners who want to understand the fundamentals and apply them to useful problems.",
            tags: ["Python", "Automation"],
            modules: [
                {
                    id: "python-start-here",
                    title: "Start here",
                    description: "Set up a useful learning environment and write your first Python program.",
                    lessons: [
                        { id: "python-welcome", title: "Welcome to Python", status: "coming-soon", duration: "08:00", description: "What Python is good at and what you will build with it.", videoUrl: null, earnedCredits: 10 },
                        { id: "python-first-program", title: "Your first program", status: "coming-soon", duration: "12:00", description: "Write, run, and understand a simple Python program.", videoUrl: null, earnedCredits: 15 }
                    ]
                },
                {
                    id: "python-core-concepts",
                    title: "Core concepts",
                    description: "Learn the values, variables, conditions, and loops behind everyday Python programs.",
                    lessons: [
                        { id: "python-values", title: "Values and variables", status: "coming-soon", duration: "14:00", description: "Store information and use it clearly.", videoUrl: null, earnedCredits: 15 },
                        { id: "python-decisions", title: "Making decisions", status: "coming-soon", duration: "16:00", description: "Guide a program with conditions and comparisons.", videoUrl: null, earnedCredits: 20 }
                    ]
                }
            ]
        },
        {
            id: "java-essentials",
            title: "Java essentials",
            status: "coming-soon",
            level: "Beginner",
            duration: "7h 45m",
            totalCredits: 210,
            summary: "Learn to think in objects and create dependable applications.",
            description: "A beginner-friendly path through Java syntax, object-oriented thinking, and small practical programs.",
            tags: ["Java", "Fundamentals"],
            modules: [
                {
                    id: "java-foundations",
                    title: "Java foundations",
                    description: "Meet Java, its syntax, and the parts of a simple application.",
                    lessons: [
                        { id: "java-orientation", title: "Java orientation", status: "coming-soon", duration: "10:00", description: "Understand the Java ecosystem and program structure.", videoUrl: null, earnedCredits: 10 },
                        { id: "java-types", title: "Types and variables", status: "coming-soon", duration: "15:00", description: "Work with values and basic data types.", videoUrl: null, earnedCredits: 15 }
                    ]
                }
            ]
        },
        {
            id: "c-ground-up",
            title: "C, from the ground up",
            status: "coming-soon",
            level: "Fundamentals",
            duration: "6h 50m",
            totalCredits: 190,
            summary: "Understand how programs work closer to the machine.",
            description: "An approachable introduction to C, memory-aware thinking, and the foundations of systems programming.",
            tags: ["C", "Systems"],
            modules: [
                {
                    id: "c-basics",
                    title: "C basics",
                    description: "Build an understanding of C syntax and program flow.",
                    lessons: [
                        { id: "c-hello", title: "Hello, C", status: "coming-soon", duration: "09:00", description: "Compile and run your first C program.", videoUrl: null, earnedCredits: 10 },
                        { id: "c-memory", title: "A first look at memory", status: "coming-soon", duration: "18:00", description: "Understand why memory matters in C.", videoUrl: null, earnedCredits: 20 }
                    ]
                }
            ]
        },
        {
            id: "modern-cpp",
            title: "Modern C++",
            status: "coming-soon",
            level: "Intermediate",
            duration: "9h 10m",
            totalCredits: 250,
            summary: "Level up with a language made for performance and possibility.",
            description: "Explore modern C++ concepts, clean program design, and tools for building fast, reliable software.",
            tags: ["C++", "Performance"],
            modules: [
                {
                    id: "cpp-modern-basics",
                    title: "Modern basics",
                    description: "Refresh C++ foundations through a modern lens.",
                    lessons: [
                        { id: "cpp-modern-tour", title: "A modern C++ tour", status: "coming-soon", duration: "14:00", description: "See the language features used in contemporary C++.", videoUrl: null, earnedCredits: 15 },
                        { id: "cpp-resource-safety", title: "Resource safety", status: "coming-soon", duration: "20:00", description: "An introduction to safer ownership patterns.", videoUrl: null, earnedCredits: 25 }
                    ]
                }
            ]
        }
    ],

    videos: [
        { id: "first-program", title: "Why your first program matters more than you think", status: "coming-soon", category: "Python basics", duration: "08:24", description: "A short introduction to the value of a first program.", summary: "Start with a simple idea and see where a few lines of code can take you.", videoUrl: null, earnedCredits: 10, relatedCourseId: "python-problem-solvers" },
        { id: "objects-no-jargon", title: "Objects, explained without the jargon", status: "coming-soon", category: "Java", duration: "05:18", description: "A clear introduction to object-oriented thinking.", summary: "A clear introduction to object-oriented thinking.", videoUrl: null, earnedCredits: 10, relatedCourseId: "java-essentials" },
        { id: "learning-busy", title: "How to keep learning when life gets busy", status: "coming-soon", category: "Career", duration: "07:42", description: "A practical approach to protecting your learning time.", summary: "A practical approach to protecting your learning time.", videoUrl: null, earnedCredits: 10, relatedCourseId: null },
        { id: "why-cpp", title: "What makes C++ a language worth knowing?", status: "coming-soon", category: "C++", duration: "10:05", description: "A quick look at a language built for performance and control.", summary: "A quick look at a language built for performance and control.", videoUrl: null, earnedCredits: 10, relatedCourseId: "modern-cpp" }
    ],

    projects: [
        {
            id: "finance-tracker",
            title: "Personal finance tracker",
            status: "coming-soon",
            category: "Web app",
            difficulty: "Beginner+",
            level: "Beginner+",
            summary: "Create a useful web app with data, dashboards and a clean user experience.",
            description: "Build a personal finance tracker that lets a user record transactions, view simple summaries, and practise designing a thoughtful dashboard.",
            skills: ["Python", "Data modelling", "Web UI", "Charts"],
            tags: ["Python", "Web app", "Portfolio"],
            githubUrl: null,
            sourceUrl: null,
            relatedCourseId: "python-problem-solvers"
        },
        {
            id: "project-ideas",
            title: "Find your next build",
            status: "coming-soon",
            category: "Project ideas",
            difficulty: "All levels",
            level: "All levels",
            summary: "Practical prompts for every stage of your journey.",
            description: "A growing set of project prompts that can be adapted to a learner's current skills and portfolio goals.",
            skills: ["Problem framing", "Planning"],
            tags: ["Ideas", "Practice"],
            githubUrl: null,
            sourceUrl: null,
            relatedCourseId: null
        },
        {
            id: "source-resources",
            title: "Learn from real code",
            status: "coming-soon",
            category: "Source resources",
            difficulty: "All levels",
            level: "All levels",
            summary: "Starter repos, GitHub resources and useful references.",
            description: "A curated collection of starter repositories and examples designed to make source code easier to explore.",
            skills: ["Reading code", "Version control"],
            tags: ["GitHub", "Source code"],
            githubUrl: null,
            sourceUrl: null,
            relatedCourseId: null
        },
        {
            id: "portfolio-path",
            title: "Show what you can do",
            status: "coming-soon",
            category: "Portfolio path",
            difficulty: "All levels",
            level: "All levels",
            summary: "Shape projects into work that tells your story.",
            description: "A practical guide for selecting, presenting, and explaining portfolio work with clarity.",
            skills: ["Communication", "Portfolio design"],
            tags: ["Portfolio", "Career"],
            githubUrl: null,
            sourceUrl: null,
            relatedCourseId: null
        }
    ]
};
