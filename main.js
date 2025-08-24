document.addEventListener('DOMContentLoaded', () => {
    const timeElement = document.getElementById('time');

    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        let displayHours = hours % 12;
        displayHours = displayHours ? displayHours : 12; // the hour '0' should be '12'
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        timeElement.innerHTML = `${displayHours}:${minutes}:${seconds} <span class="am-pm">${ampm}</span>`;
    }

    // Update time initially and then every second
    updateTime();
    setInterval(updateTime, 1000);

    function changeBackgroundColor() {
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        document.body.style.backgroundColor = randomColor;
    }

    // Change background color initially and then every 5 seconds
    changeBackgroundColor();
    setInterval(changeBackgroundColor, 5000);
});