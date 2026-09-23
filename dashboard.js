"use strict";

const student = {
    name: "Student",
    currentStreak: 0,
    longestStreak: 0,
    courseProgress: 0,
    todayCompleted: false
};

function updateDashboard() {
    const firstName = student.name.split(" ")[0];

    const welcomeTitle = document.getElementById("welcomeTitle");
    const profileName = document.getElementById("profileName");
    const profileAvatar = document.getElementById("profileAvatar");

    if (welcomeTitle) {
        welcomeTitle.textContent = `Welcome back, ${firstName}.`;
    }

    if (profileName) {
        profileName.textContent = student.name;
    }

    if (profileAvatar) {
        profileAvatar.textContent = firstName.charAt(0).toUpperCase();
    }

    document.getElementById("currentStreak").textContent =
        student.currentStreak;

    document.getElementById("streakNumber").textContent =
        student.currentStreak;

    document.getElementById("longestStreak").textContent =
        student.longestStreak;

    document.getElementById("courseProgress").textContent =
        `${student.courseProgress}%`;

    document.getElementById("courseProgressBar").style.width =
        `${student.courseProgress}%`;

    if (student.todayCompleted) {
        document.getElementById("todayStatus").textContent = "Completed";

        document.getElementById("todayMessage").textContent =
            "You completed meaningful learning activity today.";
    }
}

document.addEventListener("DOMContentLoaded", updateDashboard);