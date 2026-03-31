let config = {};
let currentTab = 1;
const totalTabs = 4;
let passwordEntered = false;
let passwordAttempts = 0;

// Load configuration
fetch('config.json')
    .then(response => response.json())
    .then(data => {
        config = data;
        initializeUI();
    })
    .catch(error => console.error('Error loading config:', error));

function initializeUI() {
    document.getElementById('passwordTitle').textContent = config.messages.password_title;
    document.getElementById('passwordSubtitle').textContent = config.messages.password_subtitle;
    document.getElementById('birthdayGreeting').innerHTML = `HAPPY BIRTHDAY, ${config.birthday.name.toUpperCase()}!<br><span class='greeting-subtitle'>(super late because i lost the website)</span>`;
    document.getElementById('birthdayMessage').innerHTML = config.messages.birthday_message;
    document.getElementById('envelopeText').textContent = config.messages.envelope_text;
    document.getElementById('envelopeHint').textContent = config.messages.envelope_hint;
    document.getElementById('choiceQuestion').innerHTML = config.messages.choice_question;
    document.getElementById('choiceYes').innerHTML = config.messages.choice_yes;
    document.getElementById('choiceNo').innerHTML = config.messages.choice_no;
    document.getElementById('messageHeader').textContent = config.messages.message_header;
    document.getElementById('noChoiceMessage').textContent = config.messages.no_choice_message;
    
    const messageHTML = config.messages.birthday_message_content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line)
        .map(line => `<p>${line}</p>`)
        .join('');
    document.getElementById('messageContent').innerHTML = messageHTML;

    updateNavigationButtons();
}

function showPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'popup-notification';
    popup.textContent = message;
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.add('show');
    }, 10);

    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => {
            popup.remove();
        }, 300);
    }, 2000);
}

function checkPassword() {
    const input = document.getElementById('passwordInput').value;
    const errorMsg = document.getElementById('passwordError');
    const subtitle = document.getElementById('passwordSubtitle');

    if (input === config.password) {
        errorMsg.style.display = 'none';
        subtitle.textContent = config.messages.password_subtitle;
        passwordEntered = true;
        updateNavigationButtons();
        createConfetti();
        document.getElementById('passwordInput').value = '';
    } else {
        passwordAttempts++;
        showPopup('Wronggg, try again!!!');
        document.getElementById('passwordInput').value = '';

        if (passwordAttempts === 2) {
            subtitle.textContent = config.messages.password_subtitle_clue;
            subtitle.style.display = 'block';
        }
    }
}

function showChoiceScreen() {
    const envelope = document.getElementById('envelope');
    envelope.classList.add('opened');
    setTimeout(() => {
        nextTab();
    }, 600);
}

function showMessage(isYes) {
    if (!isYes) {
        document.getElementById('noChoiceMessage').style.display = 'block';
    }
    createConfetti();
    setTimeout(() => {
        nextTab();
    }, 500);
}

function createConfetti() {
    const colors = [config.colors.primary, config.colors.secondary, config.colors.background_gradient_start, config.colors.background_gradient_end];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = confetti.style.width;
        confetti.style.borderRadius = '50%';
        confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 5000);
    }
}

function nextTab() {
    if (currentTab === 1 && !passwordEntered) {
        showPopup('Enter the password first!');
        return;
    }

    if (currentTab < totalTabs) {
        currentTab++;
        showTab(currentTab);
    }
}

function prevTab() {
    if (currentTab > 1) {
        currentTab--;
        showTab(currentTab);
    }
}

function showTab(tabNumber) {
    const tabs = document.querySelectorAll('.tab-pane');
    tabs.forEach(tab => tab.classList.remove('active'));
    document.getElementById(`tab${tabNumber}`).classList.add('active');
    updateNavigationButtons();
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.disabled = currentTab === 1;
    nextBtn.disabled = currentTab === totalTabs;

    if (currentTab === 1 && !passwordEntered) {
        nextBtn.disabled = true;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('passwordInput').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            checkPassword();
        }
    });
});