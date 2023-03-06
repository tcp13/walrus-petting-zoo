const gameState = {};

var config = {
    type: Phaser.AUTO,
    height: 500,
    width: 1000,
    background: 0x0f0f0f,
    parent: "canvas",
    scale: {
        parent: 'canvas',
        mode: Phaser.Scale.FIT,
        width: 1000,
        height: 500
    },
    scene:{
        preload,
        create,
        update
    }
}

var game = new Phaser.Game(config);

function preload(){
    // loading bar
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(340, 240, 320, 50);
    
    var loadingText = this.make.text({
        x: 500,
        y: 265,
        text: 'Loading...',
        style: {
            font: '20px monospace',
            fill: '#ffffff'
        }
    });
    loadingText.setOrigin(0.5, 0.5);
    
    this.load.on('progress', function (value) {
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(350, 250, 300 * value, 30);
    });
    
    this.load.on('complete', function () {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
    });


    // load assets
    this.load.image("walrus", "assets/walrus.png");
    this.load.image("chicken", "assets/chicken.png");
    this.load.image("cow", "assets/cow.png");
    this.load.image("duck", "assets/duck.png");
    this.load.image("giraffe", "assets/giraffe.png");
    this.load.image("goat", "assets/goat.png");
    this.load.image("horse", "assets/horse.png");
    this.load.image("narwhal", "assets/narwhal.png");
    this.load.image("panda", "assets/panda.png");
    this.load.image("penguin", "assets/penguin.png");
    this.load.image("pig", "assets/pig.png");
    this.load.image("rabbit", "assets/rabbit.png");
    this.load.image("plus", "assets/plus.png");
    this.load.image("computer", "assets/computer.png");
    this.load.image("coffee", "assets/coffee.png");
    this.load.image("meds", "assets/meds.png");
    this.load.image("save", "assets/save.png");
    this.load.image("music-on", "assets/music-on.png");
    this.load.image("music-off", "assets/music-off.png");
    this.load.spritesheet("visitor1", "assets/male-sheet.png", { frameWidth: 80, frameHeight: 110 });
    this.load.spritesheet("visitor2", "assets/female-sheet.png", { frameWidth: 80, frameHeight: 110 });
    this.load.spritesheet("visitor3", "assets/adventurer-sheet.png", { frameWidth: 80, frameHeight: 110 });
    this.load.spritesheet("visitor4", "assets/soldier-sheet.png", { frameWidth: 80, frameHeight: 110 });
    this.load.spritesheet("zombie", "assets/zombie-sheet.png", { frameWidth: 80, frameHeight: 110 });
    this.load.image("bg", "assets/background.png");
    this.load.audio("music", "assets/music.mp3");
    this.load.audio("pop", "assets/pop.ogg");
    this.load.audio("click", "assets/click.ogg");
    this.load.audio("zombie-groan", "assets/zombie-groan.mp3");
    this.load.audio("zombie-eat", "assets/zombie-eat.mp3");
    this.load.audio("zombie-die", "assets/zombie-die.mp3");
}

function create(){

    const fontConfigScore = { font: "36px 'Roboto', sans-serif", color: "#0F0F0F", align: "center"};
    const fontConfigTooltip = { font: "18px 'Roboto', sans-serif", color: "#F0F0F0", align: "center", backgroundColor: "#2C313A", padding: {x:10, y:10}};
    const fontConfigCount = { font: "18px 'Roboto', sans-serif", color: "#0F0F0F", align: "center"};
    const fontConfigVisitors = { font: "18px 'Roboto', sans-serif", color: "#F0F0F0", align: "center", backgroundColor: "#2C313A", padding: {x:10, y:10}};
    const fontConfigAlert = { font: "18px 'Roboto', sans-serif", color: "#F0F0F0", align: "center", backgroundColor: "#2C313A", padding: {x:10, y:10}};

    // { font: "18px 'Roboto', sans-serif", color: "#0F0F0F", align: "left", stroke: '#F0F0F0', strokeThickness: 0, padding: {x: 4, y: 4}, backgroundColor: "#F0F0F0"};

    // play background music
    gameState.music = this.sound.add("music", { loop: true });
    gameState.music.play();

    // define sounds
    gameState.pop = this.sound.add("pop", {loop:false});
    gameState.click = this.sound.add("click", {loop:false});
    gameState.zombieGroan = this.sound.add("zombie-groan", {loop:false});
    gameState.zombieEat = this.sound.add("zombie-eat", {loop:false});
    gameState.zombieDie = this.sound.add("zombie-die", {loop:false});

    // save game
    gameState.saveButton = this.add.sprite(965, 35, "save").setOrigin(0.5).setScale(0.8).setInteractive({cursor: 'pointer'});
    gameState.saveButton.on("pointerup", function(){
        saveGame();
        displayAlert("Game saved!");
    });

    // toggle music
    gameState.musicOnButton = this.add.sprite(915, 35, "music-on").setOrigin(0.5).setScale(0.8).setInteractive({cursor: 'pointer'});
    gameState.musicOffButton = this.add.sprite(915, 35, "music-off").setOrigin(0.5).setScale(0.8).setInteractive({cursor: 'pointer'}).setActive(false).setAlpha(0);
    gameState.musicOnButton.on("pointerup", function(){
        gameState.music.volume = 0;
        gameState.musicOnButton.setActive(false).setAlpha(0);
        gameState.musicOffButton.setActive(true).setAlpha(1);
    });
    gameState.musicOffButton.on("pointerup", function(){
        gameState.music.volume = 1;
        gameState.musicOffButton.setActive(false).setAlpha(0);
        gameState.musicOnButton.setActive(true).setAlpha(1);
    });

    // score
    gameState.score = 0;
    gameState.scoreText = this.add.text(500, 350, '0', fontConfigScore).setOrigin(0.5);

    // background
    gameState.bg = this.add.sprite(250, 125, "bg").setScale(0.8).setOrigin(0.5);
    gameState.bg.depth = -100;

    // walrus
    gameState.animalName = "Walrus";
    gameState.animalNamePlural = "Walruses";
    gameState.walrus = this.add.sprite(500, 230, "walrus");
    gameState.walrus.setInteractive({cursor: 'grab'});
    gameState.walrus.on("pointerup", function(){
        gameState.score += gameState.walrusCount;
    });

    // walrus count
    gameState.walrusCount = 1;
    gameState.walrusCountText = this.add.text(50, 480, "x1", fontConfigCount).setOrigin(0.5);

    // powerups tooltip
    gameState.powerupTooltip = this.add.text(200, 340, "Lorem Ipsum", fontConfigTooltip).setOrigin(0.5).setAlpha(0);
    gameState.costTooltip = this.add.text(50, 480, "(-10)", fontConfigCount).setOrigin(0.5).setAlpha(0);

    // alert
    gameState.alert = this.add.text(500, 50, "Alert", fontConfigAlert).setAlpha(0).setOrigin(0.5);

    // walrus adder
    gameState.walrusAdder = this.add.sprite(50, 430, "walrus").setScale(0.425).setInteractive({cursor: 'pointer'});
    gameState.walrusCost = 10;
    gameState.walrusQuantity = 1;
    defineTooltip(gameState.walrusAdder, gameState.walrusCost, 1, gameState.walrusCountText, "Add " + gameState.animalName + "\n(Pet Multiplier)");
    let walrusSchedule = [
        {at: 1000, add: 100, cost: 1000, tooltip: "Add 100 " + gameState.animalNamePlural + "\n(Pet Multiplier)"},
        {at: 250, add: 50, cost: 500, tooltip: "Add 50 " + gameState.animalNamePlural + "\n(Pet Multiplier)"},
        {at: 100, add: 10, cost: 100, tooltip: "Add 10 " + gameState.animalNamePlural + "\n(Pet Multiplier)"},
        {at: 25, add: 5, cost: 50, tooltip: "Add 5 " + gameState.animalNamePlural + "\n(Pet Multiplier)"}
    ];
    gameState.walrusAdder.on("pointerup", function(){
        if(gameState.score >= gameState.walrusCost){
            gameState.walrusCount += gameState.walrusQuantity;
            gameState.score -= gameState.walrusCost;
            gameState.click.play();
        }

        gameState.walrusCountText.text = "x" + gameState.walrusCount;

        for(let i in walrusSchedule){
            if(gameState.walrusCount >= walrusSchedule[i].at){
                gameState.walrusQuantity = walrusSchedule[i].add;
                gameState.walrusCost = walrusSchedule[i].cost;
                defineTooltip(gameState.walrusAdder, gameState.walrusCost, 1, gameState.walrusCountText, walrusSchedule[i].tooltip);
                break;
            }
        }
    });

    // visitor status
    gameState.visitorsWelcome = false;
    gameState.visitorStatusText = this.add.text(20, 20, "CLOSED to Visitors", fontConfigVisitors);
    gameState.visitorStatusText.setInteractive({cursor: 'pointer'});
    gameState.visitorStatusText.on("pointerup", function(){
        if(gameState.visitorsWelcome == false){
            gameState.visitorsWelcome = true;
            gameState.visitorStatusText.text = "OPEN to Visitors";
            gameState.click.play();
        }
        else{
            gameState.visitorsWelcome = false;
            gameState.visitorStatusText.text = "CLOSED to Visitors";
            gameState.click.play();
        }
    });

    // powerup - coffee
    gameState.coffeeCount = 0;
    gameState.coffeeAdder = this.add.sprite(150, 430, "coffee").setScale(0.5).setInteractive({cursor: 'pointer'});
    gameState.coffeeCost = 100;
    gameState.coffeeQuantity = 1;
    gameState.coffeeCountText = this.add.text(150, 480, "0", fontConfigCount).setOrigin(0.5);
    defineTooltip(gameState.coffeeAdder, gameState.coffeeCost, 2, gameState.coffeeCountText, "Provide Coffee for Guests\n(Faster Visitors)");

    let coffeeSchedule = [
        {at: 1000, add: 100, cost: Infinity, tooltip: "Provide Coffee for Guests\n(Faster Visitors)"},
        {at: 250, add: 50, cost: 5000, tooltip: "Provide Coffee for Guests\n(Faster Visitors)"},
        {at: 100, add: 10, cost: 1000, tooltip: "Provide Coffee for Guests\n(Faster Visitors)"},
        {at: 25, add: 5, cost: 500, tooltip: "Provide Coffee for Guests\n(Faster Visitors)"}
    ];
    gameState.coffeeAdder.on("pointerup", function(){
        if(gameState.score >= gameState.coffeeCost){
            gameState.coffeeCount += gameState.coffeeQuantity;
            gameState.score -= gameState.coffeeCost;
            gameState.click.play();
        }

        gameState.coffeeCountText.text = "+" + gameState.coffeeCount + "%";
        gameState.walkSpeed = 0.5 + (gameState.coffeeCount * 0.005);
        // gameState.defaultWait = Math.max(300 - (gameState.coffeeCount/4), 50);

        for(let i in coffeeSchedule){
            if(gameState.coffeeCount >= coffeeSchedule[i].at){
                gameState.coffeeQuantity = coffeeSchedule[i].add;
                gameState.coffeeCost = coffeeSchedule[i].cost;
                defineTooltip(gameState.coffeeAdder, gameState.coffeeCost, 2, gameState.coffeeCountText, coffeeSchedule[i].tooltip);
                break;
            }
        }
    });

    // powerup - ad
    gameState.adCount = 0;
    gameState.adAdder = this.add.sprite(250, 430, "computer").setScale(0.45).setInteractive({cursor: 'pointer'});
    gameState.adCost = 250;
    gameState.adQuantity = 1;
    gameState.adCountText = this.add.text(250, 480, "0", fontConfigCount).setOrigin(0.5);
    defineTooltip(gameState.adAdder, gameState.adCost, 3, gameState.adCountText, "Run Ad Campaign\n(More Visitors)");

    let adSchedule = [
        {at: 1000, add: 100, cost: Infinity, tooltip: "Run Ad Campaign\n(More Visitors)"},
        {at: 250, add: 50, cost: 12500, tooltip: "Run Ad Campaign\n(More Visitors)"},
        {at: 100, add: 10, cost: 2500, tooltip: "Run Ad Campaign\n(More Visitors)"},
        {at: 25, add: 5, cost: 1250, tooltip: "Run Ad Campaign\n(More Visitors)"}
    ];
    gameState.adAdder.on("pointerup", function(){
        if(gameState.score >= gameState.adCost){
            gameState.adCount += gameState.adQuantity;
            gameState.score -= gameState.adCost;
            gameState.click.play();
        }

        gameState.adCountText.text = "+" + gameState.adCount + "%";
        gameState.visitorFrequency = Math.max((3000 - (gameState.adCount*3)), 10);

        for(let i in adSchedule){
            if(gameState.adCount >= adSchedule[i].at){
                gameState.adQuantity = adSchedule[i].add;
                gameState.adCost = adSchedule[i].cost;
                defineTooltip(gameState.adAdder, gameState.adCost, 3, gameState.adCountText, adSchedule[i].tooltip);
                break;
            }
        }
    });
    
    // powerup - meds
    gameState.medsCount = 0;
    gameState.medsAdder = this.add.sprite(350, 430, "meds").setScale(0.5).setInteractive({cursor: 'pointer'});
    gameState.medsCost = 500;
    gameState.medsQuantity = 1;
    gameState.medsCountText = this.add.text(350, 480, "0", fontConfigCount).setOrigin(0.5);
    defineTooltip(gameState.medsAdder, gameState.medsCost, 4, gameState.medsCountText, "Conduct Health Screenings\n(Fewer Zombies)");

    let medsSchedule = [
        {at: 80, add: 1, cost: Infinity, tooltip: "Conduct Health Screenings\n(Fewer Zombies)"},
        {at: 50, add: 1, cost: 25000, tooltip: "Conduct Health Screenings\n(Fewer Zombies)"},
        {at: 25, add: 1, cost: 5000, tooltip: "Conduct Health Screenings\n(Fewer Zombies)"},
        {at: 10, add: 1, cost: 2500, tooltip: "Conduct Health Screenings\n(Fewer Zombies)"}
    ];
    gameState.medsAdder.on("pointerup", function(){
        if(gameState.score >= gameState.medsCost){
            gameState.medsCount += gameState.medsQuantity;
            gameState.score -= gameState.medsCost;
            gameState.click.play();
        }

        gameState.medsCountText.text = "-" + gameState.medsCount + "%";
        gameState.zombieFrequency = Math.max((5 + gameState.medsCount), 5);

        for(let i in medsSchedule){
            if(gameState.medsCount >= medsSchedule[i].at){
                gameState.medsQuantity = medsSchedule[i].add;
                gameState.medsCost = medsSchedule[i].cost;
                defineTooltip(gameState.medsAdder, gameState.medsCost, 4, gameState.medsCountText, medsSchedule[i].tooltip);
                break;
            }
        }
    });

    // hide all powerups by default
    gameState.medsAdder.setActive(false).setAlpha(0);
    gameState.medsCountText.setActive(false).setAlpha(0);
    gameState.adAdder.setActive(false).setAlpha(0);
    gameState.adCountText.setActive(false).setAlpha(0);
    gameState.coffeeAdder.setActive(false).setAlpha(0);
    gameState.coffeeCountText.setActive(false).setAlpha(0);
    gameState.walrusAdder.setActive(false).setAlpha(0);
    gameState.walrusCountText.setActive(false).setAlpha(0);
    gameState.visitorStatusText.setActive(false).setAlpha(0);

    // zombies deactivated by default
    gameState.zombiesEnabled = false;

    // prestige tooltip
    gameState.prestigeTooltip = this.add.text(800, 340, "Lorem Ipsum", fontConfigTooltip).setOrigin(0.5).setAlpha(0);

    // prestige animals
    gameState.prestigeChicken = this.add.sprite(650, 410, "chicken").setScale(0.25).setInteractive({cursor: 'pointer'}).setActive(false).setAlpha(0);
    definePrestige("chicken", "Chicken", "Chickens", gameState.prestigeChicken);

    gameState.prestigeCow = this.add.sprite(710, 410, "cow").setScale(0.25).setInteractive({cursor: 'pointer'}).setActive(false).setAlpha(0);
    definePrestige("cow", "Cow", "Cows", gameState.prestigeCow);

    gameState.prestigeDuck = this.add.sprite(770, 410, "duck").setScale(0.25).setInteractive({cursor: 'pointer'}).setActive(false).setAlpha(0);
    definePrestige("duck", "Duck", "Ducks", gameState.prestigeDuck);

    gameState.prestigeGiraffe = this.add.sprite(830, 410, "giraffe").setScale(0.25).setInteractive({cursor: 'pointer'}).setActive(false).setAlpha(0);
    definePrestige("giraffe", "Giraffe", "Giraffes", gameState.prestigeGiraffe);

    gameState.prestigeGoat = this.add.sprite(890, 410, "goat").setScale(0.25).setInteractive({cursor: 'pointer'}).setActive(false).setAlpha(0);
    definePrestige("goat", "Goat", "Goats", gameState.prestigeGoat);

    gameState.prestigeHorse = this.add.sprite(950, 410, "horse").setScale(0.25).setInteractive({cursor: 'pointer'}).setActive(false).setAlpha(0);
    definePrestige("horse", "Horse", "Horses", gameState.prestigeHorse);

    gameState.prestigeNarwhal = this.add.sprite(650, 460, "narwhal").setScale(0.25).setInteractive({cursor: 'pointer'}).setActive(false).setAlpha(0);
    definePrestige("narwhal", "Narwhal", "Narwhals", gameState.prestigeNarwhal);

    gameState.prestigePanda = this.add.sprite(710, 460, "panda").setScale(0.25).setInteractive({cursor: 'pointer'}).setActive(false).setAlpha(0);
    definePrestige("panda", "Panda", "Pandas", gameState.prestigePanda);

    gameState.prestigePenguin = this.add.sprite(770, 460, "penguin").setScale(0.25).setInteractive({cursor: 'pointer'}).setActive(false).setAlpha(0);
    definePrestige("penguin", "Penguin", "Penguins", gameState.prestigePenguin);

    gameState.prestigePig = this.add.sprite(830, 460, "pig").setScale(0.25).setInteractive({cursor: 'pointer'}).setActive(false).setAlpha(0);
    definePrestige("pig", "Pig", "Pigs", gameState.prestigePig);

    gameState.prestigeRabbit = this.add.sprite(890, 460, "rabbit").setScale(0.25).setInteractive({cursor: 'pointer'}).setActive(false).setAlpha(0);
    definePrestige("rabbit", "Rabbit", "Rabbits", gameState.prestigeRabbit);

    gameState.prestigeWalrus = this.add.sprite(950, 460, "walrus").setScale(0.25).setInteractive({cursor: 'pointer'}).setActive(false).setAlpha(0);
    definePrestige("walrus", "Walrus", "Walruses", gameState.prestigeWalrus);

    

    // create sprite animations
    this.anims.create({
        key: "walk1",
        frameRate: 5,
        frames: this.anims.generateFrameNumbers("visitor1", { frames: [16, 17] }),
        repeat: -1
    });
    this.anims.create({
        key: "walk2",
        frameRate: 5,
        frames: this.anims.generateFrameNumbers("visitor2", { frames: [16, 17] }),
        repeat: -1
    });
    this.anims.create({
        key: "walk3",
        frameRate: 5,
        frames: this.anims.generateFrameNumbers("visitor3", { frames: [16, 17] }),
        repeat: -1
    });
    this.anims.create({
        key: "walk4",
        frameRate: 5,
        frames: this.anims.generateFrameNumbers("visitor4", { frames: [16, 17] }),
        repeat: -1
    });
    this.anims.create({
        key: "walk-zombie",
        frameRate: 5,
        frames: this.anims.generateFrameNumbers("zombie", { frames: [16, 17] }),
        repeat: -1
    });

    // create visitor objects
    gameState.visitorsLeft = [];
    gameState.visitorsRight = [];
    for(i=0; i<=9; i++){
        gameState.visitorsLeft.push(this.add.sprite(-100, 235, "visitor"));
        resetVisitor(gameState.visitorsLeft[i], "left");
        gameState.visitorsRight.push(this.add.sprite(-100, 235, "visitor"));
        resetVisitor(gameState.visitorsRight[i], "right");
    }

    // create zombie objects
    gameState.zombiesLeft = [];
    gameState.zombiesRight = [];
    for(i=0; i<=5; i++){
        gameState.zombiesLeft.push(this.add.sprite(-100, 235, "zombie"));
        resetZombie(gameState.zombiesLeft[i], "left");

        gameState.zombiesRight.push(this.add.sprite(1100, 235, "zombie"));
        resetZombie(gameState.zombiesRight[i], "right");

        gameState.zombiesLeft[i].setInteractive({cursor: 'pointer'});
        gameState.zombiesLeft[i].on("pointerup", function(){
            this.setAlpha(0.8);
            this.setFrame(19);
            gameState.zombieDie.play();
        });

        gameState.zombiesRight[i].setInteractive({cursor: 'pointer'});
        gameState.zombiesRight[i].on("pointerup", function(){
            this.setAlpha(0.8);
            this.setFrame(19);
            this.flipX = true;
            gameState.zombieDie.play();
        });
    }

    // assign default visitor spawn rates
    gameState.walkSpeed = 0.5; //0.5
    gameState.visitorFrequency = 3000; //3000
    gameState.zombieFrequency = 5; //5
    gameState.defaultWait = 100; //100
    gameState.waitLeft = gameState.defaultWait;
    gameState.waitRight = gameState.defaultWait;

    // load game
    loadGame();
}

function update(){
    gameState.scoreText.text = gameState.score;

    // enable prestige
    if(gameState.score >= 1000000 && gameState.prestigeChicken.active == false){
        gameState.prestigeChicken.setActive(true).setAlpha(1);
        gameState.prestigeCow.setActive(true).setAlpha(1);
        gameState.prestigeDuck.setActive(true).setAlpha(1);
        gameState.prestigeGiraffe.setActive(true).setAlpha(1);
        gameState.prestigeGoat.setActive(true).setAlpha(1);
        gameState.prestigeHorse.setActive(true).setAlpha(1);
        gameState.prestigeNarwhal.setActive(true).setAlpha(1);
        gameState.prestigePanda.setActive(true).setAlpha(1);
        gameState.prestigePenguin.setActive(true).setAlpha(1);
        gameState.prestigePig.setActive(true).setAlpha(1);
        gameState.prestigeRabbit.setActive(true).setAlpha(1);
        gameState.prestigeWalrus.setActive(true).setAlpha(1);
        displayAlert("Great job! Keep playing, or\nupgrade to a different animal.");
    }
    // enable meds
    else if(gameState.adCount >= 50 && gameState.medsAdder.active == false){
        gameState.medsAdder.setActive(true).setAlpha(1);
        gameState.medsCountText.setActive(true).setAlpha(1);
        displayAlert("Conduct visitor health screenings\nto prevent zombies from sneaking in.");
    }
    // enable ads
    else if(gameState.coffeeCount >= 50 && gameState.adAdder.active == false){
        gameState.adAdder.setActive(true).setAlpha(1);
        gameState.adCountText.setActive(true).setAlpha(1);
        displayAlert("Run advertising campaigns\nto attract more visitors.");
    }
    // enable zombies
    else if(gameState.coffeeCount >= 10 && gameState.zombiesEnabled == false){
        gameState.zombiesEnabled = true;
        displayAlert("Look out for zombie visitors! Stop\nthem before they eat any " + gameState.animalNamePlural.toLowerCase() + "!");
        gameState.zombiesLeft[0].setActive(true);
        gameState.waitLeft = gameState.defaultWait;
        gameState.zombiesRight[0].setActive(true);
        gameState.waitRight = gameState.defaultWait;
        gameState.zombieGroan.play();
    }
    // enable coffee
    else if(gameState.walrusCount >= 25 && gameState.coffeeAdder.active == false){
        gameState.coffeeAdder.setActive(true).setAlpha(1);
        gameState.coffeeCountText.setActive(true).setAlpha(1);
        displayAlert("Provide coffee for visitors\nto make them walk faster.");
    }
    // enable visitors
    else if(gameState.walrusCount >= 10 && gameState.visitorStatusText.active == false){
        gameState.visitorStatusText.setActive(true).setAlpha(1);
        displayAlert("Welcome visitors by\nopening the petting zoo.");
    }
    // enable walrus adder
    else if(gameState.score >= 20 && gameState.walrusAdder.active == false){
        gameState.walrusAdder.setActive(true).setAlpha(1);
        gameState.walrusCountText.setActive(true).setAlpha(1);
        displayAlert("Add more " + gameState.animalNamePlural.toLowerCase() + " to\nincrease pets per click!");
    }

    // fade out alert text
    if(gameState.alert.alpha > 0){
        gameState.alert.setAlpha(gameState.alert.alpha - 0.0005);
    }

    // subtract from waits
    if (gameState.waitLeft > 0){
        gameState.waitLeft--;
    }
    if (gameState.waitRight > 0){
        gameState.waitRight--;
    }

    // spawn visitors or zombie
    if(gameState.visitorsWelcome == true){
        let r = Phaser.Math.Between(0, gameState.visitorFrequency);
        let z = Phaser.Math.Between(0, gameState.zombieFrequency);
        let s = Phaser.Math.Between(1,2);
        // zombies
        if(gameState.zombiesEnabled && z == 1){
            // left zombie
            if(s == 1){
                if(gameState.zombiesLeft[r] && gameState.waitLeft == 0){
                    gameState.zombiesLeft[r].setActive(true);
                    gameState.waitLeft = gameState.defaultWait;
                    gameState.zombieGroan.play();
                }
            }
            // right zombie
            else{
                if(gameState.zombiesRight[r] && gameState.waitRight == 0){
                    gameState.zombiesRight[r].setActive(true);
                    gameState.waitRight = gameState.defaultWait;
                    gameState.zombieGroan.play();
                }
            }
        }
        // visitors
        else{
            // left visitor
            if(s == 1 && gameState.waitLeft == 0){
                if(gameState.visitorsLeft[r]){
                    gameState.visitorsLeft[r].setActive(true);
                    gameState.waitLeft = gameState.defaultWait;
                }
            }
            // right visitor
            else if(s == 2  && gameState.waitRight == 0){
                if(gameState.visitorsRight[r]){
                    gameState.visitorsRight[r].setActive(true);
                    gameState.waitRight = gameState.defaultWait;
                }
            }  
        }   
    }

    // perform visitorsLeft walk
    for(let i in gameState.visitorsLeft){
        if(gameState.visitorsLeft[i].active == true){
            if(gameState.visitorsLeft[i].x < 400){
                gameState.visitorsLeft[i].x += gameState.walkSpeed;
            }
            if(gameState.visitorsLeft[i].x >= 400){
                gameState.visitorsLeft[i].setFrame(14);
                gameState.visitorsLeft[i].setAlpha(gameState.visitorsLeft[i].alpha - 0.01);
                if(gameState.visitorsLeft[i].alpha <= 0){
                    gameState.score += gameState.walrusCount;
                    resetVisitor(gameState.visitorsLeft[i], "left");
                }
            }
        }
    }
    // perform visitorsRight walk
    for(let i in gameState.visitorsRight){
        if(gameState.visitorsRight[i].active == true){
            if(gameState.visitorsRight[i].x > 600){
                gameState.visitorsRight[i].x -= gameState.walkSpeed;
            }
            if(gameState.visitorsRight[i].x <= 600){
                gameState.visitorsRight[i].setFrame(14);
                gameState.visitorsRight[i].setAlpha(gameState.visitorsRight[i].alpha - 0.01);
                if(gameState.visitorsRight[i].alpha <= 0){
                    gameState.score += gameState.walrusCount;
                    resetVisitor(gameState.visitorsRight[i], "right");
                }
            }
        }
    }
    // perform zombiesLeft walk
    for(let i in gameState.zombiesLeft){
        if(gameState.zombiesLeft[i].active == true){
            if(gameState.zombiesLeft[i].x < 400 && gameState.zombiesLeft[i].alpha == 1){
                gameState.zombiesLeft[i].x += gameState.walkSpeed;
            }
            if(gameState.zombiesLeft[i].x >= 400){
                gameState.zombiesLeft[i].setFrame(7);
                gameState.zombiesLeft[i].setAlpha(gameState.zombiesLeft[i].alpha - 0.01);
                if(gameState.zombiesLeft[i].alpha <= 0){
                    if(gameState.walrusCount > 10){
                        gameState.walrusCount -= Phaser.Math.Between(1, (gameState.walrusCount-10));
                        gameState.zombieEat.play();
                    }
                    gameState.walrusCountText.text = "x" + gameState.walrusCount;
                    resetZombie(gameState.zombiesLeft[i], "left");
                }
            }
            else if(gameState.zombiesLeft[i].alpha < 1){
                gameState.zombiesLeft[i].setFrame(19);
                gameState.zombiesLeft[i].setAlpha(gameState.zombiesLeft[i].alpha - 0.01);
                if(gameState.zombiesLeft[i].alpha <= 0){
                    resetZombie(gameState.zombiesLeft[i], "left");
                }
            }
        }
    }
    // perform zombiesRight walk
    for(let i in gameState.zombiesRight){
        if(gameState.zombiesRight[i].active == true){
            if(gameState.zombiesRight[i].x > 600 && gameState.zombiesRight[i].alpha == 1){
                gameState.zombiesRight[i].x -= gameState.walkSpeed;
            }
            if(gameState.zombiesRight[i].x <= 600){
                gameState.zombiesRight[i].setFrame(7);
                gameState.zombiesRight[i].setAlpha(gameState.zombiesRight[i].alpha - 0.01);
                if(gameState.zombiesRight[i].alpha <= 0){
                    if(gameState.walrusCount > 10){
                        gameState.walrusCount -= Phaser.Math.Between(1, (gameState.walrusCount-10));
                        gameState.zombieEat.play();
                    }
                    gameState.walrusCountText.text = "x" + gameState.walrusCount;
                    resetZombie(gameState.zombiesRight[i], "right");
                }
            }
            else if(gameState.zombiesRight[i].alpha < 1){
                gameState.zombiesRight[i].setFrame(19);
                gameState.zombiesRight[i].setAlpha(gameState.zombiesRight[i].alpha - 0.01);
                if(gameState.zombiesRight[i].alpha <= 0){
                    resetZombie(gameState.zombiesRight[i], "right");
                }
            }
        }
    }
}

// reset visitor
function resetVisitor(visitor, side){
    visitor.setActive(false);
    visitor.setAlpha(1);

    let character = Phaser.Math.Between(1, 4);
    if(character == 1){
        visitor.play("walk1");
    }
    if(character == 2){
        visitor.play("walk2");
    }
    if(character == 3){
        visitor.play("walk3");
    }
    if(character == 4){
        visitor.play("walk4");
    }

    if(side == "left"){
        visitor.x = -100;
    }
    if(side == "right"){
        visitor.x = 1100;
        visitor.flipX = true;
    }
}

// reset zombie
function resetZombie(zombie, side){
    zombie.setActive(false);
    zombie.setAlpha(1);
    zombie.play("walk-zombie");
    if(side == "left"){
        zombie.x = -100;
    }
    if(side == "right"){
        zombie.x = 1100;
        zombie.flipX = true;
    }
}

// define powerup tooltip
function defineTooltip(powerup, cost, position, hide, tooltip){
    powerup.on("pointerover", function(){
        hide.setAlpha(0);
        gameState.powerupTooltip.text = tooltip;
        gameState.powerupTooltip.setAlpha(1);
        gameState.costTooltip.text = "(-" + cost + ")";
        gameState.costTooltip.x = (100 * position) - 50;
        gameState.costTooltip.setAlpha(1);
        if(cost == Infinity){
            gameState.costTooltip.text = "(MAX)";
        }
    });
    powerup.on("pointerup", function(){
        gameState.powerupTooltip.text = tooltip;
        gameState.costTooltip.text = "(-" + cost + ")";
        if(cost == Infinity){
            gameState.costTooltip.text = "(MAX)";
        }
    });
    powerup.on("pointerout", function(){
        gameState.powerupTooltip.setAlpha(0);
        gameState.costTooltip.setAlpha(0);
        hide.setAlpha(1);
    });
}

// define prestige
function definePrestige(animal, singular, plural, prestige){
    prestige.on("pointerover", function(){
        gameState.prestigeTooltip.text = "Reset Game:\n" + animal.charAt(0).toUpperCase()
        + animal.slice(1) + " Petting Zoo";
        gameState.prestigeTooltip.setAlpha(1);
    });
    prestige.on("pointerup", function(){
        gameState.click.play();
        resetGame(animal, singular, plural);
    });
    prestige.on("pointerout", function(){
        gameState.prestigeTooltip.setAlpha(0);
    });
}

// display alert
function displayAlert(message){
    gameState.alert.alpha = 0;
    gameState.alert.text = message;
    gameState.alert.alpha = 1;
    gameState.pop.play();
}

// reset game for prestige
function resetGame(animal, singular, plural){
    gameState.animalName = singular;
    gameState.animalNamePlural = plural;
    gameState.walrus.setTexture(animal);
    gameState.walrusAdder.setTexture(animal);

    gameState.score = 0;
    gameState.walrusCount = 1;
    gameState.walrusCost = 10;
    gameState.walrusQuantity = 1;
    gameState.adCost = 250;
    gameState.adCount = 0;
    gameState.adQuantity = 1;
    gameState.coffeeCost = 100;
    gameState.coffeeCount = 0;
    gameState.coffeeQuantity = 1;
    gameState.medsCost = 500;
    gameState.medsCount = 0;
    gameState.medsQuantity = 1;
    gameState.walkSpeed = 0.5;
    gameState.visitorFrequency = 3000;
    gameState.zombieFrequency = 5;
    gameState.defaultWait = 100;
    gameState.waitLeft = gameState.defaultWait;
    gameState.waitRight = gameState.defaultWait;
    gameState.visitorsWelcome = false;
    gameState.zombiesEnabled = false;

    gameState.prestigeChicken.setActive(false).setAlpha(0);
    gameState.prestigeCow.setActive(false).setAlpha(0);
    gameState.prestigeDuck.setActive(false).setAlpha(0);
    gameState.prestigeGiraffe.setActive(false).setAlpha(0);
    gameState.prestigeGoat.setActive(false).setAlpha(0);
    gameState.prestigeHorse.setActive(false).setAlpha(0);
    gameState.prestigeNarwhal.setActive(false).setAlpha(0);
    gameState.prestigePanda.setActive(false).setAlpha(0);
    gameState.prestigePenguin.setActive(false).setAlpha(0);
    gameState.prestigePig.setActive(false).setAlpha(0);
    gameState.prestigeRabbit.setActive(false).setAlpha(0);
    gameState.prestigeWalrus.setActive(false).setAlpha(0);

    gameState.medsAdder.setActive(false).setAlpha(0);
    gameState.medsCountText.setActive(false).setAlpha(0);
    gameState.adAdder.setActive(false).setAlpha(0);
    gameState.adCountText.setActive(false).setAlpha(0);
    gameState.coffeeAdder.setActive(false).setAlpha(0);
    gameState.coffeeCountText.setActive(false).setAlpha(0);
    gameState.visitorStatusText.setActive(false).setAlpha(0);

    gameState.walrusAdder.setActive(false).setAlpha(0);
    gameState.walrusCountText.setActive(false).setAlpha(0);

    for(i=0; i<=9; i++){
        resetVisitor(gameState.visitorsLeft[i], "left");
        resetVisitor(gameState.visitorsRight[i], "right");
    }

    for(i=0; i<=5; i++){
        resetZombie(gameState.zombiesLeft[i], "left");
        resetZombie(gameState.zombiesRight[i], "right");
    }

    defineTooltip(gameState.walrusAdder, gameState.walrusCost, 1, gameState.walrusCountText, "Add " + gameState.animalName + "\n(Pet Multiplier)");
    defineTooltip(gameState.coffeeAdder, gameState.coffeeCost, 2, gameState.coffeeCountText, "Provide Coffee for Guests\n(Faster Visitors)");
    defineTooltip(gameState.adAdder, gameState.adCost, 3, gameState.adCountText, "Run Ad Campaign\n(More Visitors)");
    defineTooltip(gameState.medsAdder, gameState.medsCost, 4, gameState.medsCountText, "Conduct Health Screenings\n(Fewer Zombies)");

    gameState.walrusCountText.text = "x1";
    gameState.coffeeCountText.text = "0";
    gameState.adCountText.text = "0";
    gameState.medsCountText.text = "0";
    gameState.visitorStatusText.text = "CLOSED to Visitors";

    document.getElementById("game-title").innerHTML = gameState.animalName + " Petting Zoo";
    displayAlert("Game has been reset!");
}

// load game
function loadGame(){
    if(localStorage.getItem('gameData')){
        console.log("LOADING:");
        console.log(localStorage.getItem('gameData'));
        let loaded = JSON.parse(localStorage.getItem('gameData'));
        
        gameState.animalName = loaded.animalName;
        gameState.animalNamePlural = loaded.animalNamePlural;
        gameState.walrus.setTexture(loaded.animalName.toLowerCase());
        gameState.walrusAdder.setTexture(loaded.animalName.toLowerCase());

        gameState.score = loaded.score;
        gameState.walrusCount = loaded.walrusCount;
        gameState.walrusCost = loaded.walrusCost;
        gameState.walrusQuantity = loaded.walrusQuantity;
        gameState.adCost = loaded.adCost;
        gameState.adCount = loaded.adCount;
        gameState.adQuantity = loaded.adQuantity;
        gameState.coffeeCost = loaded.coffeeCost;
        gameState.coffeeCount = loaded.coffeeCount;
        gameState.coffeeQuantity = loaded.coffeeQuantity;
        gameState.medsCost = loaded.medsCost;
        gameState.medsCount = loaded.medsCount;
        gameState.medsQuantity = loaded.medsQuantity;
        gameState.walkSpeed = loaded.walkSpeed;
        gameState.visitorFrequency = loaded.visitorFrequency;
        gameState.zombieFrequency = loaded.zombieFrequency;
        gameState.defaultWait = loaded.defaultWait;
        gameState.waitLeft = loaded.waitLeft;
        gameState.waitRight = loaded.waitRight;
        gameState.zombiesEnabled = loaded.zombiesEnabled;
        gameState.walrusCountText.text = loaded.walrusCountText;
        gameState.coffeeCountText.text = loaded.coffeeCountText;
        gameState.adCountText.text = loaded.adCountText;
        gameState.medsCountText.text = loaded.medsCountText;

        gameState.visitorsWelcome = false;
        gameState.visitorStatusText.text = "CLOSED to Visitors";



        defineTooltip(gameState.walrusAdder, gameState.walrusCost, 1, gameState.walrusCountText, "Add " + gameState.animalName + "\n(Pet Multiplier)");
        let walrusSchedule = [
            {at: 1000, add: 100, cost: 1000, tooltip: "Add 100 " + gameState.animalNamePlural + "\n(Pet Multiplier)"},
            {at: 250, add: 50, cost: 500, tooltip: "Add 50 " + gameState.animalNamePlural + "\n(Pet Multiplier)"},
            {at: 100, add: 10, cost: 100, tooltip: "Add 10 " + gameState.animalNamePlural + "\n(Pet Multiplier)"},
            {at: 25, add: 5, cost: 50, tooltip: "Add 5 " + gameState.animalNamePlural + "\n(Pet Multiplier)"}
        ];
        for(let i in walrusSchedule){
            if(gameState.walrusCount >= walrusSchedule[i].at){
                gameState.walrusQuantity = walrusSchedule[i].add;
                gameState.walrusCost = walrusSchedule[i].cost;
                defineTooltip(gameState.walrusAdder, gameState.walrusCost, 1, gameState.walrusCountText, walrusSchedule[i].tooltip);
                break;
            }
        }
        defineTooltip(gameState.coffeeAdder, gameState.coffeeCost, 2, gameState.coffeeCountText, "Provide Coffee for Guests\n(Faster Visitors)");
        defineTooltip(gameState.adAdder, gameState.adCost, 3, gameState.adCountText, "Run Ad Campaign\n(More Visitors)");
        defineTooltip(gameState.medsAdder, gameState.medsCost, 4, gameState.medsCountText, "Conduct Health Screenings\n(Fewer Zombies)");

        if(gameState.score >= 1000000 && gameState.prestigeChicken.active == false){
            gameState.prestigeChicken.setActive(true).setAlpha(1);
            gameState.prestigeCow.setActive(true).setAlpha(1);
            gameState.prestigeDuck.setActive(true).setAlpha(1);
            gameState.prestigeGiraffe.setActive(true).setAlpha(1);
            gameState.prestigeGoat.setActive(true).setAlpha(1);
            gameState.prestigeHorse.setActive(true).setAlpha(1);
            gameState.prestigeNarwhal.setActive(true).setAlpha(1);
            gameState.prestigePanda.setActive(true).setAlpha(1);
            gameState.prestigePenguin.setActive(true).setAlpha(1);
            gameState.prestigePig.setActive(true).setAlpha(1);
            gameState.prestigeRabbit.setActive(true).setAlpha(1);
            gameState.prestigeWalrus.setActive(true).setAlpha(1);
        }
        if(gameState.adCount >= 50 && gameState.medsAdder.active == false){
            gameState.medsAdder.setActive(true).setAlpha(1);
            gameState.medsCountText.setActive(true).setAlpha(1);
        }
        if(gameState.coffeeCount >= 50 && gameState.adAdder.active == false){
            gameState.adAdder.setActive(true).setAlpha(1);
            gameState.adCountText.setActive(true).setAlpha(1);
        }
        if(gameState.coffeeCount >= 10 && gameState.zombiesEnabled == false){
            gameState.zombiesEnabled = true;
            gameState.zombiesLeft[0].setActive(true);
            gameState.waitLeft = gameState.defaultWait;
            gameState.zombiesRight[0].setActive(true);
            gameState.waitRight = gameState.defaultWait;
            gameState.zombieGroan.play();
        }
        if(gameState.walrusCount >= 25 && gameState.coffeeAdder.active == false){
            gameState.coffeeAdder.setActive(true).setAlpha(1);
            gameState.coffeeCountText.setActive(true).setAlpha(1);
        }
        if(gameState.walrusCount >= 10 && gameState.visitorStatusText.active == false){
            gameState.visitorStatusText.setActive(true).setAlpha(1);
        }
        if(gameState.score >= 20 && gameState.walrusAdder.active == false){
            gameState.walrusAdder.setActive(true).setAlpha(1);
            gameState.walrusCountText.setActive(true).setAlpha(1);
        }

        displayAlert("Loaded previous game!");
    }
}

// save game
function saveGame(){
    let toSave = {
        score: gameState.score,
        animalName: gameState.animalName,
        animalNamePlural: gameState.animalNamePlural,
        walrusCount: gameState.walrusCount,
        walrusCost: gameState.walrusCost,
        walrusQuantity: gameState.walrusQuantity,
        adCost: gameState.adCost,
        adCount: gameState.adCount,
        adQuantity: gameState.adQuantity,
        coffeeCost: gameState.coffeeCost,
        coffeeCount: gameState.coffeeCount,
        coffeeQuantity: gameState.coffeeQuantity,
        medsCost: gameState.medsCost,
        medsCount: gameState.medsCount,
        medsQuantity: gameState.medsQuantity,
        walkSpeed: gameState.walkSpeed,
        visitorFrequency: gameState.visitorFrequency,
        zombieFrequency: gameState.zombieFrequency,
        defaultWait: gameState.defaultWait,
        waitLeft: gameState.waitLeft,
        waitRight: gameState.waitRight,
        visitorsWelcome: gameState.visitorsWelcome,
        zombiesEnabled: gameState.zombiesEnabled,
        walrusCountText: gameState.walrusCountText.text,
        coffeeCountText: gameState.coffeeCountText.text,
        adCountText: gameState.adCountText.text,
        medsCountText: gameState.medsCountText.text,
        visitorStatusText: gameState.visitorStatusText.text
    };
    console.log("SAVING:");
    console.log(toSave);
    localStorage.setItem('gameData', JSON.stringify(toSave));
}