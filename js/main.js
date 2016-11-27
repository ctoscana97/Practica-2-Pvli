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

    //var personajes = document.querySelector(#heroes);
    //var tituloHeroes = document.getElementById("heroes");
    //tituloHeroes.lastChild.nodeValue =  prettifyEffect(RPG.entities.characters.heroTank);
    //tituloHeroes.style.color = "red";
    var heroes = [
    {name: 'Tank', hp: 80, maxHp: 80, mp: 30, maxMp: 30, id: 'Tank'},
    {name: 'Wizz', hp: 40, maxHp: 40, mp: 100, maxMp: 100, id: 'Wizz'}
    ];

    var monsters = [
    {name: 'Slime', hp: 40, maxHp: 40, mp: 50, maxMp: 50, id: 'Slime'},
    {name: 'Bat', hp: 5, maxHp: 5, mp: 0, maxMp: 0, id: 'Bat'},
    {name: 'Skeleton', hp: 100, maxHp: 100, mp: 0, maxMp: 0, id: 'Tank'},
    {name: 'Bat', hp: 5, maxHp: 5, mp: 0, maxMp: 0, id: 'Bat 2'}
    ];

    var listH = document.getElementById('heroes');
    heroes.forEach(function (character) {
        var li = document.createElement('li');
        li.innerHTML = character.id + ' (HP: <strong>' + character.hp + '</strong>/'+ 
        character.maxHp +', MP: <strong>' + character.mp + '</strong>/'+ character.maxMp + ')';
        listH.appendChild(li);
    });

    var listM = document.getElementById('monsters');
    monsters.forEach(function (character) {
        var li = document.createElement('li');
        li.innerHTML = character.id + ' (HP: <strong>' + character.hp + '</strong>/'+ 
        character.maxHp +', MP: <strong>' + character.mp + '</strong>/'+ character.maxMp + ')';
        listM.appendChild(li);
    });
    

    var lista = document.getElementsByTagName("");
    lista.style.color = "red";
    personajesH.getElementById("tank").innerHTML = "hola";
    //element.setAttribute(attribute, value)
    var hp = personajesH.getAttribute("tank"); // 
    hp.nodeValue = 80; // 
    personajesH.setAttribute("tank", 80);

    var tank = document.querySelector("li.data-chara-id[name=mojon]");

    //document.getElementById('').innerHTML = ;
    
    // TODO: highlight current character
    // TODO: show battle actions form
    //obj.setActive()
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
        // TODO: hide this menu
        // TODO: go to either select target menu, or to the select spell menu
    });

    targetForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the target chosen by the player
        // TODO: hide this menu
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
        // TODO: hide this menu
        // TODO: go to select target menu
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
