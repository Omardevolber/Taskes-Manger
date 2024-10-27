document.addEventListener("DOMContentLoaded", () => {
    loadAllSavedDays();
});

function loadAllSavedDays() {
    const fileList = document.getElementById('all-file-list');
    fileList.innerHTML = "<h3>All Saved Days:</h3>";

    // قراءة جميع المفاتيح في LocalStorage
    let dates = [];
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith("dailyTasks_")) {
            const date = key.split("_")[1];
            dates.push(date);
        }
    });

    // فرز التواريخ من الأقدم إلى الأحدث
    dates.sort((a, b) => new Date(a) - new Date(b));

    dates.forEach(date => {
        const fileDiv = document.createElement('div');
        fileDiv.className = 'file';

        const fileContent = document.createElement('div');
        fileContent.style.display = 'flex';
        fileContent.style.alignItems = 'center';
        fileContent.onclick = () => showSavedTasks(date);

        const fileIcon = document.createElement('span');
        fileIcon.className = 'file-icon';
        fileIcon.textContent = '📁';

        const fileLabel = document.createElement('span');
        fileLabel.textContent = date;

        fileContent.appendChild(fileIcon);
        fileContent.appendChild(fileLabel);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = '🗑️';
        deleteButton.onclick = (e) => {
            e.stopPropagation(); // منع النقر على الملف من تفعيل عرض المهام عند النقر على زر الحذف فقط
            deleteFile(date);
        };

        fileDiv.appendChild(fileContent);
        fileDiv.appendChild(deleteButton);

        fileList.appendChild(fileDiv);
    });
}

function deleteFile(date) {
    if (confirm(`Are you sure you want to delete tasks for ${date}?`)) {
        localStorage.removeItem(`dailyTasks_${date}`);
        loadAllSavedDays();
    }
}

function searchTasks() {
    const dateInput = document.getElementById('search-date').value.trim();
    const searchResult = document.getElementById('search-result');
    searchResult.innerHTML = ""; // تفريغ النتائج السابقة

    if (dateInput === "") {
        alert("Please enter a date to search.");
        return;
    }

    // جلب المهام المحفوظة من LocalStorage باستخدام التاريخ المحدد
    const savedTasks = JSON.parse(localStorage.getItem(`dailyTasks_${dateInput}`));

    if (savedTasks) {
        const resultHeader = document.createElement('h3');
        resultHeader.textContent = `Tasks for ${dateInput}:`;
        searchResult.appendChild(resultHeader);

        savedTasks.forEach((task, index) => {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'task-item';

            if (task.completed) {
                taskDiv.classList.add('completed');
            }

            // عرض نص المهمة فقط بدون كلمة (Due: التاريخ)
            const taskText = task.text.split("(Due:")[0].trim();
            const taskLabel = document.createElement('span');
            taskLabel.textContent = taskText;

            const deleteTaskButton = document.createElement('button');
            deleteTaskButton.className = 'delete-task-button';
            deleteTaskButton.textContent = '🗑️';
            deleteTaskButton.onclick = () => deleteTask(dateInput, index);

            taskDiv.appendChild(taskLabel);
            taskDiv.appendChild(deleteTaskButton);

            searchResult.appendChild(taskDiv);
        });

        // إظهار زر الإغلاق عند عرض المهام
        document.getElementById('close-tasks-button').style.display = "block";
    } else {
        const noResult = document.createElement('p');
        noResult.textContent = "No tasks found for this date.";
        searchResult.appendChild(noResult);
    }
}

function deleteTask(date, taskIndex) {
    const savedTasks = JSON.parse(localStorage.getItem(`dailyTasks_${date}`));
    if (savedTasks) {
        savedTasks.splice(taskIndex, 1); // إزالة المهمة من القائمة
        localStorage.setItem(`dailyTasks_${date}`, JSON.stringify(savedTasks)); // تحديث LocalStorage
        searchTasks(); // إعادة تحميل المهام لتحديث العرض
    }
}

function showSavedTasks(date) {
    // استخدام دالة البحث لعرض المهام لهذا التاريخ
    document.getElementById('search-date').value = date;
    searchTasks();

    // إخفاء قائمة الملفات وإظهار زر الإغلاق
    document.getElementById('all-file-list').style.display = "none";
    document.getElementById('close-tasks-button').style.display = "block";
}

function closeTasks() {
    // إخفاء عرض المهام وإظهار قائمة الأيام المحفوظة
    document.getElementById('search-result').innerHTML = "";
    document.getElementById('all-file-list').style.display = "block";
    document.getElementById('close-tasks-button').style.display = "none";
}

