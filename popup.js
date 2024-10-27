document.addEventListener('DOMContentLoaded', function() {
    // Загрузить последние сохраненные данные
    chrome.storage.local.get(['lastFootLength', 'lastUnit', 'showImage', 'theme'], function(result) {
        if (result.lastFootLength) {
            document.getElementById('footLength').value = result.lastFootLength;
            updateSizes();
        }
        if (result.lastUnit) {
            document.getElementById('unit').value = result.lastUnit;
        }
        if (result.showImage) {
            const image = document.querySelector('.header-image');
            image.classList.remove('hidden');
        }
        if (result.theme === 'dark') {
            toggleTheme(false);
        }
    });

    // Добавляем обработчики событий
    document.getElementById('footLength').addEventListener('input', updateSizes);
    document.getElementById('unit').addEventListener('change', updateSizes);
    document.getElementById('toggleImage').addEventListener('click', function() {
        toggleImage(true);
    });
    document.getElementById('toggleTheme').addEventListener('click', function() {
        toggleTheme(true);
    });
});

function updateSizes() {
    let footLength = parseFloat(document.getElementById('footLength').value);
    const unit = document.getElementById('unit').value;

    if (isNaN(footLength) || footLength <= 0) {
        document.getElementById('result').textContent = 'Please enter a valid foot length.';
        return;
    }

    if (unit === 'in') {
        footLength = footLength * 2.54;
    }

    // Сохранить данные
    chrome.storage.local.set({
        lastFootLength: document.getElementById('footLength').value,
        lastUnit: unit
    });

    const sizes = getAllSizes(footLength);
    displaySizes(sizes);
}

function getAllSizes(length) {
    const sizeSystems = ['EU', 'US Men', 'US Women', 'UK', 'JP', 'AU', 'CN', 'KR', 'RU', 'BR', 'MX'];
    const sizes = {};

    for (let system of sizeSystems) {
        const size = getShoeSize(length, system);
        sizes[system] = size;
    }

    return sizes;
}

function displaySizes(sizes) {
    let resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    const table = document.createElement('table');
    table.classList.add('size-table');
    const tbody = document.createElement('tbody');

    // Добавляем заголовок таблицы
    const headerRow = document.createElement('tr');
    const headerSystem = document.createElement('th');
    headerSystem.textContent = 'System';
    const headerSize = document.createElement('th');
    headerSize.textContent = 'Size';
    headerRow.appendChild(headerSystem);
    headerRow.appendChild(headerSize);
    tbody.appendChild(headerRow);

    for (let system in sizes) {
        const row = document.createElement('tr');
        const systemCell = document.createElement('td');
        systemCell.textContent = system;
        const sizeCell = document.createElement('td');
        sizeCell.textContent = sizes[system];
        row.appendChild(systemCell);
        row.appendChild(sizeCell);
        tbody.appendChild(row);
    }

    table.appendChild(tbody);
    resultDiv.appendChild(table);
}

function getShoeSize(length, system) {
    const sizeTables = {
        EU: [
            { min: 22.1, max: 22.5, size: 35 },
            { min: 22.6, max: 23, size: 36 },
            { min: 23.1, max: 23.5, size: 37 },
            { min: 23.6, max: 24, size: 38 },
            { min: 24.1, max: 24.5, size: 39 },
            { min: 24.6, max: 25, size: 40 },
            { min: 25.1, max: 25.5, size: 41 },
            { min: 25.6, max: 26, size: 42 },
            { min: 26.1, max: 26.5, size: 43 },
            { min: 26.6, max: 27, size: 44 },
            { min: 27.1, max: 27.5, size: 45 },
            { min: 27.6, max: 28, size: 46 },
            { min: 28.1, max: 28.5, size: 47 },
            { min: 28.6, max: 29, size: 48 },
            { min: 29.1, max: 29.5, size: 49 },
            { min: 29.6, max: 30, size: 50 }
        ],
        "US Men": [
            { min: 22.1, max: 22.5, size: 4 },
            { min: 22.6, max: 23, size: 5 },
            { min: 23.1, max: 23.5, size: 6 },
            { min: 23.6, max: 24, size: 7 },
            { min: 24.1, max: 24.5, size: 8 },
            { min: 24.6, max: 25, size: 9 },
            { min: 25.1, max: 25.5, size: 10 },
            { min: 25.6, max: 26, size: 11 },
            { min: 26.1, max: 26.5, size: 12 },
            { min: 26.6, max: 27, size: 13 },
            { min: 27.1, max: 27.5, size: 14 }
        ],
        "US Women": [
            { min: 21.6, max: 22, size: 5 },
            { min: 22.1, max: 22.5, size: 6 },
            { min: 22.6, max: 23, size: 7 },
            { min: 23.1, max: 23.5, size: 8 },
            { min: 23.6, max: 24, size: 9 },
            { min: 24.1, max: 24.5, size: 10 },
            { min: 24.6, max: 25, size: 11 },
            { min: 25.1, max: 25.5, size: 12 }
        ],
        UK: [
            { min: 22.1, max: 22.5, size: 3 },
            { min: 22.6, max: 23, size: 4 },
            { min: 23.1, max: 23.5, size: 5 },
            { min: 23.6, max: 24, size: 6 },
            { min: 24.1, max: 24.5, size: 7 },
            { min: 24.6, max: 25, size: 8 },
            { min: 25.1, max: 25.5, size: 9 },
            { min: 25.6, max: 26, size: 10 },
            { min: 26.1, max: 26.5, size: 11 },
            { min: 26.6, max: 27, size: 12 }
        ],
        JP: [
            { min: 22.1, max: 22.5, size: 22.5 },
            { min: 22.6, max: 23, size: 23 },
            { min: 23.1, max: 23.5, size: 23.5 },
            { min: 23.6, max: 24, size: 24 },
            { min: 24.1, max: 24.5, size: 24.5 },
            { min: 24.6, max: 25, size: 25 },
            { min: 25.1, max: 25.5, size: 25.5 },
            { min: 25.6, max: 26, size: 26 },
            { min: 26.1, max: 26.5, size: 26.5 },
            { min: 26.6, max: 27, size: 27 }
        ],
        AU: [
            { min: 22.1, max: 22.5, size: 4 },
            { min: 22.6, max: 23, size: 5 },
            { min: 23.1, max: 23.5, size: 6 },
            { min: 23.6, max: 24, size: 7 },
            { min: 24.1, max: 24.5, size: 8 },
            { min: 24.6, max: 25, size: 9 },
            { min: 25.1, max: 25.5, size: 10 },
            { min: 25.6, max: 26, size: 11 },
            { min: 26.1, max: 26.5, size: 12 },
            { min: 26.6, max: 27, size: 13 }
        ],
        CN: [
            { min: 22.1, max: 22.5, size: 36 },
            { min: 22.6, max: 23, size: 37 },
            { min: 23.1, max: 23.5, size: 38 },
            { min: 23.6, max: 24, size: 39 },
            { min: 24.1, max: 24.5, size: 40 },
            { min: 24.6, max: 25, size: 41 },
            { min: 25.1, max: 25.5, size: 42 },
            { min: 25.6, max: 26, size: 43 },
            { min: 26.1, max: 26.5, size: 44 },
            { min: 26.6, max: 27, size: 45 }
        ],
        KR: [
            { min: 22.1, max: 22.5, size: 225 },
            { min: 22.6, max: 23, size: 230 },
            { min: 23.1, max: 23.5, size: 235 },
            { min: 23.6, max: 24, size: 240 },
            { min: 24.1, max: 24.5, size: 245 },
            { min: 24.6, max: 25, size: 250 },
            { min: 25.1, max: 25.5, size: 255 },
            { min: 25.6, max: 26, size: 260 },
            { min: 26.1, max: 26.5, size: 265 },
            { min: 26.6, max: 27, size: 270 }
        ],
        RU: [
            { min: 22.1, max: 22.5, size: 35 },
            { min: 22.6, max: 23, size: 36 },
            { min: 23.1, max: 23.5, size: 37 },
            { min: 23.6, max: 24, size: 38 },
            { min: 24.1, max: 24.5, size: 39 },
            { min: 24.6, max: 25, size: 40 },
            { min: 25.1, max: 25.5, size: 41 },
            { min: 25.6, max: 26, size: 42 },
            { min: 26.1, max: 26.5, size: 43 },
            { min: 26.6, max: 27, size: 44 }
        ],
        BR: [
            { min: 22.1, max: 22.5, size: 33 },
            { min: 22.6, max: 23, size: 34 },
            { min: 23.1, max: 23.5, size: 35 },
            { min: 23.6, max: 24, size: 36 },
            { min: 24.1, max: 24.5, size: 37 },
            { min: 24.6, max: 25, size: 38 },
            { min: 25.1, max: 25.5, size: 39 },
            { min: 25.6, max: 26, size: 40 },
            { min: 26.1, max: 26.5, size: 41 },
            { min: 26.6, max: 27, size: 42 }
        ],
        MX: [
            { min: 22.1, max: 22.5, size: 3 },
            { min: 22.6, max: 23, size: 4 },
            { min: 23.1, max: 23.5, size: 5 },
            { min: 23.6, max: 24, size: 6 },
            { min: 24.1, max: 24.5, size: 7 },
            { min: 24.6, max: 25, size: 8 },
            { min: 25.1, max: 25.5, size: 9 },
            { min: 25.6, max: 26, size: 10 },
            { min: 26.1, max: 26.5, size: 11 },
            { min: 26.6, max: 27, size: 12 }
        ]
    };

    const table = sizeTables[system];
    if (!table) {
        return 'Unknown size system.';
    }

    for (let entry of table) {
        if (length >= entry.min && length <= entry.max) {
            return entry.size.toString();
        }
    }

    return 'N/A';
}

function toggleImage(savePreference) {
    const image = document.querySelector('.header-image');
    image.classList.toggle('hidden');

    if (savePreference) {
        chrome.storage.local.set({ showImage: !image.classList.contains('hidden') });
    }
}

function toggleTheme(savePreference) {
    const body = document.body;
    body.classList.toggle('dark-theme');

    if (savePreference) {
        const theme = body.classList.contains('dark-theme') ? 'dark' : 'light';
        chrome.storage.local.set({ theme: theme });
    }
}
