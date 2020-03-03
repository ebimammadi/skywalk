/**
 * Class representing a simulator
 * A Point is a point consisting x and y
 * @typedef {Object} Point
 * @typedef {Object} Direction
 */
class Simulator {
    constructor() {
        //cardinal directions including corresponding coordinate changes
        //it is possible to extend more direction like 'north-west'
        this.cardinal_directions = [
            {
                direction: 'north',
                backward_direction: 'south',
                x_change: '',
                y_change: '-',
                arrow: '↑'
            },
            {
                direction: 'east',
                backward_direction: 'west',
                x_change: '+',
                y_change: '',
                arrow: '→'
            },
            {
                direction: 'south',
                backward_direction: 'north',
                x_change: '',
                y_change: '+',
                arrow: '↓'
            },
            {
                direction: 'west',
                backward_direction: 'east',
                x_change: '-',
                y_change: '',
                arrow: '←'
            }
        ];
        this.point = {
            x_position: 0,
            y_position: 0,
            direction: 'north'
        }
        this.vertices = [];
    }

    /**
     * This is a function which initiates x,y coordinates of the moving object and its direction
     * @param {Number} x_coordinate is a positive integer specifying x coordinate of the object
     * @param {Number} y_coordinate is a positive integer specifying y coordinate of the object
     * @param {String} [direction=north] is a string specifying directions
     */
    initiatePoint(x_coordinate,y_coordinate,direction= 'north'){
        this.point.direction = direction;
        this.point.x_position = x_coordinate;
        this.point.y_position = y_coordinate;
    }

    /**
     * This is a function which initiates polygon as a genetic shape for the playground table
     * @param {String} shape is a string specifying different types of playground(polygonal)
     * @param {Object[]} dimensions is an array of the vertices {x,y} or {x,y} as width and height of the rectangle
     */
    initiatePolygon(shape,dimensions){
        if (shape==='rectangle'){
            const dimension = dimensions[0];
            this.vertices = [];
            this.vertices
                .push({x:0,y:0},{x:dimension.x,y:0},{x:dimension.x,y:dimension.y},{x:0,y:dimension.y})
        }
        if (shape==='polygon'){
            this.vertices = [...dimensions]
        }
    }

    /**
     * This is a function which applies the command to the object, it includes two types of commands:
     * one for motion, and the other for rotation
     * right now there are 5 commands, but more commands can be added accordingly
     * @param {Number} command is an integer specifying the command
     */
    applyCommand(command){
        console.log(`[${this.point.x_position},${this.point.y_position}], ${this.findCurrentDirection().arrow}, command=${command}`)
        let step = 0;
        switch (command) {
            case 1: case 2: step = (command === 1)? 1:-1; this.applyMotion(step);break;
            case 3: this.apply_rotation(90);break;
            case 4: this.apply_rotation(-90);break;
            case 0:default: this.quit();break;
        }
    }

    /**
     * This is a function which quit the command series and returns the [x,y] the coordinates for the object on the playground
     * if it falls of the playground (polygon) it returns [-1, -1]
     */
    quit(){
        if (this.isPointInPolygon(this.point,this.vertices))
            console.log(`[${this.point.x_position}, ${this.point.y_position}]`);
        else console.log(`[-1,-1]`)
    }

    /**
     * This is a function which applies the motion to the object:
     * @param {Number} step is an integer positive for forward and negative for backward motion
     * Now accepts 1 and -1, but It CAN be changed to longer steps by new commands!
     */
    applyMotion(step){
        const direction = this.findOnwardDirection(step);
        this.applyOnwardMotion(direction,step)
    }

    findCurrentDirection(){
        return this.cardinal_directions.find(direction => direction.direction === this.point.direction )
    }
    /**
     * This is a function which finds the onward direction based on the sign of step (positive/negative) and the current direction
     * @param {Number} step is an integer positive for forward and negative for backward motion
     * Now accepts 1 and -1, but It CAN be changed to longer steps by new commands!
     * @returns {Direction} onwardDirection (which is one of the cardinal_directions)
     */
    findOnwardDirection(step){
        const direction = this.cardinal_directions.find(direction =>
            {
                if (step>0)
                    return direction.direction === this.point.direction;
                return direction.backward_direction === this.point.direction
            }
        );
        return direction;
    }

    /**
     * This is a function which applies the motion to the object, based on the direction and step
     * @param {Object} direction is an object specifying two dimensions of the motion x/y and +/-
     * @param {Integer} step is an integer specifying the step
     */
    applyOnwardMotion(direction, step){
        if (step<0) step = -1 * step;
        if (direction.x_change === '+' ) this.point.x_position += step;
        if (direction.x_change === '-' ) this.point.x_position -= step;
        if (direction.y_change === '+' ) this.point.y_position += step;
        if (direction.y_change === '-' ) this.point.y_position -= step;
    }

    /**
     * This is a function which applies the rotation for the object's direction
     * @param {Number} degree is a degree specifying the clockwise/counter-clockwise rotation
     * it uses the base cardinal_directions and finds the relevant new direction based on the degree received
     */
    apply_rotation(degree){
        const current_index = this.cardinal_directions.findIndex(item => this.point.direction === item.direction);
        let new_index;
        if (degree === 90) {
            new_index = (current_index === this.cardinal_directions.length-1) ? 0 : current_index + 1
        }else if (degree === -90) {
            new_index = (current_index === 0) ? this.cardinal_directions.length - 1 : current_index - 1
        }
        this.point.direction = this.cardinal_directions[new_index].direction
    }

    /**
     * This is a function which uses the wild number algorithm for the point inside a polygon
     * @param {Object} point is an object consisting x,y coordinates
     * @param {Object[]} vertices is the array of the vertices of the playground
     * @returns {Boolean} is_in is true or false
     */
    isPointInPolygon(point,vertices){
        let x = point.x_position, y = point.y_position;
        let is_in = false;
        for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
            let xi = vertices[i].x, yi = vertices[i].y;
            let xj = vertices[j].x, yj = vertices[j].y;

            let intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) is_in = !is_in;
        }
        return is_in;
    }

    /**
     * This is a function which simulate the Motion of the object based on the current position of the object and commands
     * @param {Array.Number} commands is the array of the commands
     */
    simulateMotion(commands){

        commands.forEach(command => {
            if(isNaN(command)) throw 'invalid command';
            this.applyCommand( parseInt(command) )
        })
    }

    command_series_validate(command_series){
        if (command_series.slice(-1)[0]!=='0') console.log(`The command string is not valid: `,`[-1,-1]`)
        const commands = command_series.split(',');
        if (command_series.slice(-1)!=='0') console.log(`The command string is not valid: `,`[-1,-1]`)
        commands.forEach(command => {
            if(isNaN(command)) throw 'invalid command';
            //this.applyCommand( parseInt(command) )
        })
    }

}

export default Simulator
