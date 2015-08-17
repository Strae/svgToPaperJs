/**
 *      Created in 03/12/2012 23:21:42
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
 * Example usage
 **/
var converter = new svgToPaperJs;
var p = new paper.Path();
p.strokeColor = 'black';
p.fillColor = 'red';
var commands = converter.convertPath(test);
converter.applyPaperFunctions(p, commands);
paper.project.activeLayer.addChild(p);


// Easy polygon
// var test = [{"M":[[288.39856,245.94664],[166.34216,234.06259],[254.11687,279.55511],[141.7067,230.53521],[211.12745,300.92504],[119.36701,219.56769],[163.63841,307.96459],[101.50986,202.23362],[116.29832,299.98469],[89.883213,180.22978],[73.741134,277.76645],[85.62518,155.71005],[40.132663,243.48476],[89.152564,131.07459],[18.762732,200.49534],[100.12008,108.7349],[11.723181,153.0063],[117.45415,90.877745],[19.703089,105.66621],[139.458,79.251102],[41.921327,63.109024],[163.97773,74.993069],[76.20302,29.500552],[188.61318,78.520453],[119.19244,8.1306218],[210.95287,89.487969],[166.68147,1.0910704],[228.81003,106.82204],[214.02157,9.0709783],[240.43667,128.82589],[256.57875,31.289216],[244.69471,153.34562],[290.18722,65.570909],[241.16732,177.98107],[311.55715,108.56032],[230.19981,200.32076],[318.5967,156.04936],[212.86573,218.17792],[310.6168,203.38946],[190.86189,229.80456]]},{"z":true}];


/**/
// Complex polygon
var test = [
    {
        "M":[
            [300.91515,1.1419523],
            [104.66515,6.391952],
            [103.74965,6.450952]
        ]
    },
    {
        "C":[
            [43.697552,12.230152],
            [-2.3348483,63.324852],
            [-2.3348483,124.89225],
            [-2.3348483,185.55795],
            [42.333952,236.36095],
            [101.12135,243.34195]
        ]
    },
    {
        "L":[
            [102.04015,243.39195],
            [300.00885,249.76695]
        ]
    },
    {
        "z":true
    }
];
/**/
