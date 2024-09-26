const usernamePage = document.querySelector('#username-page');
const chatPage = document.querySelector('#chat-page');
const usernameForm = document.querySelector('#usernameForm');
const messageForm = document.querySelector('#messageForm');
const messageInput = document.querySelector('#message');
const connectingElement = document.querySelector('.connecting');
const chatArea = document.querySelector('#chat-messages');
const logout = document.querySelector('#logout');
const slikaForm = document.querySelector("#slika");

let stompClient = null;
let nickname = null;
let fullname = null;
let slika = null;
let selectedUserId = null;

function connect(event) {
    nickname = document.querySelector('#nickname').value.trim();
    fullname = document.querySelector('#fullname').value.trim();
    slika = slikaForm.files[0];

    if (nickname && fullname && slika) {
        const citac = new FileReader();

        citac.readAsDataURL(slika);

        citac.onload = function () {
            let slikaBase64 = citac.result;

            //Uklanjanje tipa zbog springa
            slikaBase64 = slikaBase64.replace(/^data:image\/[a-z]+;base64,/, '');

            slika = slikaBase64;  // Postavi čist base64 string

            usernamePage.classList.add('hidden');
            chatPage.classList.remove('hidden');

            const socket = new SockJS('/ws');
            stompClient = Stomp.over(socket);

            stompClient.connect({}, onConnected, onError);
        };

        citac.onerror = function (error) {
            console.error('Greška prilikom čitanja slike:', error);
        };
    } else {
        alert("Molimo unesite korisničko ime, pravo ime i sliku!");
    }

    event.preventDefault();
}


function onConnected() {
    stompClient.subscribe(`/korisnik/${nickname}/queue/poruke`, onMessageReceived);
    stompClient.subscribe(`/korisnik/public`, onMessageReceived);


    stompClient.send("/app/korisnik.dodajKorisnika",
        {},
        JSON.stringify({
            korisnickoIme: nickname,
            imeIPrezime: fullname,
            status: 'NA_MREZI',
            slika: slika  // slanje u 64 formatu
        })
    );
    document.querySelector('#connected-user-fullname').textContent = fullname;
    findAndDisplayConnectedUsers().then();
}

async function findAndDisplayConnectedUsers() {
    const connectedUsersResponse = await fetch('/korisnici');
    let connectedUsers = await connectedUsersResponse.json();
    connectedUsers = connectedUsers.filter(user => user.korisnickoIme !== nickname);
    const connectedUsersList = document.getElementById('connectedUsers');
    connectedUsersList.innerHTML = '';

    connectedUsers.forEach(user => {
        appendUserElement(user, connectedUsersList);
        if (connectedUsers.indexOf(user) < connectedUsers.length - 1) {
            const separator = document.createElement('li');
            separator.classList.add('separator');
            connectedUsersList.appendChild(separator);
        }
    });
}

function appendUserElement(user, connectedUsersList) {
    const listItem = document.createElement('li');
    listItem.classList.add('user-item');
    listItem.id = user.korisnickoIme;

    const userImage = document.createElement('img');
    userImage.src = `data:image/jpeg;base64,${user.slika}`;
    userImage.alt = user.imeIPrezime;

    const usernameSpan = document.createElement('span');
    usernameSpan.textContent = user.imeIPrezime;

    const receivedMsgs = document.createElement('span');
    receivedMsgs.textContent = '0';
    receivedMsgs.classList.add('nbr-msg', 'hidden');

    listItem.appendChild(userImage);
    listItem.appendChild(usernameSpan);
    listItem.appendChild(receivedMsgs);

    listItem.addEventListener('click', userItemClick);

    connectedUsersList.appendChild(listItem);
}

function userItemClick(event) {
    document.querySelectorAll('.user-item').forEach(item => {
        item.classList.remove('active');
    });
    messageForm.classList.remove('hidden');

    const clickedUser = event.currentTarget;
    clickedUser.classList.add('active');

    selectedUserId = clickedUser.getAttribute('id');
    fetchAndDisplayUserChat().then();

    const nbrMsg = clickedUser.querySelector('.nbr-msg');
    nbrMsg.classList.add('hidden');
    nbrMsg.textContent = '0';

}

function displayMessage(senderId, content) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message');
    if (senderId === nickname) {
        messageContainer.classList.add('sender');
    } else {
        messageContainer.classList.add('receiver');
    }
    const message = document.createElement('p');
    message.textContent = content;
    messageContainer.appendChild(message);
    chatArea.appendChild(messageContainer);
}

async function fetchAndDisplayUserChat() {
    const userChatResponse = await fetch(`/poruke/${nickname}/${selectedUserId}`);
    const userChat = await userChatResponse.json();
    chatArea.innerHTML = '';
    userChat.forEach(chat => {
        displayMessage(chat.posiljalacID, chat.poruka);
    });
    chatArea.scrollTop = chatArea.scrollHeight;
}


function onError() {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}


function sendMessage(event) {
    const messageContent = messageInput.value.trim();
    if (messageContent && stompClient) {
        const chatMessage = {
            posiljalacID: nickname,
            primalacID: selectedUserId,
            poruka: messageInput.value.trim(),
            datum: new Date()
        };
        stompClient.send("/app/razgovor", {}, JSON.stringify(chatMessage));
        displayMessage(nickname, messageInput.value.trim());
        messageInput.value = '';
    }
    chatArea.scrollTop = chatArea.scrollHeight;
    event.preventDefault();
}


async function onMessageReceived(payload) {
    await findAndDisplayConnectedUsers();
    console.log('Message received', payload);
    const message = JSON.parse(payload.body);
    if (selectedUserId && selectedUserId === message.posiljalacID) {
        displayMessage(message.posiljalacID, message.poruka);
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    if (selectedUserId) {
        document.querySelector(`#${selectedUserId}`).classList.add('active');
    } else {
        messageForm.classList.add('hidden');
    }

    const notifiedUser = document.querySelector(`#${message.posiljalacID}`);
    if (notifiedUser && !notifiedUser.classList.contains('active')) {
        const nbrMsg = notifiedUser.querySelector('.nbr-msg');
        nbrMsg.classList.remove('hidden');
        nbrMsg.textContent = '';
    }
}

function onLogout() {
    stompClient.send("/app/kornsik.diskonektujKorisnika",
        {},
        JSON.stringify({korisnickoIme: nickname, imeIPrezime: fullname, status: 'VAN_MREZE'})
    );
    window.location.reload();
}

usernameForm.addEventListener('submit', connect, true); // step 1
messageForm.addEventListener('submit', sendMessage, true);
logout.addEventListener('click', onLogout, true);
window.onbeforeunload = () => onLogout();