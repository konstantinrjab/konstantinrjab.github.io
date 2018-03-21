// document.addEventListener("keyup", function(event) {
//     if (event.keyCode === 13) {
//         // Trigger the button element with a click
//         document.getElementById("modal__button").click();
//     }
// });
function modalSubmit() {
    // delete player1;
    // delete player2;
    let player1;
    let player2;
    //check fighters types
    if (document.getElementById('fighter-type-1').checked) {
        player1 = new Captain(1);
    } else if (document.getElementById('fighter-type-2').checked) {
        player1 = new Lieutenant(1);
    }

    if (document.getElementById('fighter-type-3').checked) {
        player2 = new Captain(2);
    } else if (document.getElementById('fighter-type-4').checked) {
        player2 = new Lieutenant(2);
    }
    //hide modal
    document.getElementById('modal__wrapper_main').style.visibility = 'hidden';
    gameStart(player1, player2);
}

function gameStart(player1, player2) {
    let map = {}; // You could also use an array
    onkeydown = onkeyup = function (e) {
        e = e || event; // to deal with IE
        map[e.keyCode] = e.type === 'keydown';
        // console.log(map);
    };

    testKeys(map, player1, player2);

    function testKeys(map, player1, player2) {
        if (map[16]) {
            player1.attack(player2);
        }
        if (map[13]) {
            player2.attack(player1);
        }
        if (map[65]) {
            player1.move_left();
        }
        if (map[68]) {
            player1.move_right();
        }
        if (map[37]) {
            player2.move_left();
        }
        if (map[39]) {
            player2.move_right();
        }
        setTimeout(function () {
            testKeys(map, player1, player2)
        }, 10);
    }
}

// gameEnd(winner){
//     console.log(winner);
// }

class Fighter {
    constructor(number, width, type, attack_time, attack_damage, attack_range, health, move_speed) {
        this.number = number;
        this.type = type;
        this.icon = document.getElementById('icon-fighter-' + number);
        this.icon.width = width;
        this.icon.classList.add(this.type);
        this.icon.position = this.icon.getBoundingClientRect().left;
        this.model = document.getElementById('model-fighter-' + number);
        this.model.position = this.model.getBoundingClientRect().left;
        this.attack_time = attack_time;
        this.attack_damage = attack_damage;
        this.attack_range = attack_range;
        this.health = health;
        this.max_health = health;
        this.move_speed = move_speed;
        this.attack_sound = new Audio('css/' + type + '-attack.mp3');
        this.icon.classList.add(this.type + '_attack');
        let that = this;
        setTimeout(function () {
                that.idle()
            }, that.attack_time
        );
        this.attack_sound.play();
    }

    idle() {
        this.removeAnimation();
        this.icon.classList.add(this.type + '_idle');
    }

    attack(opponent) {
        if (this.icon.classList.contains(this.type + '_attack')) {
            return false;
        }
        this.removeAnimation();
        this.icon.classList.add(this.type + '_attack');
        this.attack_sound.pause();
        this.attack_sound.currentTime = 0;
        this.attack_sound.play();
        let that = this;
        setTimeout(function () {
                that.idle()
            }, that.attack_time
        );

        //range between fighters
        setTimeout(function () {
            let range;
            if (that.number === 1) {
                range = that.attack_range + that.model.offsetWidth;
            }
            else {
                range = that.attack_range + opponent.model.offsetWidth;
            }

            //condition for fighter 1
            if (that.number === 1 && (opponent.model.position - that.model.position) < range && (opponent.model.position - that.model.position) > 0) {
                opponent.getDamage(that.attack_damage, 1);
            }
            //condition for fighter 2
            if (that.number === 2 && (that.model.position - opponent.model.position) < range && (that.model.position - opponent.model.position) > 0) {
                opponent.getDamage(that.attack_damage, 2);
            }
        }, that.attack_time * 0.8);
    }


    move_right() {
        if (this.icon.position < (document.body.clientWidth - 30 - this.icon.width)) {
            this.icon.position = this.icon.position + this.move_speed;
            this.icon.style.left = this.icon.position + 'px';
            this.model.position = this.model.getBoundingClientRect().left;
        }
    }

    move_left() {
        // this.icon.position = parseInt(this.icon.style.left, 10);
        if (this.model.position > 30) {
            this.icon.position = this.icon.position - this.move_speed;
            this.icon.style.left = this.icon.position + 'px';
            this.model.position = this.model.getBoundingClientRect().left;
        }
    }

    getDamage(value, winner) {
        this.health = this.health - value;
        let width = parseInt(document.getElementById('info__health_' + this.number).style.width, 10);
        // console.log(this.health - (value * width / this.max_health));
        document.getElementById('fighter-' + this.number + '-health').style.width = this.health / this.max_health * width + '%';
        if (this.health <= 0) {
            this.die(winner);
        }
    }

    die(winner) {
        this.removeAnimation();
        this.icon.classList.add(this.type + '_death');
        // delete this.move_right();
        // delete this.move_left();
        // delete this.attack();
        // delete this.icon;
        // alert('player'+ winner + ' wins!');
        document.getElementById('greeting').innerHTML = 'player' + winner + ' wins!<br>start new game';
        document.getElementById('modal__wrapper_main').style.visibility = 'visible';
        document.getElementById('fighter-1-health').style.width = '90%';
        document.getElementById('fighter-2-health').style.width = '90%';
    }

    removeAnimation() {
        this.icon.classList.remove(this.type + '_idle', this.type + '_attack');
    }
}

class Captain extends Fighter {
    constructor(number) {
        super(number, 133, 'captain', 300, 30, 90, 100, 10);
    }
}

class Lieutenant extends Fighter {
    constructor(number) {
        super(number, 278, 'lieutenant', 500, 15, 180, 80, 7);
    }
}
