document.addEventListener("DOMContentLoaded", (event) => {
    jeu.demarrer()
});

var jeu = {
    audioBackground: null,
    audioBoss: null,
    parametres: {
        probasMonstre: 10,
        probaRiposte: 15,
        incrementPas: 10,
        bosss: 999
    },
    etat: {
        pas: 0,
        combat: false,
        objectif: 100,
        victoire: false
    },
    monstres: [
        "img/monstres/monstre2.png",
        "img/monstres/monstre3.png",
        "img/monstres/monstre4.png",
        "img/monstres/monstre5.png",
        "img/monstres/monstre6.png",
        "img/monstres/monstre7.png",
        "img/monstres/monstre8.png",
        "img/monstres/monstre9.png",
        "img/monstres/monstre10.png"
    ],
    mortt: "img/mort/mourirr.png",
    monstre: null,
    persos: [
        {
            'nom': "Viking",
            'pvMax': 150,
            'pvCourant': 150,
            'force': 5,
            'intelligence': 1,
            'image': 'maurice.png'
        },
        {
            'nom': "Wizard",
            'pvMax': 75,
            'pvCourant': 75,
            'force': 1,
            'intelligence': 5,
            'image': 'apple.png'
        },
        {
            'nom': "Molly",
            'pvMax': 100,
            'pvCourant': 100,
            'force': 3,
            'intelligence': 3,
            'image': 'molly.png'
        },
        {
            'nom': "Knight",
            'pvMax': 200,
            'pvCourant': 200,
            'force': 2,
            'intelligence': 2,
            'image': 'Weakyy.png'
        }
    ],
    objets: [
        {
            'nom': "une pillule de force",
            'image': 'pills2.png'
        },
        {
            'nom': "un bandage de force",
            'image': 'bandage.png'
        }
    ],

    personnage: null,

    playAudio: function (son) {
        let audio = new Audio(son)
        audio.play();

        return audio
    },

    demarrer: function () {
        this.ecrire("ça démarre", "basic")
        this.ecrire("choisis ton personnage...", "basic")
        this.choixPerso()

        let easteregg = document.querySelector("#progression")
        let persoEasteregg = {
            'nom': "EasterEgg",
            'pvMax': 9999999,
            'pvCourant': 9999999,
            'force': 9999999,
            'intelligence': 9999999,
            'image': 'easter-egg.png'
             }
        easteregg.addEventListener("click", (event) => {
            jeu.persos.push(persoEasteregg)

            jeu.affichePerso(persoEasteregg)
         });  

        let continuer = document.querySelector("#continuer")
        continuer.addEventListener("click", (event) => {
            jeu.avancer()
        });

        let combattre = document.querySelector("#combattre")
        combattre.addEventListener("click", (event) => {
            jeu.combattre()
            jeu.playAudio("sounds/punch.mp3")
        });

        let fuir = document.querySelector("#fuir")
        fuir.addEventListener("click", (event) => {
            jeu.fuir()
        });

        let recommencer = document.querySelector("#recommencer")
        recommencer.addEventListener("click", (event) => {
            location.reload()
        });

        const close = document.getElementById("close");
        const rulesDialog = document.getElementById("rulesDialog");
        let rules = document.querySelector("#rules")
        rules.addEventListener("click", (event) => {
            jeu.playAudio("sounds/clicksound.mp3")
            rulesDialog.showModal();
        });
        close.addEventListener("click", () => {
            jeu.playAudio("sounds/clicksound.mp3")
            rulesDialog.close();
        });
    },

    effacerjournal: function () {
        let journal = document.querySelector("#journal")
        journal.innerHTML = ""
    },

    effacerMonstre: function (mort = true) {
        let img = document.querySelector("#rencontre img")
        // img.src = ""
        if(mort) {
            img.classList.add("mort")
        } else {
            img.classList.add("fuit")
        }
        
        let text = document.querySelector("#rencontre span")
        text.innerHTML = ""
    },

    combattre: function () {
        let jetDe = this.getRandomInt(1, 6)
        let force = this.personnage.force
        let degat = jetDe * force

        this.ecrire(`vous tapez à ${degat}`)
        this.monstre.pv = this.monstre.pv - degat

        let text = document.querySelector("#rencontre span")
        text.innerHTML = `❤️ ${this.monstre.pv}`

        if (this.monstre.pv < 1) {
            this.etat.combat = false

            this.ecrire(`vous avez vaincu le ${this.monstre.name}`, 'vert')
            this.effacerMonstre()
            if (this.monstre.name == "boss") {
                this.etat.victoire = true
                jeu.playAudio("sounds/win.mp3")
                this.audioBoss.pause()
                this.audioBackground.play()
                document.body.style.backgroundImage = "url(img/autres/NewBackground.png)"
                document.querySelector("h1").style.color = "white"
                this.effacerjournal()
                this.ecrire("⊱∽-∾----∾∾-----∾-∽⊰")
                this.ecrire(`Votre force finale est de ${this.personnage.force}`)
                this.ecrire(`Votre intelligence finale est de ${this.personnage.intelligence}`)
                this.ecrire(`.`, "invisible")
                this.ecrire(`Vous avez tué les monstres, le roi vous offre sa bénédiction`)
                this.ecrire("⊱∽-∾----∾∾-----∾-∽⊰")
                let paragraphes = document.querySelectorAll("#journal p")
                paragraphes.forEach(paragraphe => {
                    paragraphe.style.color = "black"
                });
            } else {
                if (this.personnage.pvCourant != this.personnage.pvMax) {
                    let gainPV = this.personnage.pvCourant / 2
                    if (this.personnage.pvCourant + gainPV > this.personnage.pvMax) {
                        this.personnage.pvCourant = this.personnage.pvMax
                    } else {
                        this.personnage.pvCourant += gainPV
                    }

                    this.updatePv()
                    this.ecrire(`vous regagnez des pv`, "vert")
                }
            }

            this.gestionBoutons()

        } else {
            let result = this.getRandomInt(0, 100)
            if (result < this.parametres.probaRiposte) {
                jetDe = this.getRandomInt(1, 6)
                force = this.monstre.force
                degat = jetDe * force / 2

                this.ecrire(`le monstre vous tape à ${degat}`, "rouge")
                this.personnage.pvCourant -= degat
                if( this.personnage.pvCourant < 0) {
                    this.personnage.pvCourant = 0
                }
                console.log(degat)
                console.log(this.personnage.pvCourant)
                jeu.playAudio("sounds/hit.mp3")

                this.updatePv()

                if (this.personnage.pvCourant < 1) {
                    this.etat.combat = false
                    this.ecrire(`vous êtes mort...`, 'mort')
                    this.ecrire(`voulez vous recommencez ?`, 'mort')
                    this.gestionBoutons()
                    jeu.mourir()
                }
            }
        }
    },

    fuir: function () {
        this.personnage.intelligence -= 1
        this.updateInt()
        this.etat.combat = false
        this.gestionBoutons()
        this.ecrire('Vous fuyez lachement le combat')
        this.effacerMonstre(false)
    },

    avancer: function () {
        this.ecrire("-------------------")
        this.ecrire(`${this.personnage.nom} avance de ${this.parametres.incrementPas} pas`)
        this.etat.pas += this.parametres.incrementPas
        let blocPas = document.querySelector('#nbdepas')
        blocPas.innerHTML = `${this.etat.pas} pas`
        // let percent = this.etat.pas / this.etat.objectif * 100
        let lastDigit = parseInt(this.etat.pas.toString().slice(-2));
        if(lastDigit == "00") {
            lastDigit = "99"
        }
        blocPas.style.width = lastDigit + "%"
        let img = document.querySelector("#rencontre img")

        img.classList.remove("mort")
        img.classList.remove("fuit")


        if (this.etat.pas == this.etat.objectif) {
            this.personnage.pvMax += 100
            this.personnage.pvCourant = this.personnage.pvMax
            this.etat.objectif += 100
            this.updatePv()
        }

        // ON TOMBE SUR LE BOSS
        if (this.etat.pas > this.parametres.bosss) {
            this.etat.combat = true
            this.gestionBoutons(true)
            this.audioBackground.pause()
            this.audioBoss = jeu.playAudio("sounds/Boss.ogg")
            this.audioBoss.loop = true
            this.ecrire("Bravo, bous avez atteint le boss final, le fight commence maintenant")
            this.ecrire("⊱∽-∾----∾∾-----∾-∽⊰")
            this.genereMonstre(true)
        } else {
            let result = this.getRandomInt(0, 100)
            // ON TOMBE SUR UN MONSTRE
            if (result < this.parametres.probasMonstre) {
                this.ecrire("Attention un monstre...")
                this.etat.combat = true
                this.gestionBoutons()
                this.genereMonstre(false)

            } else {
                // ON TOMBE SUR UN COFFRE

                let randomObjet = this.objets[Math.floor(Math.random() * this.objets.length)]
                this.ecrire(`Vous tombez sur un coffre contenant ${randomObjet.nom} !`, "vert")
                let gainForce = this.getRandomInt(0, 5)
                this.personnage.force += gainForce
                this.ecrire(`Vous gagnez ${gainForce} de force`, "vert")
                let force = document.querySelector("#stat-force")
                force.innerHTML = this.personnage.force
                img.src = "img/objets/" + randomObjet.image
                let text = document.querySelector("#rencontre span")
                text.innerHTML = ""
            }
        }

    },

    mourir: function () {
        let continuer = document.querySelector("#continuer")
        continuer.classList.remove("shown")
        let combattre = document.querySelector("#combattre")
        combattre.classList.remove("shown")
        let fuir = document.querySelector("#fuir")
        fuir.classList.remove("shown")
        let recommencer = document.querySelector("#recommencer")
        recommencer.classList.add("shown")
        let img = document.querySelector("#rencontre img")
        img.src = "img/mort/mourirr.png"
        background.classList.add("mortt")
    },
    fuirr: function () {
        let fuir = document.querySelector("#fuir")
        fuir.classList.remove("shown")
        this.ecrire("Vous n'avez plus d'intelligence, faites attention ")
    },

    rules: function () {
        let journal = document.querySelector("#regle")
        journal.innerHTML

    },

    genereMonstre: function (isBoss) {
        let pv
        let image
        let force
        let name
        if (isBoss == true) {
            image = "img/monstres/boss.png"
            pv = 25000
            force = 100
            name = "boss"
        } else {
            name = "monstre standard"
            image = this.monstres[Math.floor(Math.random() * this.monstres.length)]
            pv = this.etat.pas * this.getRandomInt(5, 10)
            force = Math.trunc(pv / 15)
        }

        let monstre = {
            'pv': pv,
            'force': force,
            'image': image,
            'name': name
        }

        this.monstre = monstre
        let img = document.querySelector("#rencontre img")
        let text = document.querySelector("#rencontre span")
        img.src = this.monstre.image
        text.innerHTML = `❤️ ${this.monstre.pv}`
        this.ecrire(`il a ${pv}hp et ${force} de force`)
    },
    cacherPersonnage: function () {
        let blocPersos = document.querySelector("#personnages")
        blocPersos.classList.add("hidden")
    },

    ecrire: function (text, color) {
        let journal = document.querySelector("#journal")
        let ligne = document.createElement("p")
        ligne.classList.add(color)
        ligne.innerHTML = text
        journal.appendChild(ligne)
        ligne.scrollIntoView()
    },

    choixPerso: function () {
        let persos = this.persos
        persos.forEach(perso => {
            this.affichePerso(perso)
        })
    },

    gestionBoutons: function (isBoss = false) {

        if (!this.etat.victoire) {
            if (!this.etat.combat) {
                let continuer = document.querySelector("#continuer")
                continuer.classList.add("shown")
                let combattre = document.querySelector("#combattre")
                combattre.classList.remove("shown")
                let fuir = document.querySelector("#fuir")
                fuir.classList.remove("shown")
            } else {
                let continuer = document.querySelector("#continuer")
                continuer.classList.remove("shown")
                let combattre = document.querySelector("#combattre")
                combattre.classList.add("shown")
                if (isBoss) {
                    let fuir = document.querySelector("#fuir")
                    fuir.classList.remove("shown")
                } else {
                    let fuir = document.querySelector("#fuir")
                    fuir.classList.add("shown")
                    if (this.personnage.intelligence <= 0) {
                        this.fuirr()
                    }
                }
            }
        } else {
            let continuer = document.querySelector("#continuer")
            continuer.classList.remove("shown")
            let combattre = document.querySelector("#combattre")
            combattre.classList.remove("shown")
            let fuir = document.querySelector("#fuir")
            fuir.classList.remove("shown")
            let recommencer = document.querySelector("#recommencer")
            recommencer.classList.add("shown")
        }
    },

    getRandomInt: function (min, max) {
        return Math.round(Math.random() * (max - min) + min);
    },

    updatePv: function () {
        let hp = document.querySelector("#stat-hp")
        hp.innerHTML = this.personnage.pvCourant
    },

    updateInt: function () {
        let int = document.querySelector("#stat-int")
        int.innerHTML = this.personnage.intelligence
    },

    affichePerso: function (perso) {
        let blocPersos = document.querySelector("#personnages")
        let bloc = document.createElement("div")
        bloc.classList.add("perso")
        bloc.dataset.nom = perso.nom
        bloc.innerHTML = `<p>${perso.nom}</p><img src="img/persos/${perso.image}" /><p>${perso.pvMax} hp</p><p>for: ${perso.force}</p><p>int: ${perso.intelligence}</p>`
        blocPersos.appendChild(bloc)

        bloc.addEventListener("click", (event) => {
            jeu.playAudio("sounds/clicksound.mp3")
            let nomPerso = event.currentTarget.dataset.nom
            const perso = this.persos.find((perso) => perso.nom === nomPerso);
            this.personnage = perso
            this.audioBackground = jeu.playAudio("sounds/background.mp3")
            this.audioBackground.loop = true
            let haut = document.querySelector("#haut")
            haut.addEventListener("click", (event) => {
                console.log("haut")
                if (this.audioBackground.volume < 1) {
                    this.audioBackground.volume = this.audioBackground.volume + 0.2;
                }
            });
            let bas = document.querySelector("#bas")
            bas.addEventListener("click", (event) => {
                console.log("bas")
                if (this.audioBackground.volume >= 0.2) {
                    this.audioBackground.volume = this.audioBackground.volume - 0.2;
                }
            });
            jeu.effacerjournal()
            jeu.cacherPersonnage()
            jeu.ecrire(`Bienvenue ${perso.nom} !`, "pasimportant")


            let stats = document.querySelector("#stats")
            stats.classList.add("shown")

            let actions = document.querySelector("#actions")
            actions.classList.add("shown")
            this.updatePv()

            let force = document.querySelector("#stat-force")
            force.innerHTML = perso.force

            let inte = document.querySelector("#stat-int")
            inte.innerHTML = perso.intelligence

            let img = document.querySelector("#perso-image")
            img.src = "img/persos/" + perso.image

            jeu.gestionBoutons()
        });
    }
}
