package com.chat_app.chat_app.Repo;

import com.chat_app.chat_app.Modeli.RazgovorSoba;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RazgovorSobaRepo extends MongoRepository<RazgovorSoba, String>{
    Optional<String> findByPrimilacIDAndPosiljalacID(String posiljalacID, String primilacID);
}
