import Polygon from "./polygon";

const polygon = new Polygon();
/**
 * Class representing a simulator
 *
 * @typeof {Object} Coordinates
 *
 * //typedef {Object} Point has coordinates,direction
 * @typedef {Object} Point
 * @property {Coordinates} coordinates
 * @property {String}  direction
 *

 */
class Simulator {
    constructor() {
        this.point = {
            coordinates: {
                x: 1,
                y: 1
            },
            direction: 'north'
        };

        //Main directions including corresponding coordinate changes
        //it is possible to extend more directions like 'north-west'
        this.all_directions = [
            {
                direction: 'north',
                x_change: '',
                y_change: '-',
            },
            {
                direction: 'east',
                x_change: '+',
                y_change: '',
            },
            {
                direction: 'south',
                x_change: '',
                y_change: '+',
            },
            {
                direction: 'west',
                x_change: '-',
                y_change: '',
            }
        ];
        this.stepping_degree = 90;

        this.polygon = {
            shape:'',
            vertices:[]
        };


    }

    /**
     * This is a function which initiates x,y coordinates of the moving object and its direction
     * @param {Point} point is an object of Point
     */
    initiatePoint(point){
        this.point.coordinates = point.coordinates;
        this.point.direction = ((point.direction === undefined) || (point.direction===''))?"north":point.direction;
    }

    /**
     * This is a function which initiates playground with a polygon as a genetic shape
     * @param {String} shape is a string specifying different types of polygons, For a rectangle it creates the vertices
     * based on the width and height of the rectangle.
     * @param {Object[]} dimensions is an array of the vertices {x,y}
     * or specifically [{x,y}] as width and height of in case of a 'rectangle' shape
     */
    initiatePlayground(shape, dimensions){
        this.polygon.shape = shape;
        if (shape==='rectangle'){
            const {x,y} = dimensions[0] ;
            this.polygon.vertices.push( { x : 0, y : 0 }, { x , y : 0 }, { x , y }, { x : 0, y } )
        }
        if (shape==='polygon'){
            this.polygon.vertices = [...dimensions]
        }
    }

    /**
     * This is a function which simulate the motion of the object based on the current position of the object,
     * and commands received from
     * @param {Array.<Number>} commands is the array of the commands
     * @return {Object} returns coordinates and message and success or fail color
     */
    simulateMotion(commands){
        const polygon = new Polygon();
        if (!polygon.isPointInside(this.point.coordinates, this.polygon.vertices))
            return {
                message: 'Start Point is not inside the shape!',
                messageColor:'red',
                coordinates: this.point.coordinates
            };
        for (let command of commands) {
            let newPoint = this.applyCommand( command);
            if (!polygon.isPointInside(newPoint.coordinates, this.polygon.vertices))
                return {
                    message: 'Point fell outside the shape! check console logs.',
                    messageColor:'red',
                    coordinates: newPoint.coordinates
                }
        }
        return {
            message: 'Point is inside the shape.',
            messageColor:'green',
            coordinates: this.point.coordinates
        }
    }

    /**
     * This functions validates the command query
     * @param {String} commandQuery is a string
     * @return {Object} which has two properties, one is validate which is true or false, the other is message
     */
    commandQueryValidate(commandQuery){
        if (commandQuery.trim()==="") return { message : 'Command query is empty', validate : false };
        if (commandQuery.slice(-1)[0]!=='0') return { message : 'Commands should end with 0', validate : false };
        const commands = commandQuery.split(',');
        if (commands.length<2) return { message : 'Commands query is not valid', validate : false };
        for (let i=0; i<commands.length; i++){
            let command = commands[i];
            if (!this.isInt(command))
                return { message : 'Commands query is not valid', validate : false };
            command = parseInt(command);
            if (command>4||command<0) return { message : 'Command query is not valid, unacceptable command', validate : false };
        }
        return {validate: true}
    }

    /**
     * This functions check an integer is valid or not:
     * @param {Number} value is an integer
     * @return {Boolean}
     */
    isInt(value) {
        return !isNaN(value) &&
            parseInt(Number(value)) == value &&
            !isNaN(parseInt(value, 10));
    }
    /**
     * This is a function which applies the command to the object, it includes two types of commands:
     * one for motion, and the other for rotation
     * right now there are 5 commands, but more commands can be added accordingly ;)
     * For example it can be added more directions like 'south-west' and its relevant coordinates changes
     * then the stepping_degree would be 45 instead of 90
     * or it can move more than one step backward or forward based on new commands
     * @param {Number} command is an integer specifying the command
     * @return {Coordinates}
     */
    applyCommand(command){
        console.log(`([${this.point.coordinates.x},${this.point.coordinates.y}],${this.point.direction})=>(${command})`);
        switch (command) {
            case 1: this.applyMotion(1); break;
            case 2: this.applyRotation(180);
                    this.applyMotion(1);
                    this.applyRotation(180);
                    break;
            case 3: this.applyRotation(90);break;
            case 4: this.applyRotation(-90);break;
            case 0:default: break;
        }
        return this.point
    }

    /**
     * This is a function which quit the command series and returns the {x,y} the coordinates for the object on the playground
     * if it falls of the playground (polygon) it returns {-1, -1}
     * @return {Coordinates} returns the point's coordinates and
     * NOTE: this function is not handling
     */
    quit(){
        if (polygon.isPointInside(this.point.coordinates,this.polygon.vertices))
            return { x : this.point.coordinates.x, y : this.point.coordinates.y } ;
        return {x: -1 ,y: -1};
    }

    /**
     * This is a function which applies the motion to the object and changes its coordinates:
     * @param {Number} step is an integer positive for forward motion
     * Now accepts 1 and -1, but It CAN be changed to longer steps by new commands!
     */
    applyMotion(step){
        const direction = this.all_directions.find(direction => direction.direction === this.point.direction );
        this.applyDirectionChanges(direction,step)
    }


    /**
     * This is a function which applies the motion to the object, based on the direction and step
     * @param {Object} direction is an object specifying two dimensions of the motion x/y and +/-
     * @param {Integer} step is an integer specifying the step
     */
    applyDirectionChanges(direction, step){
        if (direction.x_change === '+' ) this.point.coordinates.x += step;
        if (direction.x_change === '-' ) this.point.coordinates.x -= step;
        if (direction.y_change === '+' ) this.point.coordinates.y += step;
        if (direction.y_change === '-' ) this.point.coordinates.y -= step;
    }

    /**
     * This is a function which changes the object's direction
     * @param {Number} degree is a number specifying the clockwise/counter-clockwise rotation
     * it uses the all_directions array and finds the relevant new direction based on the degree received
     */
    applyRotation(degree){
        const current_index = this.all_directions.findIndex(item => this.point.direction === item.direction);
        const shift = degree/this.stepping_degree;
        const directions_length = this.all_directions.length;
        let new_index =  (current_index + shift) % directions_length;
        if (new_index < 0) new_index += this.all_directions.length;
        this.point.direction = this.all_directions[new_index].direction
    }

}

export default Simulator
