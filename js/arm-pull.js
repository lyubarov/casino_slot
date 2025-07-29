document.addEventListener("DOMContentLoaded", () => {
    const handle = document.querySelector("#slot-trigger");
    const arm = document.querySelector("#slot-trigger .arm");
    const knob = document.querySelector("#slot-trigger .knob");
    const shadow = document.querySelector("#slot-trigger .arm-shadow");
    const ring1Shadow = document.querySelector("#slot-trigger .ring1 .shadow");
    const ring2Shadow = document.querySelector("#slot-trigger .ring2 .shadow");

    if (!handle || !arm || !knob || !shadow || !ring1Shadow || !ring2Shadow) {
        console.warn("Не знайдені деякі елементи ручки");
        return;
    }

    handle.addEventListener("click", () => {
        // 🔽 Анімація ручки вниз (масштаб ×2)
        arm.style.transition = "all 0.3s ease";
        knob.style.transition = "all 0.3s ease";
        shadow.style.transition = "all 0.3s ease";
        ring1Shadow.style.transition = "all 0.3s ease";
        ring2Shadow.style.transition = "all 0.3s ease";

        arm.style.top = "90px";            // Було 45px
        arm.style.height = "4%";           // Було 2%
        knob.style.top = "-40px";          // Було -20px
        knob.style.height = "40px";        // Було 20px
        shadow.style.top = "80px";         // Було 40px

        ring1Shadow.style.top = "50%";
        ring1Shadow.style.opacity = "1";
        ring2Shadow.style.top = "50%";
        ring2Shadow.style.opacity = "1";

        // 🔼 Повернення ручки назад (масштаб ×2)
        setTimeout(() => {
            arm.style.top = "-50px";       // Було -25px
            arm.style.height = "50%";     // Було 50%
            knob.style.top = "-30px";      // Було -15px
            knob.style.height = "32px";    // Було 16px
            shadow.style.top = "26px";     // Було 13px

            ring1Shadow.style.top = "0";
            ring1Shadow.style.opacity = "0";
            ring2Shadow.style.top = "0";
            ring2Shadow.style.opacity = "0";
        }, 500);

        // ▶️ Запуск анімації слотів через фейкову кнопку
        const fakeButton = document.createElement('button');
        fakeButton.disabled = false;
        spin(fakeButton);
    });
});
