import Simulator from './components/simulator'

const simulator = new Simulator();

let start_point = {
    x:2,
    y:2
};
let dimensions = [{x:4,y:4}]


simulator.initiatePoint(start_point.x,start_point.y);
simulator.initiatePolygon("rectangle",dimensions)


let command_series = '1,4,1,3,2,3,2,4,1,0';
let commands_array = command_series.split(',');

simulator.simulateMotion(commands_array)

//console.log(simulator.point)


