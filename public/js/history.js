document.addEventListener('DOMContentLoaded', () => {
    displayHistory();
    document.getElementById('clearHistory').addEventListener('click', clearHistory);
});

function displayHistory() {
    const historyList = document.getElementById('historyList');
    const history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    historyList.innerHTML = '';
    if (history.length === 0) {
        historyList.innerHTML = '<p class="text-center">No search history available.</p>';
        return;
    }
    history.forEach(city => {
        const cityDiv = document.createElement('div');
        cityDiv.className = 'p-2 border-b cursor-pointer hover:bg-gray-100';
        cityDiv.textContent = city;
        cityDiv.addEventListener('click', () => {
            window.location.href = `/index.html?city=${encodeURIComponent(city)}`;
        });
        historyList.appendChild(cityDiv);
    });
}

function clearHistory() {
    localStorage.removeItem('weatherHistory');
    displayHistory();
}