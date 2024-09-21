package com.chat_app.chat_app.Repo;

import com.chat_app.chat_app.Modeli.Razgovor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RazgovorRepo extends MongoRepository<Razgovor, String> {


    List<Razgovor> findByIdRazgovora(String idRazgovora);
}
