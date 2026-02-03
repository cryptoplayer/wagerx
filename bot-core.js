// Replace the old runResearch function with this "Typewriter" version:
function typeWriter(text, i, element, callback) {
    if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        // Speed control: 30ms per character feels "techy" and fast
        setTimeout(() => typeWriter(text, i, element, callback), 30);
    } else if (callback) {
        callback();
    }
}

function runResearch() {
    const input = document.getElementById('bot-input');
    const display = document.getElementById('bot-display');
    const val = input.value.toLowerCase().trim();
    if(!val) return;

    // Show User Input immediately
    display.innerHTML += `<div class="user-msg">> ${input.value}</div>`;
    
    let response = "NO_DATA: Query not found in current audit cycle.";
    for(let key in localData) {
        if(val.includes(key)) response = localData[key];
    }

    // Create a container for the bot response
    const botMsgDiv = document.createElement('div');
    botMsgDiv.className = 'bot-msg';
    botMsgDiv.innerHTML = 'AUDITOR: '; // Prefix stays static
    display.appendChild(botMsgDiv);

    // Run the typewriter on the response text only
    setTimeout(() => {
        typeWriter(response, 0, botMsgDiv, () => {
            display.scrollTop = display.scrollHeight;
        });
    }, 300);

    input.value = '';
}
