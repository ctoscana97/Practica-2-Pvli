var battle = new RPG.Battle();
var actionForm, spellForm, targetForm;
var infoPanel;

function prettifyEffect(obj) {
    return Object.keys(obj).map(function (key) {
        var sign = obj[key] > 0 ? '+' : ''; // show + sign for positive effects
        return `${sign}${obj[key]} ${key}`;
    }).join(', ');
}
    /*
    Apuntes: variable global document
        desde javascript modificamos el document
    */
//document.querySelector(."examples").styles.backgroundColor = "red";
//Styles.display="block"; para mostrar
battle.setup({
    heroes: {
        members: [
            RPG.entities.characters.heroTank,
            RPG.entities.characters.heroWizard
        ],
        grimoire: [
            RPG.entities.scrolls.health,
            RPG.entities.scrolls.fireball
        ]
    },
    monsters: {
        members: [
            RPG.entities.characters.monsterSlime,
            RPG.entities.characters.monsterBat,
            RPG.entities.characters.monsterSkeleton,
            RPG.entities.characters.monsterBat
        ]
    }
    
});

battle.on('start', function (data) {
    console.log('START', data);
});
battle.on('turn', function (data) {
    console.log('TURN', data);
    // TODO: render the characters
    var listH = document.getElementById('heroes');
    var listM = document.getElementById('monsters');
    var hero = battle.characters.allFrom(heroes.id);
    var monstruos = battle.characters.allFrom(monsters.id);
    listH.innerHTML = '';
    listM.innerHTML = '';
    for(var character in hero){
        var li = document.createElement('li');
        li.innerHTML = hero[character].name + '<code>' + ' (HP: <strong>' + hero[character].hp + '</strong>/' + 
        hero[character].maxHp + ', MP: <strong>' + hero[character].mp + '</strong>/'+ hero[character].maxMp + ')'; + '</code>';
        li.dataset.charaid = character;
        listH.appendChild(li);

    }
    for(var character in monstruos){
        var li = document.createElement('li');
        li.innerHTML = monstruos[character].name + '<code>' + ' (HP: <strong>' + monstruos[character].hp + '</strong>/' + 
        monstruos[character].maxHp + ', MP: <strong>' + monstruos[character].mp + '</strong>/'+ monstruos[character].maxMp + ')'; + '</code>';
        li.dataset.charaid = character;
        listM.appendChild(li);

    }
    // TODO: highlight current character
    var persoActivo = document.querySelector('[data-charaid="' + data.activeCharacterId + '"]');
    persoActivo.classList.add('active');
    // TODO: show battle actions
    // Opciones
    var opcionesDeBatalla = actionForm.querySelector('.choices');
    var opciones = battle.options.list();
    actionForm.style.display = 'block';
    opcionesDeBatalla.innerHTML = '';
    for (var accion in opciones){
        var li = document.createElement('li');
        li.innerHTML = '<label><input type="radio" name="option" value=' + opciones[accion] + ' required>' + opciones[accion] + '</label>';
        opcionesDeBatalla.appendChild(li);
    }
    // Targets
    var targets = targetForm.querySelector('.choices');
    var objetivos = this._charactersById;
    targets.innerHTML = '';
    for (var personaje in objetivos){
        var li = document.createElement('li');
        li.innerHTML = '<label><input type="radio" name="option" value=' + objetivos[personaje].name + ' required>' + objetivos[personaje].name + '</label>';
        targets.appendChild(li);
    }
    // Hechizos disponibles
    var hechizos = spellForm.querySelector('.choices');
    var grimorio = this._grimoires['heroes'];
    hechizos.innerHTML = '';
    for (var hechizo in grimorio){
        var li = document.createElement('li');
        li.innerHTML = '<label><input type="radio" name="option" value=' + grimorio[hechizo].name + ' required>' + grimorio[hechizo].name + '</label>';
        hechizos.appendChild(li);
    }


});

battle.on('info', function (data) {
    console.log('INFO', data);

    // TODO: display turn info in the #battle-info panel
});

battle.on('end', function (data) {
    console.log('END', data);

    // TODO: re-render the parties so the death of the last character gets reflected
    // TODO: display 'end of battle' message, showing who won
});

window.onload = function () {   //LLamada una vez cargados todos los recursos
    actionForm = document.querySelector('form[name=select-action]'); //form, tipo de etiqueta [atributos = valor] //busqueda unica
    targetForm = document.querySelector('form[name=select-target]'); //En vez de name ponemos el style (para el estilo claro)
    spellForm = document.querySelector('form[name=select-spell]');  //buscar por ID es util (son unicos)
    infoPanel = document.querySelector('#battle-info'); //# es ID
    //buscar por conjunto = buscar por query

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
        // TODO: hide this form
        // TODO: go to select action menu
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
        // TODO: hide this form
        // TODO: go to select action menu
    });

    battle.start();
};
