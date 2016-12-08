var battle = new RPG.Battle();
var actionForm, spellForm, targetForm;
var infoPanel;

function prettifyEffect(obj) {
    return Object.keys(obj).map(function (key) {
        var sign = obj[key] > 0 ? '+' : ''; // show + sign for positive effects
        return `${sign}${obj[key]} ${key}`;
    }).join(', ');
}
//Método que muestra y actualiza la información de las dos partys en pantalla con nombre, hp actual y maná.
function MostrarPersonajes(){
    //Obtiene las listas preparadas de ambos para poder editar el html a través de ellas.
    var listH = document.getElementById('heroes');
    var listM = document.getElementById('monsters');
    var hero = battle.characters.allFrom(heroes.id);
    var monstruos = battle.characters.allFrom(monsters.id);
    //Lo inicializamos vacío en cada turno para limpiarlo y no andar imprimiendo de más cada party.
    listH.innerHTML = '';
    listM.innerHTML = '';
    for(var character in hero){
        var li = document.createElement('li');
        li.innerHTML = hero[character].name + '<code>' + ' (HP: <strong>' + hero[character].hp + '</strong>/' + 
        hero[character].maxHp + ', MP: <strong>' + hero[character].mp + '</strong>/'+ hero[character].maxMp + ')'; + '</code>';
        li.dataset.charaid = character;
        listH.appendChild(li);
        //Añade la clase 'dead' al personaje si este está muerto con lo que se tacha automáticamente.
        if (hero[character].hp === 0){
            var persoMuerto = document.querySelector('[data-charaid="' + character + '"]');
            persoMuerto.classList.add('dead');
        }
    }
    for(var character in monstruos){
        var li = document.createElement('li');
        li.innerHTML = monstruos[character].name + '<code>' + ' (HP: <strong>' + monstruos[character].hp + '</strong>/' + 
        monstruos[character].maxHp + ', MP: <strong>' + monstruos[character].mp + '</strong>/'+ monstruos[character].maxMp + ')'; + '</code>';
        li.dataset.charaid = character;
        listM.appendChild(li);
        //Añade la clase 'dead' al personaje si este está muerto con lo que se tacha automáticamente.
        if (monstruos[character].hp === 0){
            var persoMuerto = document.querySelector('[data-charaid="' + character + '"]');
            persoMuerto.classList.add('dead');
        }

    }
}
//////Método que hace las parties aleatorias en cada nueva batalla.
//Función para obtener un número randon entre un mínimo y un máximo.
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//Número destinado a ser el número de participantes en la party heroes.
var numHeroes = getRandomInt(1,4);
//Número destinado a ser el número de participantes en la party monsters.
var numMonstruos = getRandomInt (1,4);
//Arrays de la longitud del número random obtenido anteriormente entre 1 y 4.
var heroArray = new Array (numHeroes);
var monstersArray = new Array (numMonstruos);
//Bucle que asigna cada hueco de la party heroes aleatoriamente.
for (var i = 0; i < heroArray.length; i++){
    var rnd = getRandomInt(1,2);
    if (rnd === 1){
        heroArray[i] = RPG.entities.characters.heroTank;
    }
    else if (rnd === 2){
        heroArray[i] = RPG.entities.characters.heroWizard;
    }
}
//Bucle que asigna cada hueco de la party monsters aleatoriamente.
for (var i = 0; i < monstersArray.length; i++){
    var rnd = getRandomInt(1,3);
    if (rnd === 1){
        monstersArray[i] = RPG.entities.characters.monsterSkeleton;
    }
    else if (rnd === 2){
        monstersArray[i] = RPG.entities.characters.monsterSlime;
    }
    else if (rnd === 3){
        monstersArray[i] = RPG.entities.characters.monsterBat;
    }
}

battle.setup({
    heroes: {
        //Ahora a members le paso el array aleatorio declarado mas arriba.
        members: heroArray,
        grimoire: [
            RPG.entities.scrolls.health,
            RPG.entities.scrolls.fireball
        ]
    },
    monsters: {
        //Ahora a members le paso el array aleatorio declarado mas arriba.
        members: monstersArray
    }
    
});

battle.on('start', function (data) {
    console.log('START', data);
});
battle.on('turn', function (data) {
    console.log('TURN', data);
    // TODO: render the characters
    //Se llama a MostrarPersonajes con la información del turno actual que es data.
    MostrarPersonajes(data);
    // TODO: highlight current character
    //Añade al personaje activo la clase 'active' la cual marca de amarillo automáticamente a qué personaje le toca.
    var persoActivo = document.querySelector('[data-charaid="' + data.activeCharacterId + '"]');
    persoActivo.classList.remove(data.party);
    persoActivo.classList.add('active');

    // TODO: show battle actions
    // Opciones
    var opcionesDeBatalla = actionForm.querySelector('.choices');
    //Llamamos a list() para que nos devuelva las diferentes opciones que tiene el active character.
    var opciones = battle.options.list();
    //Mostramos visible este menú inicialmente en cada turno.
    actionForm.style.display = 'block';
    //Inicializamos a 0 para no imprimir menús de más.
    opcionesDeBatalla.innerHTML = '';
    for (var accion in opciones){
        var li = document.createElement('li');
        //Creamos un botón de selección circular para cada opción.
        li.innerHTML = '<label><input type="radio" name="option" value=' + opciones[accion] + ' required>' + opciones[accion] + '</label>';
        opcionesDeBatalla.appendChild(li);
    }

    // Targets
    var targets = targetForm.querySelector('.choices');
    var objetivos = this._charactersById;
    //Inicializamos a 0 para no imprimir menús de más.
    targets.innerHTML = '';
    for (var personaje in objetivos){
        //Condición añadida como extra para que no se pueda mostrar como objetivo a personajes ya muertos.
        if (objetivos[personaje].hp !== 0){
        var li = document.createElement('li');
        //Creamos un botón de selección circular para cada opción.
        li.innerHTML = '<label><input type="radio" name="option" value="' + personaje + '" required>' + personaje + '</label>';
        //Añade la clase 'monsters' o 'heroes' según la party para que se marque en un color diferente que se ha configurado desde el styles.css.
        if (objetivos[personaje].party === 'monsters'){
            li.classList.add('monsters');
        } else li.classList.add('heroes');
        targets.appendChild(li);
        }
    }

    // Hechizos disponibles
    var hechizos = spellForm.querySelector('.choices');
    //Te devuelve el grimorio disponible de la party del personaje actual.
    var caster = this._activeCharacter;
    var grimorio = this._grimoires[caster.party];
    //Inicializamos a 0 para no imprimir menús de más.
    hechizos.innerHTML = '';
    //Comprobador de que hay algún hechizo disponible.
    var checker = Object.keys(grimorio);
    var botonDeCast = spellForm.querySelector("button");
    //Deshabilita el botón si no hay ningún hechizo en el grimorio del personaje activo.
    if (checker.length === 0 || caster.mp < 25){
        botonDeCast.disabled = true;
    } else botonDeCast.disabled = false;
    for (var hechizo in grimorio){
        var li = document.createElement('li');
        //Creamos un botón de selección circular para cada opción.
        li.innerHTML = '<label><input type="radio" name="option" value=' + grimorio[hechizo].name + ' required>' + grimorio[hechizo].name + '</label>';
        hechizos.appendChild(li);
    }


});

battle.on('info', function (data) {
    console.log('INFO', data);

    // TODO: display turn info in the #battle-info panel
    var info = prettifyEffect(data);
    //Mensaje que se imprime al realizar la opción defender.
    if (data.action === "defend"){
         infoPanel.innerHTML = '<strong>' + data.activeCharacterId + '</strong> ' + data.action + ' and his new defense is: ' + data.newDefense + '.';
    }
    //Mensaje que se imprime al realizar la opción atacar.
    else if (data.action === "attack"){
        var efecto = prettifyEffect(data.effect);
        infoPanel.innerHTML =  '<strong>' + data.activeCharacterId + '</strong> ' + data.action + ' on <strong>' + data.targetId;
        if (data.success === true){
         infoPanel.innerHTML += '. Effect: <strong>'+ efecto + '</strong>.';
        } else infoPanel.innerHTML += '. The action failed.';
    }
    //Mensaje que se imprime al realizar la opción castear.
    else if (data.action === "cast"){
        var efecto = prettifyEffect(data.effect);
        infoPanel.innerHTML = '<strong>' + data.activeCharacterId + '</strong> ' + data.action + ' <strong>' + data.scrollName + '</strong> on <strong>' + data.targetId + '</strong>';
        if (data.success === true){
         infoPanel.innerHTML +=  '. Effect: <strong>'+ efecto + '</strong>.';
        } else infoPanel.innerHTML += '. The action failed.';
    }
});

battle.on('end', function (data) {
    console.log('END', data);

    // TODO: re-render the parties so the death of the last character gets reflected
    MostrarPersonajes();
    // TODO: display 'end of battle' message, showing who won
    infoPanel.innerHTML = 'La party ganadora ha sido: ' + data.winner +'  ';
    infoPanel.innerHTML += '<button type="submit" onClick="history.go(0)">New Battle</button>';
});

window.onload = function () {
    actionForm = document.querySelector('form[name=select-action]');
    targetForm = document.querySelector('form[name=select-target]');
    spellForm = document.querySelector('form[name=select-spell]');
    infoPanel = document.querySelector('#battle-info');

    actionForm.addEventListener('submit', function (evt) {
        evt.preventDefault();

        // TODO: select the action chosen by the player
        var action = actionForm.elements['option'].value;
        battle.options.select(action);
        // TODO: hide this menu
        actionForm.style.display = 'none';
        // TODO: go to either select target menu, or to the select spell menu
        if (action === 'cast'){
            spellForm.style.display = 'block';
        }
        else if (action === 'attack') {
            targetForm.style.display = 'block';
        }

    });

    targetForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the target chosen by the player
        var objetivo = targetForm.elements['option'].value;
        battle.options.select(objetivo);
        // TODO: hide this menu
        targetForm.style.display = 'none';
    });

    targetForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
        battle.options.cancel();
        // TODO: hide this form
        targetForm.style.display = 'none';
        // TODO: go to select action menu
        actionForm.style.display = 'block';
    });

    spellForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the spell chosen by the player
        var hechizoSeleccionado = spellForm.elements['option'].value;
        battle.options.select(hechizoSeleccionado);
        // TODO: hide this menu
        spellForm.style.display = 'none';
        // TODO: go to select target menu
        targetForm.style.display = 'block';
    });

    spellForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
        battle.options.cancel();
        // TODO: hide this form
        spellForm.style.display = 'none';
        // TODO: go to select action menu
        actionForm.style.display = 'block';
    });

    battle.start();
};
