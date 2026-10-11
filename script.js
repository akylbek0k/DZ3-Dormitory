const studentId = document.getElementById("studentId");
const buildingNumber = document.getElementById("buildingNumber");
const roomNumber = document.getElementById("roomNumber");
const checkButton = document.getElementById("checkButton");
const result = document.getElementById("result");

const API = "https://inai-col1.fishrungames.com";

async function getData(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Данные не найдены");
    }

    return await response.json();
}

async function checkRequest() {
    const student = studentId.value;
    const building = buildingNumber.value;
    const room = roomNumber.value;

    if (student === "" || building === "" || room === "") {
        result.innerHTML = `
            <p class="error">ОТКАЗ</p>
            <p>Заполните все поля формы.</p>
        `;
        return;
    }

    result.innerHTML = "<p>Проверяем заявку...</p>";

    try {
        // Выполняем только 3 GET-запроса
        const studentData = await getData(API + "/students/" + student);
        const buildingData = await getData(API + "/buildings/" + building);
        const roomData = await getData(API + "/rooms/" + room);

        const studentOk = studentData.resident;
        const buildingOk = buildingData.forStudents;
        const roomOk = roomData.available;

        if (studentOk && buildingOk && roomOk) {
            result.innerHTML = `
                <h2>ЗАЯВКА ОДОБРЕНА ✓</h2>
                <p class="ok">Студент является иногородним — ДА</p>
                <p class="ok">Корпус предназначен для студентов — ДА</p>
                <p class="ok">Комната свободна — ДА</p>
            `;
        } else {
            result.innerHTML = `
                <h2 class="error">ЗАЯВКА ОТКЛОНЕНА ✕</h2>
                <div class="check-list">
                    <p class="${studentOk ? "ok" : "error"}">
                        ${studentOk ? "✓" : "✕"} Студент является иногородним
                    </p>
                    <p class="${buildingOk ? "ok" : "error"}">
                        ${buildingOk ? "✓" : "✕"} Корпус предназначен для студентов
                    </p>
                    <p class="${roomOk ? "ok" : "error"}">
                        ${roomOk ? "✓" : "✕"} Комната свободна
                    </p>
                </div>
            `;
        }

    } catch (error) {
        result.innerHTML = `
            <h2 class="error">ОШИБКА</h2>
            <p>Не удалось получить данные. Проверьте введённые ID.</p>
        `;

        console.log(error);
    }
}

checkButton.addEventListener("click", checkRequest);
