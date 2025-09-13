class LevelContext {
    constructor(state = new BeginnerState(0)){
        this.state = state;
    }

    getLevel(){
        return this.state.level;
    }

    incScoreBy(score){
        this.state = this.state.incScoreBy(score);
        return this.state;
    }

    getScore(){
        return this.state.score;
    }

}

class LevelState {
    constructor(level, score){
        this.level = level;
        this.score = score;
    }

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
        super('Beginner', score);
    }

    next(){
        return new IntermediateState(this.score - 100);
    }
}

class IntermediateState extends LevelState {
    constructor(score) {
        super('Intermediate', score);
    }

    next(){
        return new AdvancedState(this.score - 100);
    }
}

class AdvancedState extends LevelState {
    constructor(score) {
        super('Advanced', score);
    }

    next(){
        return new AdvancedState(this.score - 100);
    }
}

module.exports = {
    LevelState,
    BeginnerState,
    IntermediateState,
    AdvancedState,
    LevelContext
};