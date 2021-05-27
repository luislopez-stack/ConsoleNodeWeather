require('dotenv').config();

const { leerInput, inquirerMenu, pausa, listadolugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');



const main = async() => {


    let opcionMenu;
    const busquedas = new Busquedas();



    do {

        opcionMenu = await inquirerMenu();
        console.log({ opcionMenu });

        switch (opcionMenu) {
            case 1:
                //Mostrar mensaje
                const busqueda = await leerInput('Ciudad: ');

                //Buscar los lugares
                const lugares = await busquedas.ciudad(busqueda);

                //Seleccionar el lugar
                const idSeleccion = await listadolugares(lugares);
                if (idSeleccion === '0') continue


                //console.log({ idSeleccion });
                const lugarSelec = lugares.find(lu => lu.id === idSeleccion);
                //console.log(lugarSelec);

                //guardar historial
                busquedas.agregarHistorial(lugarSelec.nombre);

                //Clima
                const clima = await busquedas.climaLugar(lugarSelec.lat, lugarSelec.lng);
                //console.log(clima);

                //Mostrar resultados
                console.log('\nInformacion del lugar\n'.green);
                console.log('Ciudad:', lugarSelec.nombre);
                console.log('Lat;', lugarSelec.lat);
                console.log('Lng:', lugarSelec.lng);
                console.log('Temperatura:', clima.temp);
                console.log('Minima:', clima.min);
                console.log('Maxima:', clima.max);
                console.log('Maxima:', clima.desc);
                break;
            case 2:

                busquedas.historial.forEach((lugar, i) => {
                    const idx = `${ i + 1}.`.green;
                    console.log(`${ idx} ${ lugar}`);
                })

                break;
            default:
                break;
        }


        if (opcionMenu !== 0) await pausa();

    } while (opcionMenu !== 0)

}


main();