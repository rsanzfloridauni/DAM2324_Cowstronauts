package main.java.controller;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.io.FileReader;
import java.io.FileWriter;
import java.text.ParseException;
import java.util.Calendar;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.mail.MessagingException;

import org.bson.Document;
import org.json.JSONObject;
import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import main.java.model.Upgrades;
import main.java.model.Users;
import main.java.model.userAchievements;
import main.java.model.userSave;
import main.java.repository.AchievementsRepository;
import main.java.repository.UpgradesRepository;
import main.java.repository.UsersRepository;
import java.util.List;
import java.util.Random;

@RestController
public class PostEndpointController {

	@Autowired
	private UsersRepository usersRepository;

	@Autowired
	private UpgradesRepository upgradesRepository;

	@Autowired
	private AchievementsRepository achievementsRepository;

	/**
	 * Adds a new user to the database and sends an Email for the verification
	 * @param newUser
	 * @return
	 */
	@PostMapping("/register")
	public ResponseEntity<JSONObject> register(@RequestBody Users newUser) {

		List<Users> existingUsers = usersRepository.findAll();
		JSONObject jsonString = new JSONObject();

		for (Users existingUser : existingUsers) {
			if (existingUser.getName().equals(newUser.getName())) {
				jsonString.put("Status", "400");
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(jsonString);
			}
			if (existingUser.getEmail().equals(newUser.getEmail())) {
				jsonString.put("Status", "400");
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(jsonString);
			}
		}
		int maxId = getMaxIdUser();
		int newId = maxId + 1;
		String encryptedPass = encryptToMD5(newUser.getPassword());
		newUser.setPassword(encryptedPass);
		newUser.setId(newId);
		newUser.setValidationNum(validationNumGenerator());
		newUser.setValidated(false);
		System.out.println(encryptedPass);
		usersRepository.save(newUser);

		try {
			SendEmailController sendEmail = new SendEmailController(
					"Click the link below to validate your Cowstronauts account!\nClick to verify: http://18.213.13.32:8080/validate?number="
							+ newUser.getValidationNum(),
					"Validation code from Cowstronauts", "cowstronauts@gmail.com", "sewv apxu wpzb xgri",
					"smtp.gmail.com", "587", new String[] { newUser.getEmail() });
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		} catch (MessagingException e) {
			e.printStackTrace();
		}

		System.out.println("Mensaje enviado");
		jsonString.put("Status", "200");
		return ResponseEntity.status(HttpStatus.OK).body(jsonString);
	}

	/**
	 * fonsi
	 * @param number
	 * @return
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
	 * This endpoint is only for development purposes. Allows the dev teams to add a new upgrade
	 * @param newUpgrade
	 * @return
	 */
	@PostMapping("/newUpgrade")
	public ResponseEntity<String> newUpgrade(@RequestBody Upgrades newUpgrade) {
		List<Upgrades> existingUpgrades = upgradesRepository.findAll();

		for (Upgrades existingUpgrade : existingUpgrades) {
			if (existingUpgrade.getName().equals(newUpgrade.getName())) {
				return new ResponseEntity<>("La mejora ya existe.", HttpStatus.BAD_REQUEST);
			}
		}

		int maxId = getMaxIdUpgrade();
		int newId = maxId + 1;
		newUpgrade.setId(newId);
		upgradesRepository.save(newUpgrade);

		return new ResponseEntity<>("Mejora registrada exitosamente.", HttpStatus.OK);
	}

	/**
	 * This endpoint is only for development purposes. Allows the dev teams to add a new achievement
	 * @param newAchievement
	 * @return
	 */
	@PostMapping("/newAchievement")
	public ResponseEntity<String> newAchievement(@RequestBody userAchievements newAchievement) {
		List<userAchievements> existingAchievements = achievementsRepository.findAll();

		for (userAchievements existingAchievement : existingAchievements) {
			if (existingAchievement.getName().equals(newAchievement.getName())) {
				return new ResponseEntity<>("El logro ya existe.", HttpStatus.BAD_REQUEST);
			}
		}

		int maxId = getMaxIdAchievement();
		int newId = maxId + 1;
		newAchievement.setId(newId);
		achievementsRepository.save(newAchievement);

		return new ResponseEntity<>("Logro registrado exitosamente.", HttpStatus.OK);
	}

	/**
	 * return the highest ID number in the user collection
	 * @return
	 */
	private int getMaxIdUser() {
		int maxId = 0;
		List<Users> listUser = usersRepository.findAll();
		for (Users u : listUser) {
			int id = u.getId();
			if (id > maxId) {
				maxId = id;
			}
		}
		return maxId;

	}

	/**
	 * return the highest ID number in the upgrade collection
	 * @return
	 */
	private int getMaxIdUpgrade() {
		int maxId = 0;
		List<Upgrades> listUpgrades = upgradesRepository.findAll();
		for (Upgrades u : listUpgrades) {
			int id = u.getId();
			if (id > maxId) {
				maxId = id;
			}
		}
		return maxId;

	}

	/**
	 * return the highest ID number in the achievement collection
	 * @return
	 */
	private int getMaxIdAchievement() {
		int maxId = 0;
		List<userAchievements> listAchievements = achievementsRepository.findAll();
		for (userAchievements a : listAchievements) {
			int id = a.getId();
			if (id > maxId) {
				maxId = id;
			}
		}
		return maxId;

	}

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
	 * Generates a random number to validate
	 * @return
	 */
	public static String validationNumGenerator() {
		Random random = new Random();

		int randomNumber = random.nextInt(10000);

		String formattedRandomNumber = String.format("%04d", randomNumber);

		return formattedRandomNumber;
	}

}
