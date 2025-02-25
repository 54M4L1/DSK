const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const sendBtn = document.getElementById('send-btn');
const loading = document.getElementById('loading');


let conversationHistory = [];

userInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const message = userInput.value.trim();

    showError('');

    if (message === '') {
        showError('Invalid text value.');
        return;
    }

    if (conversationHistory.length === 0) {
        conversationHistory.push({
            sender: 'system',
            message: "Interact with me as a scientist and expert in technology, physics and occult, be lovely."
        });
    }

    const arabicPattern = /[\u0600-\u06FF]/;
    if (arabicPattern.test(message)) {
        const arabicSystemMessage = "تفاعل معي كمفكر علمي وخبير في التكنولوجيا والفيزياء والعلوم الروحانية الباطنية، كن محبوباً وراقيًا.";
        const alreadyAdded = conversationHistory.some(
            item => item.sender === 'system' && item.message === arabicSystemMessage
        );

        if (!alreadyAdded) {
            conversationHistory.push({
                sender: 'system',
                message: arabicSystemMessage
            });
        }
    }

    conversationHistory.push({ sender: 'user', message }, { model: 'gpt-4o', stream: true });

    appendMessage('user-message', message);
    userInput.value = '';
    sendBtn.disabled = true;
    loading.style.display = 'block';

    try {
        const response = await puter.ai.chat(conversationHistory.map(item => item.message).join("\n"));
        const responseText = response.message.content;

        conversationHistory.push({ sender: 'bot', message: responseText });

        const formattedResponse = marked.parse(responseText);
        appendMessage('bot-message', formattedResponse);
    } catch (error) {
        console.error('Error:', error);
        showError('You may not access our Services before agreeing to the Terms of Use.');
    } finally {
        sendBtn.disabled = false;
        loading.style.display = 'none';
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

function appendMessage(className, message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${className}`;

    const isArabic = /[\u0600-\u06FF]/.test(message);
    messageElement.style.fontFamily = isArabic ? 'Cairo, sans-serif' : 'inherit';
    messageElement.style.direction = isArabic ? 'rtl' : 'ltr';
    messageElement.style.textAlign = isArabic ? 'right' : 'left';

    if (className === 'bot-message') {
        messageElement.innerHTML = message;
        chatBox.appendChild(messageElement);

        setTimeout(() => {
            messageElement.classList.add('show');
        }, 10);
    } else {
        messageElement.textContent = message;
        chatBox.appendChild(messageElement);
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

function showError(message) {
    const erBox = document.getElementById('error-message');

    if (message === '') {
        erBox.style.display = 'none';
    } else {
        erBox.textContent = message;
        erBox.style.display = 'block';

        setTimeout(() => {
            erBox.style.display = 'none';
        }, 5000);  // Timeout of 5 seconds for hiding the error message
    }
}


