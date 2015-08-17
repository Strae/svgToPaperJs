/**
 *      Created in 03/12/2012 20:52:32
 *      Copyright 2012 Daniele Pignedoli <daniele.pignedoli@gmail.com>
 *      
 *      @license <a href="http://www.gnu.org/licenses/gpl.html" target="_new">
 *      http://www.gnu.org/licenses/gpl.html</a><br /><br />
 *      This program is free software; you can redistribute it and/or modify<br />
 *      it under the terms of the GNU General Public License as published by<br />
 *      the Free Software Foundation; either version 2 of the License, or<br />
 *      (at your option) any later version<br />
 *      <br />
 *      This program is distributed in the hope that it will be useful,<br />
 *      but WITHOUT ANY WARRANTY; without even the implied warranty of<br />
 *      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the<br />
 *      GNU General Public License for more details:<br />
 *      <b>http://www.gnu.org/licenses/gpl.html</b><br />
 *      <br />
 *      You should have received a copy of the GNU General Public License<br />
 *      along with this program; if not, write to the Free Software<br />
 *      Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,<br />
 *      MA 02110-1301, USA<br />
 * */
/**
 * Convert a pathData (http://www.w3.org/TR/SVG/paths.html#PathData) from a SVG file (with
 * ABSOLUTE coords) to commands to recreate the vector path in PaperJs.org (using a paper.Path())
 * */
svgToPaperJs = function(){
    this._cur_x = null;
    this._cur_y = null;
    this._register = [];
    
    this.convertPath = function(pathString, closed)
    {
        // If closed is not specified, assume false.
        var closePath = typeof closed !== 'undefined' ? closed : false;
        try
        {
            if(typeof pathString !== 'object')
            {
                throw "pathString must be an object.";
            }
            // Cycle begin.
            for(var i in pathString){
                for(var key in pathString[i])
                {
                    switch(key){
                        case 'M': // moveTo http://www.w3.org/TR/SVG/paths.html#PathDataMovetoCommands
                            this.applyPathMoveTo(pathString[i][key]);
                            break;
                        case 'H': // Horizontal Line http://www.w3.org/TR/SVG/paths.html#PathDataLinetoCommands
                            this.applyPathHorizontalLine(pathString[i][key]);
                            break;
                        case 'L': // Line http://www.w3.org/TR/SVG/paths.html#PathDataLinetoCommands
                            this.applyPathLineTo(pathString[i][key]);
                            break;
                        case 'C': // cubic Bézier curve http://www.w3.org/TR/SVG/paths.html#PathDataCubicBezierCommands
                            this.applyPathCubicCurve(pathString[i][key]);
                            break;
                        case 'V': // Vertical Line http://www.w3.org/TR/SVG/paths.html#PathDataLinetoCommands
                            this.applyPathVerticalLine(pathString[i][key]);
                            break;
                        case 'A':
                            this.applyPathArc(pathString[i][key]);
                            break;
                        case 'z': // close path http://www.w3.org/TR/SVG/paths.html#PathDataClosePathCommand
                            this._register.push(['closePath']);
                            var closePath = false;
                            break;
                        default:
                            throw "Command " + key + " not implemented!";
                            break;
                    }
                }
            }
            
            if(closed === true)
            {
                this._register.push(['closePath']);
            }
            
            return this._register;
        }
        catch(error)
        {
            if(typeof console === 'object')
            {
                console.error('Error: ' + error);
            }
            else
            {
                alert('Error: ' + error);
            }
            return false;
        }
    };
    
    /**
     * Apply a moveTo function (M) in a path. Some SVG softwares utilize multiple M commands instead of LineTo,
     * so I apply 1 moveTo, and if we have more points use lineTo for others.
     * */
    this.applyPathMoveTo = function(points)
    {
        this._cur_x = points[0][0];
        this._cur_y = points[0][1];
        
        this._register.push(['moveTo', [points[0][0], points[0][1]]]);
        if(points.length > 1)
        {
            this.applyPathLineTo(points.splice(1, points.length -1));
        }
    };
    /**/
    
    /**
     * Create a horizonta line, using lineTo
     * */
    this.applyPathHorizontalLine =function(x_point)
    {
        // Calculate the X position
        this._cur_x = x_point;
        this._register.push(['lineTo', [this._cur_x, this._cur_y]]);
    };
    /**/
    
    /**
     * Create a vertical line, using lineTo
     * */
    this.applyPathVerticalLine = function(y_point)
    {
        // Calculate the Y position
        this._cur_y = y_point;
        this._register.push(['lineTo', [this._cur_x, this._cur_y]]);
    };
    /**/
    
    /**
     * Create a line, using lineTo. We can have multiple points
     * */
    this.applyPathLineTo = function(points)
    {
        //var linePoints = this.groupByN(points, 2);
        this._register.push(['lineTo', points]);
        this._cur_x = points[points.length-1][0];
        this._cur_y = points[points.length-1][1];
    };
    /**/
    
    /**
     * Cubic Bezier curve, we can have multiple curves, but the number of elements must be a multiple of 3
     * */
    this.applyPathCubicCurve = function(curvePoints)
    {
        if(curvePoints.length % 3 === 0)
        {
            var curves = this.groupByN(curvePoints, 3);
            
            this._cur_x = curves[curves.length-1][2][0];
            this._cur_y = curves[curves.length-1][2][1];
            this._register.push(['cubicCurveTo', curves]);
        }
        else
        {
            throw "Cubic Bézier Curve: curvePoints elements must be a multiple of 3, " + curvePoints.length + " given.";
        }
    };
    /**/
    
    /**
     * Arc curve, we can have multiple arcs, but the number of elements must be a multiple of 2
     * */
    this.applyPathArc = function(curvePoints)
    {
        if(curvePoints.length % 2 === 0)
        {
            var curves = this.groupByN(curvePoints, 2);
            this._cur_x = curves[curves.length-1][1][0];
            this._cur_y = curves[curves.length-1][1][1];
            this._register.push(['arcTo', curves]);
        }
        else
        {
            throw "Path curve: curvePoints elements must be a multiple of 2, " + curvePoints.length + " given.";
        }
    };
    /**/
    
    /**
     * Create an paper.Path(), populate with the pathString and return it.
     * */
    this.createPaperPath = function(name, pathString, closed)
    {
        var item = new paper.Path();
        item.name = name;
        
        var commands = this.convertPath(pathString, closed);
        this.applyPaperFunctions(item, commands);
        return item;
    };
    /**/
    
    /**
     * Apply the paperJs function to the item.
     * http://paperjs.org/reference/path
     * */
    this.applyPaperFunctions = function(item, commands)
    {
        var register = typeof commands == 'undefined' ? this._register : commands;
        
        // Cycle begin.
        for(var cmd in register){
            var points = register[cmd][1];
            switch(register[cmd][0]){
                case 'moveTo':
                    item.moveTo(points[0], points[1]);
                    break;
                case 'lineTo':
                    for(ip in points)
                    {
                        //console.log('lineTo', points[ip]);
                        item.lineTo(points[ip]);
                    }
                    break;
                case 'cubicCurveTo':
                    for(ic in points)
                    {
                        item.cubicCurveTo(points[ic][0], points[ic][1], points[ic][2]);
                    }
                    break;
                case 'arcTo':
                    for(ia in points)
                    {
                        //console.log('arcTo', [points[ia][0], points[ia][1]]);
                        item.arcTo(points[ia][0], points[ia][1]);
                    }
                    break;
                case 'closePath':
                    item.closePath();
                    break;
            }
        }
        // reset the registry
        this._register = [];
    };
    /**/
    
    /**
     * Group elements in small group by N elements.
     * */
    this.groupByN = function(items, n)
    {
        for(var i = 0, grp = [], ngrp = -1, m = items.length; i < m; i++)
        {
            if(i % n === 0)
            {
                ngrp++;
                if(typeof grp[ngrp] == 'undefined')
                {
                    grp[ngrp] = [];
                    
                }
            }
            grp[ngrp].push(items[i]);
        }
        return grp;
    };
    /**/
}
