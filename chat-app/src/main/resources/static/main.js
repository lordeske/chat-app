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
let selektovanKorisnikID = null;

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

const onConnected = () => {
    // Prijava u queue za poruke, i za aktivni status
    stompKlijent.subscribe(`/korisnik/${nickname}/queue/poruke`, onPorukaPrimljena);
    stompKlijent.subscribe("korisnik/public", onPorukaPrimljena);

    // Podeeseno u bekendu sta se poziva na koju putanju a tijelo toga se salje na drugu
    stompKlijent.send("/app/korisnik.dodajKorisnika", {}, JSON.stringify({
        korisnickoIme: nickname,
        imeIPrezime: pravoIme,
        status: "NA_MREZI"
    }));

    prikaziAktivneKorisnike();
    Konektovanje.classList.remove("hidden");
}

const onError = () => {
    console.error("Greška prilikom konekcije.");
}

const onPorukaPrimljena = () => {









}

const prikaziAktivneKorisnike = async () => {
    try {
        const response = await fetch("/korisnici");
        let konektovaniKorsinici = await response.json();

        konektovaniKorsinici = konektovaniKorsinici.filter((korisnik) => korisnik.korisnickoIme !== nickname);

        const konektovaniKorisniciLista = document.getElementById("connectedUsers");
        konektovaniKorisniciLista.innerHTML = '';

        konektovaniKorsinici.forEach(korisnik => {
            prosiriKorisnickiElement(korisnik, konektovaniKorisniciLista);

            if (konektovaniKorsinici.indexOf(korisnik) < konektovaniKorsinici.length - 1) {
                const separator = document.createElement("li");
                separator.classList.add("separator");
                konektovaniKorisniciLista.appendChild(separator);
            }
        });
    } catch (error) {
        console.error("Greška prilikom dobijanja liste korisnika:", error);
    }
}

const prosiriKorisnickiElement = (korisnik, konektovaniKorsiniciLista) => {
    const lista = document.createElement("li");
    lista.classList.add("user-item");
    lista.id = korisnik.korisnickoIme;

    const korisnickaSlika = document.createElement("img");
    korisnickaSlika.src = "../img/korisnika_slika.png";
    korisnickaSlika.alt = korisnik.imeIPrezime;

    const korisnickiSpan = document.createElement("span");
    korisnickiSpan.textContent = korisnik.imeIPrezime;

    const primljenePoruke = document.createElement("span");
    primljenePoruke.textContent = 0;
    primljenePoruke.classList.add("nbr-msg", "hidden");

    lista.appendChild(korisnickaSlika);
    lista.appendChild(korisnickiSpan);
    lista.appendChild(primljenePoruke);

    lista.addEventListener("click", izabraniKorisnik);

    konektovaniKorsiniciLista.appendChild(lista);
}


const izabraniKorisnik = (event) =>
{
    document.querySelectorAll(".user-item").forEach(itme => item.classList.remove("active"));
    porukaForma.classList.remove("hidden");

    const kliknutiKorisnik = event.getCurrentTarger;
    kliknutiKorisnik.classList.add("active");

    selektovanKorisnikID = kliknutiKorisnik.getAtribute("id");

    fetchAndDisplayKorisnickiChat().then();


    const nbrPoruka = kliknutiKorisnik.querySelector(".nbr-msg");
    nbrPoruka.classList.add("hidden");



}


const fetchAndDisplayKorisnickiChat = async () =>
{

    try
    {
        const userChatResp  = await (`/poruke/${nickname}/${selektovanKorisnikID}`)

        const userChat = await userChatResp.json();

        razgovorPolje.innerHTML = "";

        userChat.forEach(chat =>
        {
            prikaziPoruke(chat.posiljalacID, chat.poruka);

        })

        razgovorPolje.scrollTop = razgovorPolje.scrollHeight;



    }
    catch (err)
    {}





}

const prikaziPoruke = (posiljalacID, kontent) =>
{

       const porukaKonteinter = document.createElement("div");

       porukaKonteinter.classList.add("message");



        /// Lijevo ili denso
       if(posiljalacID === nickname)
       {

        porukaKonteinter.classList.add("sender")

       }
       else
       {
        porukaKonteinter.classList.add("reciever");
       }


       const poruka = document.createElement("p");
       poruka.textContent= content;

       porukaKonteinter.appendChild(porukaKonteinter);
       razgovorPolje.appendChild(porukaKonteinter);


}

const  posaljiPoruku = (event) =>
{
    event.preventDefault();

    const messContent = inputPoruke.value.value.trim();


    if (messContent && stompKlijent)
    {


        var Poruka =  {

            posiljalacID : nickname,
            primalacID : selektovanKorisnikID,
            poruka : messContent,
            datum : new Date()


        }

        stompKlijent.send("/app/razgovor" , {} , JSON.stringify(Poruka));
        prikaziPoruke(nickname, messContent);
        inputPoruke.value = "";





    }

    razgovorPolje.scrollTop = razgovorPolje.scrollHeight;
    event.preventDefault();






}




usernameForma.addEventListener("submit", kokentujSe, true);
porukaForma.addEventListener("submit" , posaljiPoruku(true))
