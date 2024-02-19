package main.java.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import main.java.model.userAchievements;

public interface AchievementsRepository extends MongoRepository<userAchievements, String> {
	
}
