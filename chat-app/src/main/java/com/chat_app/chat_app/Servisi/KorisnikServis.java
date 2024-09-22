package com.chat_app.chat_app.Servisi;

import com.chat_app.chat_app.Modeli.Korisnik;
import com.chat_app.chat_app.Modeli.Status;
import com.chat_app.chat_app.Repo.KorisnikRepo;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class KorisnikServis {

    private final KorisnikRepo korisnikRepo;


    public  void sacuvajKorisnika(Korisnik korisnik)
    {
        korisnik.setStatus(Status.NA_MREZI);
        korisnikRepo.save(korisnik);

    }

    public void  diskonektuj(Korisnik korisnik)
    {
        var sacuvaniKorisnik = korisnikRepo.findById(korisnik.getKorisnickoIme()).orElse(null);

        if (sacuvaniKorisnik != null)
        {
            sacuvaniKorisnik.setStatus(Status.VAN_MREZE);
            korisnikRepo.save(sacuvaniKorisnik);
        }

    }


    public List<Korisnik> nadjiKonektovaneKorisnike()
    {
        return korisnikRepo.findAllByStatus(Status.NA_MREZI);
    }






}
