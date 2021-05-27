const fs = require('fs');

const axios = require('axios').default;


class Busquedas {

    historial = [];
    dbPath = './db/databases.json';


    constructor() {
        // TODO: leer db si existe
        this.leerDB();
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY, //'pk.eyJ1Ijoic295eW9sdWlzIiwiYSI6ImNrbmZhcXVscDA1encycHA1dGRjcjlicWoifQ.-An5gQmUiUvUxAL3mr9pEA', 
            'language': 'es',
            'limit': 6
        }
    }
    get paramsWeather() {
        return {
            'appid': process.env.OPENWHEATHER_KEY,
            'units': 'metric',
        }
    }

    async ciudad(lugar = '') {
        //TODO: Peticion http
        try {
            //peticion http
            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`, //`https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            const resp = await intance.get();
            //console.log(resp.data.features);
            //return resp.data.features;
            let datos = resp.data.features.map(pam => ({
                id: pam.id,
                nombre: pam.place_name,
                lng: pam.center[0],
                lat: pam.center[1],
            }));
            //console.log(datos);
            return datos;

        } catch (error) {
            return [];
        }

    }


    async climaLugar(lat, lon) {
        try {
            //instance axions.create()
            const instaxios = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`, //?lat=19.09667&lon=-103.96083&appid=17fd3e14cd5a810b6bf42ea60d996149&units=metric',
                //Destructuracion
                params: {...this.paramsWeather, lat, lon }
                //params:{
                //    lat: lat,
                //    lon: lon,
                //    appid: process.env.OPENWHEATHER_KEY,
                //    units: 'metric',
                //}
            });

            const resp = await instaxios.get();

            //respuesta
            //Destructuracion
            const { weather, main } = resp.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
        } catch (error) {
            return [];
        }
    }

    agregarHistorial(lugar = '') {

        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }
        this.historial.unshift(lugar);
        //Guardar db
        this.guardarDB();
    }


    guardarDB() {

        const propiedades = {
            historial: this.historial
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(propiedades));
    }
    leerDB() {

        if (!fs.existsSync(this.dbPath)) {
            return;
        }

        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
        //Convertirlo a json
        const data = JSON.parse(info);

        this.historial = data.historial;
    }

}

module.exports = Busquedas;