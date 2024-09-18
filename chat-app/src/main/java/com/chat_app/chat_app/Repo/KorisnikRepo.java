package com.chat_app.chat_app.Repo;

import com.chat_app.chat_app.Korisnici.Korisnik;
import com.chat_app.chat_app.Korisnici.Status;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KorisnikRepo extends MongoRepository<Korisnik, String> {
    List<Korisnik> findAllByStatus(Status status);
}
