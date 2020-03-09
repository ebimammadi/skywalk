import Simulator from "./simulator";

/**
 * this InputOutput class handles the html input and validation and output to html element
 */
class InputOutput {
    constructor() {
        this.delay = 1500; //this is the delay per milliseconds for validation of html input
    }

    /**
     * This functions adds the required events to the html elements
     */
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
            this.forceDelay( () => {
                this.validateRectangleInput()
            }, this.delay));

        document.getElementById("dimensions").addEventListener('keyup',
            this.forceDelay( () => {
                this.validatePolygonInput()
            }, this.delay));

        document.getElementById("startPoint").addEventListener('keyup',
            this.forceDelay( () => {
                this.validateStartPoint()
            }, this.delay));

        document.getElementById("commandQuery").addEventListener('keyup',
            this.forceDelay( () => {
                this.validateCommandQuery()
            }, this.delay));

        document.getElementById("start").addEventListener('click',() => {
            this.startSimulate()
        });
    }

    /**
     * This is where the simulation starts after validation of the input,
     * It don't start unless it receives a quit command at the end, therefore it handles quit at the end
     */
    startSimulate() {
        if ( (this.validateRectangleInput()  || this.validatePolygonInput() ) &&
            this.validateStartPoint() && this.validateCommandQuery() )
        {
            const simulator = new Simulator();
            const shape = this.createVertices();
            simulator.initiatePoint( this.createStartPoint() );
            simulator.initiatePlayground( shape.shape, shape.dimensions );

            const simulationResult = simulator.simulateMotion(this.createCommandsQuery() );
            this.showSpanMessage(
                "results",
                `${simulationResult.message} coordinates = [${simulationResult.coordinates.x},${simulationResult.coordinates.y}]`,
                simulationResult.messageColor
            );
        }
        else {
            this.showSpanMessage("results","Simulation cannot be started! check the inputs","red");
        }

    }

    /**
     * This functions creates the starting point of the object on the playground,
     * @return {Point} includes the coordinates and default direction 'north'
     */
    createStartPoint(){
        const startPointCoordinates = document.getElementById("startPoint").value.split(',').map(item => parseInt(item));
        return { coordinates: { x : startPointCoordinates[0], y : startPointCoordinates[1] }, direction : 'north'}
    }

    /**
     * This functions creates the vertices of the shape,
     * two shapes are accepted 'rectangle' and 'polygon'
     * the polygon should be a simple polygon and it should receive consecutive vertices per consecutive edges
     * @return the shape and its vertices
     */
    createVertices(){
        if (document.getElementById("shape").value === "rectangle") {
            const dimension = document.getElementById("dimension").value.split(',').map(item => parseInt(item));
            return {
                shape: "rectangle",
                dimensions: [{x: dimension[0], y: dimension[1]}]
            }
        }else{
            const dimensions = document.getElementById("dimensions").value.split('-').map(item => {
                item.trim();
                let coordinates = item.split(',');
                coordinates = coordinates.map(item => {
                   item = item.trim()
                   item = parseInt(item);
                   return item;
                });
                return {
                    x: coordinates[0],
                    y: coordinates[1]
                }
            });
            return {
                shape: "polygon",
                dimensions
            }
        }
    }

    /**
     * This functions creates the commands array,
     * @return {Array} this is the command array of numbers, however it is possible to convert the commands to objects with more than one property
     */
    createCommandsQuery(){
        const commandQuery = document.getElementById("commandQuery").value;
        return commandQuery.split(',').map(item => parseInt(item));
    }

    /**
     * This functions validates the rectangle width and height of the rectangle
     * @return {Boolean} returns true or false and shows relevant message to the HTML element
     */
    validateRectangleInput(){
        const shape = document.getElementById("shape").value;
        if (shape!=='rectangle') {
            //this.showSpanMessage("rectangleConfig-message",`First select rectangle!`, 'red');
            return false
        }
        const inputValue = document.getElementById("dimension").value.trim();
        if (!this.validateIntegerPair(inputValue)) {
            this.showSpanMessage("rectangleConfig-message",`Error: The width and height should 
                be positive integers separated by a comma (,)`, 'red');
            return false
            }
        this.showSpanMessage("rectangleConfig-message",`✓`,'green');
        return true;

    }

    /**
     * This functions validates the polygon width and height of the rectangle
     * Note: the polygon should be a simple polygon and it should receive consecutive vertices per consecutive edges!
     * @return {Boolean} returns true or false and shows relevant message to the HTML element
     */
    validatePolygonInput(){
        const shape = document.getElementById("shape").value;
        if (shape!=='polygon') {
            //this.showSpanMessage("polygonConfig-message",`First select polygon!`, 'red');
            return false
        }
        const inputValue = document.getElementById("dimensions").value.trim();
        let error_flag = false;
        const vertices = inputValue.split('-').map(item => { if (!this.validateIntegerPair(item,false)) error_flag = true; });
        if (vertices.length<3) {
            this.showSpanMessage("polygonConfig-message",`Error: At least three consecutive vertices is required separated by (-)`,'red');
            return false;
        }
        if (error_flag) {
            this.showSpanMessage("polygonConfig-message",`Error: the vertices format is not valid.`,'red');
            return false;
        }
        this.showSpanMessage("polygonConfig-message",`✓`,'green');
        return true;

    }

    /**
     * This functions validates the coordinates of the start Point
     * @return {Boolean} returns true or false and shows relevant message to the HTML element
     */
    validateStartPoint(){
        const input = document.getElementById("startPoint").value.trim();
        if (!this.validateIntegerPair(input,false)) {
            this.showSpanMessage("startPointConfig-message",`Error: The x,y should 
                be non-negative integers separated by a comma (,)`, 'red');
            document.getElementById("commandConfig").style.display = "none";
            return false
        }
        this.showSpanMessage("startPointConfig-message",`✓`,'green');
        document.getElementById("commandConfig").style.display = "block";
        return true;
    }

    /**
     * This functions validates a pair of comma separated integer, it can accept 0 or positive integers
     * @param {String} string is the expected pair of numbers separated by comma
     * @param {Boolean} noZeroAccept is a flag for accepting 0 or non-0 values
     * @return {Boolean} returns true or false
     */
    validateIntegerPair(string,noZeroAccept = true){
        let error_flag = false;
        const parts = string.split(',').map(item => {
            if (!this.isInt(item)) error_flag = true;
            else if (noZeroAccept && (item <= 0)) error_flag = true;
            else if (item < 0) error_flag = true;
            return parseInt(item,10) });
        if ( (parts.length!==2) || error_flag ) return false;
        return true;
    }

    /**
     * This functions validates the command query
     * @return {Boolean} returns true or false and shows relevant message to the HTML element
     */
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

    /**
     * This functions delays the given function
     * @param {Function} fn is a function
     * @param {Number} milliSeconds is a number
     */
    forceDelay(fn, milliSeconds){
        let timer = 0;
        return function(...args) {
            clearTimeout(timer)
            timer =  setTimeout( fn.bind(this, ...args), milliSeconds || 0)
        }
    }

    /**
     * This functions delays the given function
     * @param {String} string is the expected number string
     * @return {Boolean} returns true or false
     */
    isInt(string) {
        return !isNaN(string) &&
            parseInt(Number(string)) == string &&
            !isNaN(parseInt(string, 10));
    }

    /**
     * This functions creates message in HTML element
     * @param {String} elementId is the HTML element id
     * @param {String} message is the message to be shown
     * @return {String} messageColor green (success) or red (fail)
     */
    showSpanMessage(elementId, message, messageColor){
        document.getElementById(elementId).innerHTML = `<span style="color:${messageColor}">${message}</span>`;
    }
}

export default InputOutput
