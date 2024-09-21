package com.chat_app.chat_app.Repo;

import com.chat_app.chat_app.Modeli.RazgovorSoba;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RazgovorSobaRepo extends MongoRepository<RazgovorSoba, String>{
    Optional<RazgovorSoba> findByPrimilacIDAndPosiljalacID(String posiljalacID, String primilacID);
}
