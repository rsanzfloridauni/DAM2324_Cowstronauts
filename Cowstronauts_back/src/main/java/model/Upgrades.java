package main.java.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Upgrades")
public class Upgrades {
	
	@Id
	private String mongoId;
	private int id;
	private String name;
	private String description;
	private int lvlMax;
	private int cost;
	private List<upgradeEffect> effect;
	private String img;
	
	public String getMongoId() {
		return mongoId;
	}
	public void setMongoId(String mongoId) {
		this.mongoId = mongoId;
	}
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
	public int getLvlMax() {
		return lvlMax;
	}
	public void setLvlMax(int lvlMax) {
		this.lvlMax = lvlMax;
	}
	
	public int getCost() {
		return cost;
	}
	public void setCost(int cost) {
		this.cost = cost;
	}
	
	public List<upgradeEffect> getEffect() {
		return effect;
	}
	public void setEffect(List<upgradeEffect> effect) {
		this.effect = effect;
	}
	
	public String getImg() {
		return img;
	}
	public void setImg(String img) {
		this.img = img;
	}

}
