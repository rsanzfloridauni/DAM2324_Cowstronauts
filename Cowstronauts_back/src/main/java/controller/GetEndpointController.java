package main.java.controller;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import main.java.model.Users;
import main.java.model.userAchievements;
import main.java.model.Upgrades;
import main.java.repository.AchievementsRepository;
import main.java.repository.UpgradesRepository;
import main.java.repository.UsersRepository;

@RestController
public class GetEndpointController {

	@Autowired
	private UsersRepository usersRepository;

	@Autowired
	private UpgradesRepository upgradesRepository;

	@Autowired
	private AchievementsRepository achievementsRepository;

	/**
	 * validate the credentials of the user, in case they are correct, returns all the user information
	 * @param user
	 * @param pass
	 * @return
	 */
	@GetMapping("/login")
	ResponseEntity<JSONObject> login(@RequestParam(value = "user") String user,
			@RequestParam(value = "pass") String pass) {
		JSONObject jsonString = new JSONObject();
		List<Users> listUsers = usersRepository.findAll();
		System.out.println(listUsers);
		for (Users u : listUsers) {
			String name = u.getName().toLowerCase();
			if (name.equals(user.toLowerCase())) {
				if (checkPassword(u.getPassword(), pass)) {
					jsonString.put("data", u);
					return ResponseEntity.status(HttpStatus.OK).body(jsonString);
				} else {
					return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(jsonString);
				}
			}
		}

		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(jsonString);
	}

	/**
	 * Returns a list with all upgrades stored in database.
	 * @return
	 */
	@GetMapping("/upgrades")
	ResponseEntity<JSONObject> getUpgrades() {
		JSONObject jsonString = new JSONObject();
		List<Upgrades> listUpgrades = upgradesRepository.findAll();
		jsonString.put("upgrade", listUpgrades);
		return ResponseEntity.status(HttpStatus.OK).body(jsonString);
	}

	/**
	 * This endpoint returns the achievements stored in the database
	 * @return
	 */
	@GetMapping("/achievements")
	ResponseEntity<JSONObject> getAchievements() {
		JSONObject jsonString = new JSONObject();
		List<userAchievements> listAchievements = achievementsRepository.findAll();
		jsonString.put("achievement", listAchievements);
		return ResponseEntity.status(HttpStatus.OK).body(jsonString);
	}

	/**
	 * Returns the save file of a user
	 * @param id
	 * @return
	 */
	@GetMapping("/getSaves")
	ResponseEntity<JSONObject> getSaves(@RequestParam(value = "id") String id) {
		JSONObject jsonString = new JSONObject();
		Users user = usersRepository.searchOneUser(Integer.parseInt(id));
		jsonString.put("saves", user.getSave());
		return ResponseEntity.status(HttpStatus.OK).body(jsonString);
	}

	/**
	 * returns the validation number of a user
	 * @param validationNum
	 * @return
	 */
	@GetMapping("/getValidationNum")
	ResponseEntity<JSONObject> getValidationNum(@RequestParam(value = "validationNum") String validationNum) {
		JSONObject jsonString = new JSONObject();
		Users user = usersRepository.searchOneUser(Integer.parseInt(validationNum));
		jsonString.put("saves", user.getValidationNum());
		return ResponseEntity.status(HttpStatus.OK).body(jsonString);
	}
	
	/**
	 * Handles validation of a user based on the provided validation number.
	 *
	 * @param number The validation number associated with the user.
	 * @return ResponseEntity<String> indicating the result of the validation.
	 *         - If successful, returns "User validated successfully!" with HTTP status OK (200).
	 *         - If unsuccessful, returns "Invalid validation request." with HTTP status BAD_REQUEST (400).
	 */
	@GetMapping("/validate")
	public ResponseEntity<String> validateUser(@RequestParam(value = "number") String number) {
		Users user = usersRepository.findByValidationNum(number);

		if (user != null && !user.isValidated()) {
			user.setValidated(true);
			usersRepository.save(user);

			return ResponseEntity.ok("User validated successfully!");
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid validation request.");
		}
	}

	/**
	 * Converts the password string to MD5
	 * @param input
	 * @return
	 */
	public static String encryptToMD5(String input) {
		try {

			MessageDigest md = MessageDigest.getInstance("MD5");

			byte[] inputBytes = input.getBytes();

			byte[] hashBytes = md.digest(inputBytes);

			StringBuilder hexStringBuilder = new StringBuilder();
			for (byte b : hashBytes) {
				String hex = Integer.toHexString(0xFF & b);
				if (hex.length() == 1) {
					hexStringBuilder.append('0');
				}
				hexStringBuilder.append(hex);
			}

			return hexStringBuilder.toString();

		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * check if the encrypted password is the same as the database one
	 * @param dbPass
	 * @param userPass
	 * @return
	 */
	private Boolean checkPassword(String dbPass, String userPass) {

		String userEncrypted = encryptToMD5(userPass);
		if (dbPass.equals(userEncrypted)) {
			return true;
		} else {
			return false;
		}

	}
}
