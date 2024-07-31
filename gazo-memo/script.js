document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const dateContainer = document.getElementById('date-container');
    const imageUrls = document.querySelectorAll('.image-url');
    const imageDisplays = document.querySelectorAll('.image-display');
    const imageMemos = document.querySelectorAll('.image-memo');
    const downloadDataButton = document.getElementById('download-data');
    const copyDataButton = document.getElementById('copy-data');

    // Initialize theme
    const currentTheme = localStorage.getItem('theme') || 'light-theme';
    document.body.classList.add(currentTheme);
    document.querySelectorAll('input[type="text"], textarea').forEach(element => {
        element.classList.add(currentTheme);
    });

    // Toggle theme
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        document.body.classList.toggle('dark-theme');
        document.querySelectorAll('input[type="text"], textarea').forEach(element => {
            element.classList.toggle('light-theme');
            element.classList.toggle('dark-theme');
        });
        const newTheme = document.body.classList.contains('light-theme') ? 'light-theme' : 'dark-theme';
        localStorage.setItem('theme', newTheme);
    });

    // Display current date
    const updateDate = () => {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateContainer.textContent = now.toLocaleDateString('en-US', options);
    };
    updateDate();
    setInterval(updateDate, 60000); // Update date every minute

    // Handle image URLs input and memos
    imageUrls.forEach((input, index) => {
        const savedUrl = localStorage.getItem(`imageUrl${index}`);
        const savedMemo = localStorage.getItem(`imageMemo${index}`);
        if (savedUrl) {
            input.value = savedUrl;
            imageDisplays[index].src = savedUrl;
        }
        if (savedMemo) {
            imageMemos[index].value = savedMemo;
        }
        input.addEventListener('input', () => {
            const url = input.value;
            imageDisplays[index].src = url;
            localStorage.setItem(`imageUrl${index}`, url);
        });
        imageMemos[index].addEventListener('input', () => {
            const memoText = imageMemos[index].value;
            localStorage.setItem(`imageMemo${index}`, memoText);
        });
    });

    // Download data
    const downloadData = () => {
        let data = '';
        imageUrls.forEach((input, index) => {
            data += `Image URL ${index + 1}: ${input.value}\n`;
            data += `Image Memo ${index + 1}: ${imageMemos[index].value}\n\n`;
        });
        const blob = new Blob([data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    downloadDataButton.addEventListener('click', downloadData);

    // Copy data to clipboard
    const copyData = () => {
        let data = '';
        imageUrls.forEach((input, index) => {
            data += `Image URL ${index + 1}: ${input.value}\n`;
            data += `Image Memo ${index + 1}: ${imageMemos[index].value}\n\n`;
        });
        navigator.clipboard.writeText(data).then(() => {
            alert('Data copied to clipboard');
        }, (err) => {
            alert('Failed to copy data: ', err);
        });
    };

    copyDataButton.addEventListener('click', copyData);
});
