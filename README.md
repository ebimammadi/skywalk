#Brief

The purpose of this test is to cover a simple simulations of a moving object on a 2D surface. 

#Assumptions
* It accepts rectangle or simple polygon shapes, and some commands to perform motion on the shape. 
* The starting point of the object should be inside the shape. it has it's coordinates as [x, y], The object has a default direction to the up (north).
* Top-left is the origin, x increases to the right (east), and y increases to the bottom (south).
* If the object falls out of the shape it fails, otherwise it succeeds. 
* The commands should end with 0.

# Commands
The commands are:  
    0 = quit simulation and print results to ​stout  
    1 = move forward one step  
    2 = move backwards one step  
    3 = rotate clockwise 90 degrees (eg north to east)  
    4 = rotate counterclockwise 90 degrees (eg west to south)

The commands can easily also be extended based on adding more directions and steps. However, it **only validates 0-4 commands** now!

# Start the code

* NOTE: I have used node.js and webpack to run this server. First you should run `npm install`, then `npm start`, you can see the application running on your web browser.
* For building the application to dist folder run `npm build`


## File structure
```               
├── src
│   ├── components
|       ├── input-output.js             - Input-output Componet using HTML inputs, and outputs to HTML elements
|       ├── polygon.js                  - The polygon Component (point in polygon), uses ray casting algorithm 
|       └── simulator.js                - simulator handles the playground, directions, commands

|   ├── templates 
|       └── index.template.html         - It will be used with webpack to create the index.html file in 'dist' folder     
|   └── index.js                        - Main app file                  
├── package.json                        - Packages                                        
├── readme.md                           - PLEASE READ MY COMMENTS FIRST
└── webpack.js                          - Webpack configuration file                       

```
