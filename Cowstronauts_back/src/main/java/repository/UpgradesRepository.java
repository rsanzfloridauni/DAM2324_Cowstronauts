package main.java.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import main.java.model.Upgrades;

public interface UpgradesRepository extends MongoRepository<Upgrades, String> {
	
}
