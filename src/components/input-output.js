import Simulator from "./simulator";
class InputOutput {
    constructor() {
        this.delay = 1500;
    }

    addEvents(){
        document.getElementById("shape").addEventListener('change',() => {
            const shape = document.getElementById("shape").value
            if (shape === "") {
                document.getElementById("rectangleConfig").style.display = "none";
                document.getElementById("polygonConfig").style.display = "none";
                document.getElementById("dimension").value = '';
                document.getElementById("dimensions").value = '';
                document.getElementById("polygonConfig-message").innerHTML = '';
                document.getElementById("rectangleConfig-message").innerHTML = '';

            }
            if (shape === "rectangle") {
                document.getElementById("rectangleConfig").style.display = "block";
                document.getElementById("dimensions").value = '';
                document.getElementById("polygonConfig-message").innerHTML = '';
                document.getElementById("polygonConfig").style.display = "none";
            }
            if (shape === "polygon") {
                document.getElementById("rectangleConfig").style.display = "none";
                document.getElementById("dimension").value = '';
                document.getElementById("rectangleConfig-message").innerHTML = '';
                document.getElementById("polygonConfig").style.display = "block";
            }
        });

        document.getElementById("dimension").addEventListener('keyup',
            this.lessStress( () => {
                this.validateRectangleInput()
            }, this.delay));

        document.getElementById("dimensions").addEventListener('keyup',
            this.lessStress( () => {
                this.validatePolygonInput()
            }, this.delay));

        document.getElementById("startPoint").addEventListener('keyup',
            this.lessStress( () => {
                this.validatePoint()
            }, this.delay));

        document.getElementById("commandQuery").addEventListener('keyup',
            this.lessStress( () => {
                this.validateCommandQuery()
            }, this.delay));

        document.getElementById("start").addEventListener('click',() => {
            this.startSimulate()
        });
    }

    startSimulate() {
        if ( (this.validateRectangleInput() || this.validatePolygonInput()) &&
            this.validatePoint() && this.validateCommandQuery() )
        {

            const simulator = new Simulator();
            const startPointCoordinates = document.getElementById("startPoint").value.split(',').map(item => parseInt(item));
            const startPoint = { x : startPointCoordinates[0], y : startPointCoordinates[1], direction : 'north'}
            simulator.initiatePoint( startPoint );

            if (document.getElementById("shape").value === "rectangle") {
                const dimension = document.getElementById("dimension").value.split(',').map(item => parseInt(item));
                simulator.initiatePlayground("rectangle", [{x: dimension[0], y: dimension[1]}]);
            }else{
                //
            }
            const commandQuery = document.getElementById("commandQuery").value;
            const commands_array = commandQuery.split(',').map(item => parseInt(item));
            console.log(simulator.simulateMotion(commands_array))
        }
        else {
            this.showSpanMessage("result","Error: check the inputs!","red");
            return;
        }
        document.querySelector('.message').innerHTML = ''
    }

    validateRectangleInput(){
        const input = document.getElementById("dimension").value.trim();
        if (!this.validateIntegerPair(input)) {
            this.showSpanMessage("rectangleConfig-message",`Error: The width and height should 
                be positive integers separated by a comma (,)`, 'red');
            return false
            }
        this.showSpanMessage("rectangleConfig-message",`✓`,'green');
        return true;

    }

    validatePolygonInput(){
        const input = document.getElementById("dimensions").value.trim();
        let error_flag = false;
        const vertices = input.split('-').map(item => { if (!this.validateIntegerPair(item)) error_flag = true; });
        if (vertices.length<2) {
            this.showSpanMessage("polygonConfig-message",`Error: At least three consecutive vertices is required separated by (-)`,'red');
            return false;
        }
        if (error_flag) {
            this.showSpanMessage("polygonConfig-message",`Error: the vertices format is not valid (-)`,'red');
            return false;
        }
        this.showSpanMessage("polygonConfig-message",`✓`,'green');
        return true;

    }

    validatePoint(){
        const input = document.getElementById("startPoint").value.trim();
        let error_flag = false;
        const parts = input.split(',').map(item => {
            if (!this.isInt(item)) error_flag = true;
            else if (item < 0) error_flag = true;
            return parseInt(item,10) });
        if ( (parts.length!==2) || error_flag ) {
            this.showSpanMessage("startPointConfig-message",`Error: The x,y should 
                be non-negative integers separated by a comma (,)`, 'red');
            document.getElementById("commandConfig").style.display = "none";
            return false
        }
        this.showSpanMessage("startPointConfig-message",`✓`,'green');
        document.getElementById("commandConfig").style.display = "block";
        return true;
    }

    validateIntegerPair(string){
        let error_flag = false;
        const parts = string.split(',').map(item => {
            if (!this.isInt(item)) error_flag = true;
            else if (item <= 0) error_flag = true;
            return parseInt(item,10) });
        if ( (parts.length!==2) || error_flag ) return false;
        return true;
    }

    validateCommandQuery(){
        const input = document.getElementById("commandQuery").value.trim();
        const simulator = new Simulator();
        const commandsValidation = simulator.commandQueryValidate(input);
        if (commandsValidation.validate === false) {
            this.showSpanMessage("commandConfig-message", commandsValidation.message,'red');
            return false;
        }
        this.showSpanMessage("commandConfig-message",`✓`,'green');
        return true;
    }

    lessStress(fn, milliSeconds){
        let timer = 0;
        return function(...args) {
            clearTimeout(timer)
            timer =  setTimeout( fn.bind(this, ...args), milliSeconds || 0)
        }
    }

    isInt(value) {
        return !isNaN(value) &&
            parseInt(Number(value)) == value &&
            !isNaN(parseInt(value, 10));
    }

    showSpanMessage(elementId,message, color){
        console.log(elementId)
        document.getElementById(elementId).innerHTM = `<span style="color:${color}">${message}</span>`;
    }
}

export default InputOutput
