"use strict";
console.clear();                  

var node1  = document.getElementById("n1");
var node2  = document.getElementById("n2");
var pointerId = 0;
var connectorId = 0;

function createConnector(nodeA,nodeB){
    var xmlns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(xmlns,"svg");
    svg.setAttributeNS(null,"width","100%");
    svg.setAttributeNS(null,"height","100%");
    svg.setAttributeNS(null,"nodeA",nodeA.id);
    svg.setAttributeNS(null,"nodeB",nodeB.id);
    svg.setAttributeNS(null,"pIdA",nodeA.parentElement.id);
    svg.setAttributeNS(null,"pIdB",nodeB.parentElement.id);
    svg.setAttributeNS(null,"class","connector");
    
    var defs = document.createElementNS(xmlns,"defs");
    var marker = document.createElementNS(xmlns,"marker");
    marker.setAttributeNS(null,"id","arrowhead");
    marker.setAttributeNS(null,"viewBox","0 0 10 10");
    marker.setAttributeNS(null,"refX","9");
    marker.setAttributeNS(null,"refY","5");
    marker.setAttributeNS(null,"markerWidth","10");
    marker.setAttributeNS(null,"markerHeight","8");
    marker.setAttributeNS(null,"orient","auto");
    var path = document.createElementNS(xmlns,"path");
    path.setAttributeNS(null,"d","M 0 3 L 10 5 L 0 7 z");
    marker.appendChild(path);
    defs.appendChild(marker);
    var g = document.createElementNS(xmlns,"g");
    g.setAttributeNS(null,"fill","none");
    g.setAttributeNS(null,"stroke","black");
    g.setAttributeNS(null,"stroke-width","2");
    g.setAttributeNS(null,"marker-end","url(#arrowhead)");
    path = document.createElementNS(xmlns,"path");
    path.setAttributeNS(null,"id","arrow");
    g.appendChild(path);
    svg.appendChild(defs);
    svg.appendChild(g);
    svg.id = "con"+connectorId++;
    document.body.insertBefore(svg,document.body.firstChild);
    return svg;
}

function drawConnector(nodeA, nodeB, con) {
    let arrow  = con.getElementById("arrow");
    let xmlns = "http://www.w3.org/2000/svg";

    let parentA = document.getElementById(con.getAttribute("pIdA"));  
    let parentB = document.getElementById(con.getAttribute("pIdB"));  

    let posnA;
    let posnB;
    
    let dtXA;
    let dtYA;
    
    let dtXB;
    let dtYB;

    if (nodeA.getAttribute("class") === "dot") {
        dtXA = parentA.offsetLeft + nodeA.offsetLeft + 3;
        dtYA = (parentA.offsetTop + nodeA.offsetTop) + 
               (parentA.offsetHeight + nodeA.offsetHeight)/2 - 20;
    } else {
        dtXA = nodeA.offsetLeft;
        dtYA = nodeA.offsetTop  + nodeA.offsetHeight/2;
    }
    
    if (nodeB.getAttribute("class") === "dot") {
        dtXB = parentB.offsetLeft + nodeB.offsetLeft + 3;
        dtYB = parentB.offsetTop + nodeB.offsetTop  + ((nodeA.getAttribute("class") === "dot") ? (parentA.offsetHeight + nodeA.offsetHeight)/2:nodeA.offsetHeight/2) - 20;
    } else {
        
        if (nodeB.getAttribute("class") === "pointer") {
            dtXB = nodeB.offsetLeft + 4;
            dtYB = nodeB.offsetTop  + ((nodeA.getAttribute("class") === "dot") ? (parentA.offsetHeight + nodeA.offsetHeight ) / 2: nodeA.offsetHeight / 2) - 18;
        } else {
            dtXB = nodeB.offsetLeft;
            dtYB = nodeB.offsetTop  + ((nodeA.getAttribute("class") === "dot") ? (parentA.offsetHeight + nodeA.offsetHeight ) / 2: nodeA.offsetHeight / 2) ;
        }
    }
        
        
    posnA = {
        x: dtXA ,
        y: dtYA
    };

    posnB = {
        x: dtXB ,
        y: dtYB
    };


  
    var dStr =
        "M" +
        (posnA.x      ) + "," + (posnA.y) + " " +
        "L" +
        (posnB.x      ) + "," + (posnB.y) + " ";
  
    arrow.setAttribute("d", dStr);
  
};

function drawConnectorCurve(nodeA, nodeB, con) {
  let arrow  = con.getElementById("arrow");
  let xmlns = "http://www.w3.org/2000/svg";

  let parentA = document.getElementById(con.getAttribute("pIdA"));  
  let parentB = document.getElementById(con.getAttribute("pIdB"));  

  let posnA;
  let posnB;
  
  if (nodeA.getAttribute("class") == "dot") {
        
    posnA = {
      x: parentA.offsetLeft + nodeA.offsetLeft,
      y: (parentA.offsetTop + nodeA.offsetTop) + (parentA.offsetHeight + nodeA.offsetHeight) /2 - 20
    };
    
    posnB = {
    x: nodeB.offsetLeft - 8,
    y: nodeB.offsetTop  + (parentA.offsetHeight + nodeA.offsetHeight ) / 2 - 20
    };
    
  } else {
    posnA = {
      x: nodeA.offsetLeft,
      y: nodeA.offsetTop  + nodeA.offsetHeight / 2
    };
    
    posnB = {
    x: nodeB.offsetLeft - 8,
    y: nodeB.offsetTop  + nodeA.offsetHeight / 2
  };
  }
  
  var dStr =
      "M" +
      (posnA.x      ) + "," + (posnA.y) + " " +
      "C" +
      (posnA.x - 100) + "," + (posnA.y) + " " +
      (posnB.x - 100) + "," + (posnB.y) + " " +
      (posnB.x      ) + "," + (posnB.y);
  
    arrow.setAttribute("d", dStr);
  
};

function updateConnectors() {
    let con = document.getElementsByTagNameNS("http://www.w3.org/2000/svg","svg");
    for (var i = 0;i<con.length;i++) {
        let nodeA = document.getElementById(con[i].getAttributeNS(null,"nodeA"));
        let nodeB = document.getElementById(con[i].getAttributeNS(null,"nodeB"));
        drawConnector(nodeA, nodeB, con[i]);
    }  
}

function updateNodes() {
    
    updateConnectors();
    
    let elmntNode = document.getElementsByClassName("node");

    for (var i = 0;i<elmntNode.length;i++) {
        dragElement(elmntNode[i]);
    }
    
    
    function dragElement(currElmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(currElmnt.id + "header")) {
          // if present, the header is where you move the DIV from:
          document.getElementById(currElmnt.id + "header").onmousedown = dragMouseDown;
        } else {
          // otherwise, move the DIV from anywhere inside the DIV: 
          currElmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      var target = e || window.event.srcElement;
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;

      if (target.target.id.indexOf("d") != -1) {
            var pointer = document.createElement("div");
            pointer.className = "pointer";
            pointer["id"] = "p" + (++pointerId);
            pointer["dot"] = target.target.parentElement.id + target.target.id;
           
            pointer.style.top = (-1 +target.target.parentElement.offsetTop + target.target.offsetTop)+ "px";;
            pointer.style.left = (-1 + target.target.parentElement.offsetLeft + target.target.offsetLeft) + "px";;

            dragElement(pointer);
            document.body.appendChild(pointer);
            let cn = createConnector(target.target,pointer);
            pointer["con"] = cn.id;

            drawConnector(target.target,pointer,cn);
      }
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      currElmnt.style.top = (currElmnt.offsetTop - pos2) + "px";
      currElmnt.style.left = (currElmnt.offsetLeft - pos1) + "px";
    updateConnectors();
    let pointers = document.getElementsByClassName("pointer");
    let dots = document.getElementsByClassName("dot");
      
    out:  for (let i=0;i<pointers.length;i++) {
          for (let j=0;j<dots.length;j++) {
              if (Math.abs((pointers[i].parentElement.offsetTop + pointers[i].offsetTop) -
                               (dots[j].parentElement.offsetTop + dots[j].offsetTop)) <= 5 &&
                  Math.abs((pointers[i].parentElement.offsetLeft + pointers[i].offsetLeft)  -
                               (dots[j].parentElement.offsetLeft + dots[j].offsetLeft)) <= 5 &&
                  (pointers[i]["dot"] != dots[j].parentElement.id + dots[j].id )) {
                  //console.log("pointer: " + dots[j].parentElement.id + " dot: " +dots[j].id);
                  let connector = document.getElementById(pointers[i]["con"]);
                  connector.setAttribute("nodeB",dots[j].id);
                  connector.setAttribute("pIdB",dots[j].parentElement.id);
                  pointers[i].remove();
                  break out;
              }
          }
      } 
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
    
    
}

}

setTimeout(updateNodes, 250);



