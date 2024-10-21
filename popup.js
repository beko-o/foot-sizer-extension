document.addEventListener('DOMContentLoaded', function() {
    // Загрузить последние сохраненные данные
    chrome.storage.local.get(['lastFootLength', 'lastSizeSystem', 'lastUnit'], function(result) {
        if (result.lastFootLength) {
            document.getElementById('footLength').value = result.lastFootLength;
        }
        if (result.lastSizeSystem) {
            document.getElementById('sizeSystem').value = result.lastSizeSystem;
        }
        if (result.lastUnit) {
            document.getElementById('unit').value = result.lastUnit;
        }
    });
});

document.getElementById('findSize').addEventListener('click', function() {
    let footLength = parseFloat(document.getElementById('footLength').value);
    const sizeSystem = document.getElementById('sizeSystem').value;
    const unit = document.getElementById('unit').value;
    let result = '';

    if (isNaN(footLength) || footLength <= 0) {
        result = 'Please enter a valid foot length.';
    } else {
        if (unit === 'in') {
            footLength = footLength * 2.54;
        }
        result = getShoeSize(footLength, sizeSystem);

        // Сохранить данные
        chrome.storage.local.set({
            lastFootLength: document.getElementById('footLength').value,
            lastSizeSystem: sizeSystem,
            lastUnit: unit
        });
    }

    document.getElementById('result').textContent = result;

    // Автоматическое копирование в буфер обмена
    if (result) {
        navigator.clipboard.writeText(result).then(() => {
            showNotification('Result copied to clipboard!');
        }).catch(err => {
            showNotification('Failed to copy result.');
        });
    }
});

document.getElementById('showInstructions').addEventListener('click', function() {
    document.getElementById('instructions').style.display = 'block';
});

document.getElementById('closeInstructions').addEventListener('click', function() {
    document.getElementById('instructions').style.display = 'none';
});

function getShoeSize(length, system) {
    // Таблицы размеров обуви (примерные значения)
    const sizeTables = {
        EU: [
            { min: 22, max: 22.5, size: 35 },
            { min: 22.6, max: 23.3, size: 35.5 },
            { min: 23.4, max: 24, size: 36 },
            { min: 24.1, max: 24.7, size: 37 },
            { min: 24.8, max: 25.4, size: 38 },
            { min: 25.5, max: 26.1, size: 39 },
            { min: 26.2, max: 26.8, size: 40 },
            { min: 26.9, max: 27.5, size: 41 },
            { min: 27.6, max: 28.2, size: 42 },
            { min: 28.3, max: 28.9, size: 43 },
            { min: 29, max: 29.6, size: 44 },
            { min: 29.7, max: 30.3, size: 45 },
            { min: 30.4, max: Infinity, size: "46+" }
        ],
        "US Men": [
            { min: 22, max: 22.5, size: 4 },
            { min: 22.6, max: 23.3, size: 4.5 },
            { min: 23.4, max: 24, size: 5 },
            { min: 24.1, max: 24.7, size: 6 },
            { min: 24.8, max: 25.4, size: 7 },
            { min: 25.5, max: 26.1, size: 8 },
            { min: 26.2, max: 26.8, size: 9 },
            { min: 26.9, max: 27.5, size: 10 },
            { min: 27.6, max: 28.2, size: 11 },
            { min: 28.3, max: 28.9, size: 12 },
            { min: 29, max: 29.6, size: 13 },
            { min: 29.7, max: 30.3, size: "14+" }
        ],
        "US Women": [
            { min: 22, max: 22.5, size: 5 },
            { min: 22.6, max: 23.3, size: 5.5 },
            { min: 23.4, max: 24, size: 6 },
            { min: 24.1, max: 24.7, size: 7 },
            { min: 24.8, max: 25.4, size: 8 },
            { min: 25.5, max: 26.1, size: 9 },
            { min: 26.2, max: 26.8, size: 10 },
            { min: 26.9, max: 27.5, size: 11 },
            { min: 27.6, max: 28.2, size: 12 },
            { min: 28.3, max: 28.9, size: 13 },
            { min: 29, max: 29.6, size: "14+" }
        ],
        UK: [
            { min: 22, max: 22.5, size: 2 },
            { min: 22.6, max: 23.3, size: 2.5 },
            { min: 23.4, max: 24, size: 3 },
            { min: 24.1, max: 24.7, size: 4 },
            { min: 24.8, max: 25.4, size: 5 },
            { min: 25.5, max: 26.1, size: 6 },
            { min: 26.2, max: 26.8, size: 7 },
            { min: 26.9, max: 27.5, size: 8 },
            { min: 27.6, max: 28.2, size: 9 },
            { min: 28.3, max: 28.9, size: 10 },
            { min: 29, max: 29.6, size: 11 },
            { min: 29.7, max: 30.3, size: "12+" }
        ],
        JP: [
            { min: 22, max: 22.5, size: 22 },
            { min: 22.6, max: 23.3, size: 22.5 },
            { min: 23.4, max: 24, size: 23 },
            { min: 24.1, max: 24.7, size: 24 },
            { min: 24.8, max: 25.4, size: 25 },
            { min: 25.5, max: 26.1, size: 26 },
            { min: 26.2, max: 26.8, size: 27 },
            { min: 26.9, max: 27.5, size: 28 },
            { min: 27.6, max: 28.2, size: 29 },
            { min: 28.3, max: 28.9, size: 30 },
            { min: 29, max: 29.6, size: 31 },
            { min: 29.7, max: 30.3, size: "32+" }
        ],
        TR: [
            // Таблица размеров для Турции (примерные значения, уточните при необходимости)
            { min: 22, max: 22.5, size: 35 },
            { min: 22.6, max: 23.3, size: 35.5 },
            { min: 23.4, max: 24, size: 36 },
            { min: 24.1, max: 24.7, size: 37 },
            { min: 24.8, max: 25.4, size: 38 },
            { min: 25.5, max: 26.1, size: 39 },
            { min: 26.2, max: 26.8, size: 40 },
            { min: 26.9, max: 27.5, size: 41 },
            { min: 27.6, max: 28.2, size: 42 },
            { min: 28.3, max: 28.9, size: 43 },
            { min: 29, max: 29.6, size: 44 },
            { min: 29.7, max: 30.3, size: "45+" }
        ]
    };

    const table = sizeTables[system];
    if (!table) {
        return 'Unknown size system.';
    }

    for (let entry of table) {
        if (length >= entry.min && length <= entry.max) {
            if (typeof entry.size === 'function') {
                return entry.size(length);
            }
            return `Your shoe size is ${entry.size} (${system})`;
        }
    }

    return 'Shoe size not found for the given foot length.';
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Анимация появления
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Скрытие через 3 секунды
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
