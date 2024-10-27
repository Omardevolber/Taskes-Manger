document.addEventListener("DOMContentLoaded", () => {
    loadSavedDays();
    const dateInput = document.getElementById('task-date');
    dateInput.addEventListener('change', loadTasksForSelectedDate);
});

function addTask() {
    const taskInput = document.getElementById('task-input');
    const taskText = taskInput.value.trim();
    const taskDateInput = document.getElementById('task-date');
    const taskDate = taskDateInput.value.trim();

    if (taskText === "" || taskDate === "") {
        alert("Please enter both a task and a date.");
        return;
    }

    const taskList = document.getElementById('task-list');
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';

    const taskCheckbox = document.createElement('input');
    taskCheckbox.type = 'checkbox';

    // إزالة كلمة (Due: التاريخ) عند إنشاء المهمة
    const taskLabel = document.createElement('span');
    taskLabel.textContent = taskText.split("(Due:")[0].trim();

    taskDiv.appendChild(taskCheckbox);
    taskDiv.appendChild(taskLabel);

    taskList.appendChild(taskDiv);
    taskInput.value = "";
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task').forEach(task => {
        const taskText = task.querySelector('span').textContent;
        const isCompleted = task.querySelector('input[type="checkbox"]').checked;
        tasks.push({ text: taskText, completed: isCompleted });
    });

    const dateInput = document.getElementById('task-date');
    const date = dateInput.value.trim();

    if (date === "") {
        alert("Please enter a date to save tasks.");
        return;
    }

    if (tasks.length === 0) {
        alert("Please add tasks before saving.");
        return;
    }

    // حفظ المهام في LocalStorage مع مفتاح يتضمن التاريخ
    localStorage.setItem(`dailyTasks_${date}`, JSON.stringify(tasks));
    alert(`Tasks for ${date} saved successfully!`);

    // إعادة تحميل قائمة الأيام المحفوظة
    loadSavedDays();
}

function loadTasksForSelectedDate() {
    const dateInput = document.getElementById('task-date');
    const date = dateInput.value.trim();

    if (date === "") {
        return;
    }

    // جلب المهام المحفوظة من LocalStorage باستخدام التاريخ المحدد
    const savedTasks = JSON.parse(localStorage.getItem(`dailyTasks_${date}`));
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ""; // تفريغ قائمة المهام الحالية

    if (savedTasks) {
        savedTasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'task';

            const taskCheckbox = document.createElement('input');
            taskCheckbox.type = 'checkbox';
            taskCheckbox.checked = task.completed;

            // إزالة كلمة (Due: التاريخ) عند عرض المهمة
            const taskLabel = document.createElement('span');
            taskLabel.textContent = task.text.split("(Due:")[0].trim();

            taskDiv.appendChild(taskCheckbox);
            taskDiv.appendChild(taskLabel);

            taskList.appendChild(taskDiv);
        });
    }
}

function loadSavedDays() {
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = "<h3>Saved Days (Last 5 Days):</h3>";

    // قراءة جميع المفاتيح في LocalStorage
    let dates = [];
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith("dailyTasks_")) {
            const date = key.split("_")[1];
            dates.push(date);
        }
    });

    // فرز التواريخ من الأحدث إلى الأقدم، وعرض آخر 5 تواريخ فقط
    dates.sort((a, b) => new Date(b) - new Date(a));
    const lastFiveDates = dates.slice(0, 5);

    lastFiveDates.forEach(date => {
        const fileDiv = document.createElement('div');
        fileDiv.className = 'file';
        fileDiv.onclick = () => loadTasksForSelectedDateFromFolder(date);

        const fileIcon = document.createElement('span');
        fileIcon.className = 'file-icon';
        fileIcon.textContent = '📁';

        const fileLabel = document.createElement('span');
        fileLabel.textContent = date;

        fileDiv.appendChild(fileIcon);
        fileDiv.appendChild(fileLabel);

        fileList.appendChild(fileDiv);
    });
}

function loadTasksForSelectedDateFromFolder(date) {
    // تعيين التاريخ في input الخاص بالتاريخ وتحميل المهام المرتبطة به
    const dateInput = document.getElementById('task-date');
    dateInput.value = date;

    // تحميل المهام المرتبطة بالتاريخ المحدد
    loadTasksForSelectedDate();
}