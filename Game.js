
BasicGame.Game = function (game) {

};

BasicGame.Game.prototype = {

	create: function () {
        
        this.toggle = true;
        this.level = 4;

        this.shapes = [];
        this.solution = [];
        this.shapeindex = 0;

        this.shape1 = null;
        this.shape2 = null;

        this.placeBoxes('4x2');

        this.totaltime = 0;
        this.totalclicks = 0;


        this.music = this.add.audio('music',1,true);
        if(playmusic==true){
            this.music.play('',0,1,true);
        }

        this.blipsound = this.add.audio('blip');

        this.timetext = this.add.bitmapText(this.world.centerX,10,'font','0',30);
        this.timetext.x = this.world.centerX - this.timetext.textWidth/2;
        this.time.events.loop(Phaser.Timer.SECOND, this.updateScore, this);

        this.backButton = this.add.button(10, this.world.height - 5, 'back', this.startGame, this, 1,0,2);
        this.backButton.scale.setTo(0.4,0.4);
        this.backButton.anchor.setTo(0,1);

        this.musicButton = this.add.button(this.world.width-10, this.world.height - 5, 'musicbutton', this.changemusic, this, 1,0,2);
        this.musicButton.scale.setTo(0.4,0.4);
        this.musicButton.anchor.setTo(1,1);
	},

    changemusic : function(){
        if(playmusic==true){
            this.music.stop();
            playmusic = false;
        }
        else{
            this.music.play();
            playmusic = true;
        }
    },

    startGame: function (pointer) {

        this.music.stop();

        this.state.start('MainMenu');

    },

    updateScore : function(){
        this.totaltime++;
        this.timetext.setText(this.totaltime.toString());
        this.timetext.x = this.world.centerX - this.timetext.textWidth/2;
    },

    nextLevel : function(){
        this.time.events.add(Phaser.Timer.SECOND, function(){
            this.str = (this.level+1)+'x2';
            if(this.level==6){
                score = this.totaltime;
                clicks = this.totalclicks;
                this.music.stop();
                this.state.start('EndScreen');
            }
            this.toggle = true;

            this.shapeindex = 0;

            for(var i=0;i<this.shapes.length;i++){
                this.shapes[i].destroy();
            }

            this.shape1 = null;
            this.shape2 = null;

            this.placeBoxes(this.str);

            this.level +=1;
        }, this);
        
    },

	update: function () {


	},

    openShape : function(a){
        // console.log(a.no);
        this.blipsound.play();
        this.totalclicks++;
        var win = false;
        var out_tween = this.add.tween(a).to({alpha:0}, 100, Phaser.Easing.Sinusoidal.Out, true);
        var in_tween = function(){
            a.frameName = 'shape'+this.solution[a.no]+'.png';
            this.add.tween(a).to({alpha:1}, 10, Phaser.Easing.Sinusoidal.In, true);
            if(this.toggle){
                this.shape1 = a;
                this.toggle = false;
                this.shape1.inputEnabled = false;
            }
            else{
                this.shape2 = a;
                // if(this.shape1==this.shape2){
                //     this.shape1.frameName = 'covershape.png';
                //     this.shape1.inputEnabled = true;
                // }
                // else{
                    if(this.shape1.frameName!=this.shape2.frameName){
                        var temp_tween1 = this.add.tween(this.shape1).to({alpha:0}, 100, Phaser.Easing.Sinusoidal.Out, true);
                        var temp_tween2 = this.add.tween(this.shape2).to({alpha:0}, 100, Phaser.Easing.Sinusoidal.Out, true);
                        temp_tween2.onComplete.add(function(){
                            this.shape1.frameName = 'covershape.png';
                            this.shape2.frameName = 'covershape.png';
                            this.add.tween(this.shape1).to({alpha:1}, 100, Phaser.Easing.Sinusoidal.Out, true);
                            this.add.tween(this.shape2).to({alpha:1}, 100, Phaser.Easing.Sinusoidal.Out, true);
                            this.shape1.inputEnabled = true;
                        },this);
                    }
                    else{
                        win = true;
                        this.shape1.inputEnabled = false;
                        this.shape2.inputEnabled = false;
                        this.solution[this.shape1.no] = -1;
                        this.solution[this.shape2.no] = -1;
                        for(var i=0;i<this.solution.length;i++){
                            if(this.solution[i]!=-1){
                                win = false;
                                break;
                            }
                        }
                        if(win==true){
                            this.nextLevel();
                        }
                    }
                // }
                this.toggle = true;
            }

        }
        out_tween.onComplete.add(in_tween,this);
        
    },

    placeBoxes : function(type){
        this.shapes.length = 0;
        this.shapeindex = 0;
        this.solution.length = 0;

        switch(type){
            case '2x2'  :   for(var i=0;i<2;i++){
                                for(var j=0;j<2;j++){
                                    this.shapes[this.shapeindex] = this.add.sprite(this.world.centerX-60+120*j,this.world.centerY-60+120*i,'spriteset');
                                    this.shapes[this.shapeindex].frameName = 'covershape.png';
                                    this.shapes[this.shapeindex].anchor.setTo(0.5,0.5);
                                    this.shapeindex++;
                                }
                            }
                            break;
            case '3x2'  :   for(var i=0;i<2;i++){
                                for(var j=0;j<3;j++){
                                    this.shapes[this.shapeindex] = this.add.sprite(this.world.centerX-120+120*j,this.world.centerY-60+120*i,'spriteset');
                                    this.shapes[this.shapeindex].frameName = 'covershape.png';
                                    this.shapes[this.shapeindex].anchor.setTo(0.5,0.5);
                                    this.shapeindex++;
                                }
                            }
                            break;
            case '4x2'  :   for(var i=0;i<4;i++){
                                for(var j=0;j<2;j++){
                                    this.shapes[this.shapeindex] = this.add.sprite(this.world.centerX-60+120*j,this.world.centerY-190+120*i,'spriteset');
                                    this.shapes[this.shapeindex].frameName = 'covershape.png';
                                    this.shapes[this.shapeindex].anchor.setTo(0.5,0.5);
                                    this.shapeindex++;
                                }
                            }
                            break;
            case '5x2'  :   for(var i=0;i<3;i++){
                                for(var j=0;j<3;j++){
                                    this.shapes[this.shapeindex] = this.add.sprite(this.world.centerX-120+120*j,this.world.centerY-190+120*i,'spriteset');
                                    this.shapes[this.shapeindex].frameName = 'covershape.png';
                                    this.shapes[this.shapeindex].anchor.setTo(0.5,0.5);
                                    this.shapeindex++;
                                }
                            }
                            this.shapes[this.shapeindex] = this.add.sprite(this.world.centerX,this.world.centerY+170,'spriteset');
                            this.shapes[this.shapeindex].frameName = 'covershape.png';
                            this.shapes[this.shapeindex].anchor.setTo(0.5,0.5);
                            this.shapeindex++;
                            break;
            case '6x2'  :   for(var i=0;i<4;i++){
                                for(var j=0;j<3;j++){
                                    this.shapes[this.shapeindex] = this.add.sprite(this.world.centerX-120+120*j,this.world.centerY-190+120*i,'spriteset');
                                    this.shapes[this.shapeindex].frameName = 'covershape.png';
                                    this.shapes[this.shapeindex].anchor.setTo(0.5,0.5);
                                    this.shapeindex++;
                                }
                            }
                            break;
            default     :   break;
        }
        for(var i=0;i<this.shapes.length;i++){
            this.shapes[i].frameName = 'covershape.png';
            // this.shapes[i].scale.setTo(0.5,0.5);
            this.shapes[i].anchor.setTo(0.5,0.5);
            this.shapes[i].no = i;
            this.shapes[i].inputEnabled = true;
            this.shapes[i].events.onInputDown.add(this.openShape, this);

            this.shapes[i].alpha = 0;
            this.add.tween(this.shapes[i]).to({alpha:1}, 1000, Phaser.Easing.Sinusoidal.Out, true);
        }
        for(var i=0;i<this.shapes.length;i=i+2){
            this.solution[i] = i/2+1;
            this.solution[i+1] = i/2+1;
        }
        this.math.shuffleArray(this.solution);
        console.log(this.solution);
    }
};
