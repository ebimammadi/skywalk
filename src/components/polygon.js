/**
 * Class representing a polygon computation using Ray casting algorithm
 * wikipedia description link: https://en.wikipedia.org/wiki/Point_in_polygon
 * https://observablehq.com/@tmcw/understanding-point-in-polygon
 *
 * @typedef {Object} Coordinates
 * @property {Number}  x
 * @property {Number}  y
 */
class Polygon {
    /**
     * This is a function which uses the ray casting algorithm for checking the status of the point inside a polygon
     * @param {Coordinates} pointCoordinates is an object consisting x,y coordinates
     * @param {Array.<Coordinates>} polygon_vertices is the array of the vertices with their coordinates (Note: the vertices are consecutive)
     * @returns {Boolean} is_odd, true when the horizontal passes odd times, false when even times
     *
     */
    isPointInside(pointCoordinates,polygon_vertices){
        let is_odd = false;
        for (let i = 0, j = polygon_vertices.length - 1; i < polygon_vertices.length; j = i++) { //looping through all edges
            let vertexI = polygon_vertices[i], vertexJ = polygon_vertices[j];
            if (this.yCoordinateBetweenVerticesYRange(pointCoordinates.y,vertexI.y,vertexJ.y) &&
                this.xOnLeftHalfPlane(pointCoordinates,vertexI,vertexJ) )
                is_odd = !is_odd;
        }
        return is_odd;
    }

    /**
     * yCoordinateBetweenVerticesYRange checks if the y coordinate of the point is between the y's of the vertices of the edge
     * @param {Integer} y is a y coordinate of the point
     * @param {Integer} yi is the y coordinate of the first given vertex
     * @param {Integer} yj is the y coordinate of the second given vertex
     * @returns {Boolean} true when the y coordinate is between the y's, otherwise returns false
     */
    yCoordinateBetweenVerticesYRange(y,yi,yj){
        return (yi > y) !== (yj > y) //this also avoids (yj-yi) to be zero in the denominator
    }

    /**
     * xOnLeftHalfPlane checks if the x coordinate of the point is on the left or right of half-plane
     * @param {Coordinates} pointCoordinates is a y coordinate of the point
     * @param {Coordinates} vertexI is the y coordinate of the first given vertex
     * @param {Coordinates} vertexJ is the y coordinate of the second given vertex
     * @returns {Boolean} true when the y coordinate is between the y's, otherwise returns false
     */
    xOnLeftHalfPlane(pointCoordinates,vertexI,vertexJ){
        const x = pointCoordinates.x, y = pointCoordinates.y;
        return x < (vertexJ.x - vertexI.x) * (y - vertexI.y) / (vertexJ.y - vertexI.y) + vertexI.x
    }
}

export default Polygon
