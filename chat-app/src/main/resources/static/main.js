const korisnickaStrana = document.querySelector('#username-page');
const razgovorStrana = document.querySelector('#chat-page');
const usernameForma = document.querySelector('#usernameForm');
const porukaForma = document.querySelector('#messageForm');
const inputPoruke = document.querySelector('#message');
const Konektovanje = document.querySelector('.connecting');
const razgovorPolje = document.querySelector('#chat-messages');
const logout = document.querySelector('#logout');

let stompKlijent = null;
let nickname = null;
let pravoIme = null;
let selektovanKorisnik = null;

const kokentujSe = (event) => {
    event.preventDefault();


    nickname = document.querySelector("#nickname").value.trim();
    pravoIme = document.querySelector("#fullname").value.trim();
    if (nickname && pravoIme) {

        korisnickaStrana.classList.add("hidden");
        razgovorStrana.classList.remove("hidden");

        // Inicijalizujemo WebSocket konekciju
        var soket = new SockJS("/ws");
        stompKlijent = Stomp.over(soket);

        stompKlijent.connect({}, onConnected, onError);
    }
};


const onConnected = () =>
{
    /// Prijava u queue za poruke, i za aktivni status
    stompKlijent.subscribe(`/korisnik/${nickname}/queue/poruke` , onPorukaPrimljena);
    stompKlijent.subscribe("korisnik/public", onPorukaPrimljena);


    // Podeeseno u bekendu sta se poziva na koju putanju a tijelo toga se salje na drugu
    stompKlijent.send("/korisnik.dodajKorisnika", {}, JSON.stringify({korisnickoIme: nickname, imeIPrezime : pravoIme, status: "NA_MREZI"}))

    prikaziAktivneKorisnike();


    Konektovanje.classList.remove("hidden");


}

const onError () =>
{




}


const onPorukaPrimljena = () =>
{}


const prikaziAktivneKorisnike = async () =>
{
     try {
            const response = await fetch("/korisnici");
            let konektovaniKorsinici = await response.json();


            konektovaniKorsinici = konektovaniKorsinici.filter((korisnik) => korisnik.korisnickoIme !== nickname);


            const konektovaniKorisniciLista = document.getElementById("connectedUsers");


            konektovaniKorisniciLista.innerHTML = '';


            konektovaniKorsinici.forEach(korisnik => {
                const listItem = document.createElement('li');
                listItem.textContent = korisnik.korisnickoIme;
                konektovaniKorisniciLista.appendChild(listItem);
            });
        } catch (error) {
            console.error("Greška prilikom dobijanja liste korisnika:", error);
        }
}






usernameForm.addEventListener("submit" , kokentujSe , true);




