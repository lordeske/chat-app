package com.chat_app.chat_app.Kontroleri;


import com.chat_app.chat_app.Modeli.Korisnik;
import com.chat_app.chat_app.Servisi.KorisnikServis;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class KorisnikKontroler {


    private final KorisnikServis korisnikServis;



    @MessageMapping("/korisnik.dodajKorisnika")
    //Novi queue, za slanje
    @SendTo("/korisnik/public")
    public Korisnik sacuvajKorisnika(@Payload Korisnik korisnik)
    {
        korisnikServis.sacuvajKorisnika(korisnik);


        return korisnik;
    }


    @MessageMapping("/kornsik.diskonektujKorisnika")
    @SendTo("/korisnik/public")
    public Korisnik diskonektuj(@Payload Korisnik korisnik)
    {
       korisnikServis.diskonektuj(korisnik);

       return korisnik;
}


    @GetMapping(path = "/korisnici")
    @ResponseBody
    public List<Korisnik> prikaziAktivne()
    {
       return korisnikServis.nadjiKonektovaneKorisnike();

    }





}
