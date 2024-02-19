package main.java.controller;

import java.util.List;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import main.java.model.Users;
import main.java.model.userSave;
import main.java.repository.UsersRepository;

@RestController
public class PutEndpointController {

	@Autowired
	private UsersRepository usersRepository;

	/**
	 * updates the save file of the selected user with 
	 * @param id
	 * @param body
	 * @return
	 */
	@PutMapping("/load")
	ResponseEntity<JSONObject> loadSave(@RequestParam(value = "id") int id, @RequestBody List<userSave> body) {
		JSONObject jsonString = new JSONObject();
		System.out.println(id);
		System.out.println(body.get(0).getCps());
		Users user = usersRepository.searchOneUser(id);
		user.setSave(body);
		usersRepository.save(user);
		return ResponseEntity.status(HttpStatus.OK).body(jsonString);
	}

}
