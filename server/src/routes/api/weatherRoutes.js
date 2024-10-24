import { Router } from 'express';
const router = Router();
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
    // TODO: GET weather data from city name
    const { cityName } = req.body;
    if (!cityName) {
        res.status(400).json({ error: 'City name is required' });
        return;
    }
    try {
        const weather = await WeatherService.getWeatherForCity(cityName);
        // TODO: save city to search history
        await HistoryService.addCity(cityName);
        res.json(weather);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});
// TODO: GET search history
router.get('/history', async (res) => {
    try {
        const cities = await HistoryService.getCities();
        res.json(cities);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve search history' });
    }
});
// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
    const cityID = req.params.id;
    try {
        const cities = await HistoryService.getCities();
        const updatedCities = cities.filter((_, index) => index !== parseInt(cityID));
        await HistoryService.write(updatedCities);
        res.json({ message: `City with id ${cityID} has been deleted` });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete city from history' });
    }
});
export default router;
