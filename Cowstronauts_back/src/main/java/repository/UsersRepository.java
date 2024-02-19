package main.java.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import main.java.model.Users;

public interface UsersRepository extends MongoRepository<Users, String> {

	@Query(value = "{ 'id': ?0 }")
	Users searchOneUser(int id);

	Users findByValidationNum(String validationNum);

}
