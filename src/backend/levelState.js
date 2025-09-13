class LevelContext {
    constructor(state = new BeginnerState(0)){
        this.state = state;
    }

    getLevel(){
        return this.state.level;
    }
}

class LevelState {
    incScoreBy(score){
        if (score <= 0){
            return;
        }
        this.score += score;
        if (this.score >= 100) {
            return this.next();
        }
        return this;
    }

    next(){
        throw new Error('Not implemented by parent class');
    }
}

class BeginnerState extends LevelState {
    constructor(score) {
        super();
        this.level = 'Beginner';
        this.score = score;
    }

    next(){
        return new IntermediateState(this.score - 100);
    }
}

class IntermediateState extends LevelState {
    constructor(score) {
        super();
        this.level = 'Intermediate';
        this.score = score;
    }

    next(){
        return new AdvancedState(this.score - 100);
    }
}

class AdvancedState extends LevelState {
    constructor(score) {
        super();
        this.level = 'Intermediate';
        this.score = score;
    }

    next(){
        return new AdvancedState(this.score - 100);
    }
}