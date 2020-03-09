//import Simulator from './components/simulator'
import InputOutput from "./components/input-output";
// let start_point = {
//     x:2,
//     y:2,
//     direction:'north'
// };

//const simulator = new Simulator();

//simulator.initiatePoint({ x : 2, y : 2, direction : 'north'} );
//simulator.initiatePlayground("rectangle",[ {x : 4, y : 4 } ]);

//let command_series = '1,4,1,3,2,3,2,4,1,1,0';
//let commands_array = command_series.split(',').map(item => parseInt(item));
//console.log(commands_array)
//simulator.simulateMotion(commands_array)

const inputOutput = new InputOutput();
inputOutput.addEvents();
//console.log("test2")
//console.log(simulator.isPointInPolygon({x_position:7,y_position:7},[{x:1,y:1},{x:5,y:1},{x:5,y:6},{x:3,y:6},{x:0,y:5}]))
//console.log("test3")
//console.log(simulator.isPointInPolygon({x_position:4,y_position:4},[{x:1,y:1},{x:5,y:1},{x:5,y:6},{x:3,y:6},{x:0,y:5}]))
//let vertices = [];

//console.log(simulator.point)


