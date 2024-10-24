import fs from 'fs/promises';
import path from 'path';
const historyFilePath = path.join(process.cwd(), '../routes/data/searchHistory.json');
// TODO: Define a City class with name and id properties
class City {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }
}
// TODO: Complete the HistoryService class
class HistoryService {
    // TODO: Define a read method that reads from the searchHistory.json file
    async read() {
        try {
            const data = await fs.readFile(historyFilePath, 'utf8');
            const cities = JSON.parse(data);
            return cities;
        }
        catch (error) {
            console.error('Error reading search history:', error);
            return [];
        }
    }
    // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
    async write(cities) {
        try {
            await fs.writeFile(historyFilePath, JSON.stringify(cities, null, 2), 'utf8');
        }
        catch (error) {
            console.error('Error writing to search history:', error);
        }
    }
    // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
    async getCities() {
        try {
            const cities = await this.read();
            return cities;
        }
        catch (error) {
            console.error('Error getting cities:', error);
            return [];
        }
    }
    // TODO Define an addCity method that adds a city to the searchHistory.json file
    async addCity(cityName) {
        try {
            const cities = await this.read();
            if (cities.find(city => city.name.toLowerCase() === cityName.toLowerCase())) {
                console.log(`${cityName} is already in the search history.`);
                return;
            }
            const newCity = new City(cityName, cities.length);
            cities.push(newCity);
            await this.write(cities);
        }
        catch (error) {
            console.error('Error adding city to history:', error);
        }
    }
    // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
    async removeCity(id) {
        try {
            const cities = await this.read();
            const cityId = parseInt(id, 10);
            if (isNaN(cityId)) {
                console.error('Invalid ID');
                return;
            }
            const updatedCities = cities.filter(city => city.id !== cityId);
            await this.write(updatedCities);
        }
        catch (error) {
            console.error('Error removing city from history:', error);
        }
    }
}
export default new HistoryService();
