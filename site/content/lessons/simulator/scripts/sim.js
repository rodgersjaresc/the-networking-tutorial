/*-----------GLOBAL VARIABLE DEFINITIONS-----------
*
*
*
*
*
*/

var devices = [], connections = [], isDragging = false, selected = null,
    deviceCount = 0, PCCount = 0, switchCount = 0, routerCount = 0,
    isConnecting = false, zoomLevel = 3;

var addButton = document.getElementById("add-button");
addButton.addEventListener("click", function(){showMenu("add-menu-container");});

var removeButton = document.getElementById("remove-button");
removeButton.addEventListener("click", removeDevice);

var zoomInButton = document.getElementById("zoom-in-button");
zoomInButton.addEventListener("click", zoomIn);

var zoomOutButton = document.getElementById("zoom-out-button");
zoomOutButton.addEventListener("click", zoomOut);

var pcButton = document.getElementById("add-PC"), switchButton = document.getElementById("add-switch"),
    routerButton = document.getElementById("add-router"), connectionButton = document.getElementById("connection-button");

pcButton.addEventListener("click", function(e){ addDevice(e, "PC"); });
switchButton.addEventListener("click", function(e){ addDevice(e, "Switch"); });
routerButton.addEventListener("click", function(e){ addDevice(e, "Router"); });
connectionButton.addEventListener("click", function(){ addConnection(); });

var canvas = document.getElementById("ui-topology");
var ctx = canvas.getContext('2d');

canvas.addEventListener("mousedown", function(e){ selectDevice(e); });
//canvas.addEventListener("click", function(e){ if(isConnecting) finishConnection(e); });
canvas.addEventListener("mousemove", function(e){ if(isDragging) dragDevice(e); });
canvas.addEventListener("mousemove", function(e){ if(isConnecting) drawConnection(e); });
canvas.addEventListener("mouseup", endDrag);

//------------GLOBAL VARIABLE DEFINITIONS-----------



function Connection(){
    this.head = {x:0, y:0};
    this.tail = {x:0, y:0};
    this.valid = false;
    this.index = 0;
}

/*----------OBJECT DEFINITIONS----------
*
*
*
*
*/

function Device(icon, name){
    this.name = name;
    this.icon = icon;
    this.x = 0;
    this.y = 0;
    this.width = icon.width/zoomLevel;
    this.height = icon.height/zoomLevel;
    this.connectedTo = [];
    this.connectionIndex = [];
}

Device.prototype.contains = function(mx, my){
    //console.log(mx);
    //console.log(my);
    return (this.x <= mx) && (this.x + this.width >= mx) &&
       (this.y <= my) && (this.y + this.height >= my);
}

//----------END OBJECT DEFINITIONS----------


/*----------UTILITY FUNCTIONS----------
*
*
*
*
*
*/
function convertCoordinates(canvas, x, y){
    var container = canvas.getBoundingClientRect();
    
    return {x: x - container.left * (canvas.width / container.width),
            y: y - container.top  * (canvas.height / container.height)
           };
}

function showMenu(id){
    document.getElementById(id).classList.toggle('show');
}
//----------END UTILITY FUNCTIONS----------

/*----------FUNCTION DEFINITIONS----------
/*
*
*
*
*
*/

function zoomIn() {
    var x = null;
    var y = null;
    if(zoomLevel > 2){
        zoomLevel--;
        for(x of devices) {
            x.width = x.icon.width / zoomLevel;
            x.height = x.icon.height / zoomLevel;
        }
        
        redraw();
    }
    
}

function zoomOut() {
    var x = null;
    var y = null;
    if(zoomLevel < 6){
        zoomLevel++;
        for(x of devices) {
            x.width = x.icon.width / zoomLevel;
            x.height = x.icon.height / zoomLevel;
        }
        
        redraw();
    }
}

function addDevice(event, name){
    var icon = new Image();
    
    if(name == "PC"){
        icon.src = 'simulator/icons/pc.png';
        icon.onload = function(){
            PCCount++;
            deviceCount++;
            devices[deviceCount - 1] = new Device(icon, ("PC" + PCCount));
            redraw();
        }
    }else if(name == "Switch"){
        icon.src = 'simulator/icons/switch.png';
        icon.onload = function(){
            switchCount++;
            deviceCount++;
            devices[deviceCount - 1] = new Device(icon, ("Switch" + switchCount));
            redraw(); 
        }
    }else if(name == "Router"){
        icon.src = 'simulator/icons/router.png';
        icon.onload = function(){
            routerCount++;
            deviceCount++;
            devices[deviceCount - 1] = new Device(icon, ("Router" + switchCount));
            redraw();
        }
    }
}

function removeDevice() {
    var done = false;
    var x = null;
    var y = null;
    if(selected != null){
        if(devices.length > 0){
            var choice = selected.name;

            for(var i = 0; i < devices.length; i++){
                if(selected.name == devices[i].name){
                    //console.log("removing");
                    if(selected.name.startsWith("PC")){
                        PCCount--;
                    }else if(selected.name.startsWith("Switch")){
                        switchCount--;
                    }else if(selected.name.startsWith("Router")){
                        routerCount--;
                    }
                    for(x of selected.connectionIndex){
                        connections[x].valid = false;
                    }
                        
                    for(y of selected.connectedTo){
                        for(z of y.connectedTo){
                            if(z === selected){
                            y.connectedTo.splice(y.connectedTo.indexOf(z), 1);
                            break;
                            }
                        }

                    }

                    devices.splice(i, 1);
                    deviceCount--;
                    redraw();
                }
            }
        }else {
            return;
        }
    }
        
}

function selectDevice(e){
    var location = convertCoordinates(canvas, e.clientX, e.clientY);
    var x = null;
    for(x of devices){
        //console.log("inloop");
        //console.log(x);
        if(x.contains(location.x, location.y)){
            if(isConnecting){
                finishConnection(e);
                return;
            }else{
                selected = x;
                isDragging = true;
                //console.log("in it...")
                highlight();
                return;
            }
        }
    }
    deselect();
}

function dragDevice(e){
    if(isDragging){
        var location = convertCoordinates(canvas, e.clientX, e.clientY);
        var x, y, z = 0;
        redraw();
        highlight();
        //console.log("mousdwn.");
        selected.x = location.x;
        selected.y = location.y;
        if(selected.connectedTo.length != 0){
            for(x of connections){
                for(y of selected.connectedTo){
                    for(z of y.connectionIndex){
                        if(z == x.index && (selected.connectionIndex.indexOf(z) >= 0)){
                            x.head.x = ((selected.x) + (selected.width / 2));
                            x.head.y = ((selected.y) + (selected.height / 2));

                            x.tail.x = ((y.x)) + (y.width / 2);
                            x.tail.y = ((y.y)) + (y.height / 2);
                        }
                    }
                }
            }
        }
        //console.log("drag start...");
    }
}

function endDrag(){
    isDragging = false;
    //console.log("drag over...");
}

function redraw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var x = null;
    var y = null;
    
    if(connections.length){
        for(y of connections){
            if(y.valid){
                redrawConnection(y);
            }
        }
    }
    
    if(devices.length){
        for(x of devices){
        //console.log("redraw..")
            ctx.drawImage(x.icon, x.x, x.y, (x.width),(x.height));
        }
    }   
}


function highlight(){
    redraw();
    if(selected != null){
        ctx.strokeRect(selected.x, selected.y, (selected.width), (selected.height))
    }else {
        return;
    }
}

function deselect(){
    selected = null;
    if(isConnecting){
        isConnecting = false;
        document.getElementById("ui-topology").style.cursor = "default";
    }
    redraw();
}

function addConnection(){
    if(!isConnecting && selected != null){
        isConnecting = true;
    }else {
        document.getElementById("ui-topology").style.cursor = "default";
        isConnecting = false;
        return;
    }
    
    document.getElementById("ui-topology").style.cursor = "crosshair";
    var conn = new Connection();
    connections.push(conn);
    conn.index = connections.length - 1;
    //selected.connectionIndex.push(conn.index);
    setPathStart(conn);
}

function setPathStart(conn){
    conn.head.x = ((selected.x) + (selected.width / 2));
    conn.head.y = ((selected.y) + (selected.height / 2));
}

function drawConnection(e){
    var location = convertCoordinates(canvas, e.clientX, e.clientY);
    redraw();
    highlight();
    ctx.beginPath();
    ctx.moveTo(connections[connections.length - 1].head.x, connections[connections.length - 1].head.y);
    ctx.lineTo(location.x, location.y);
    //ctx.stroke();
    ctx.stroke();
}

function redrawConnection(conn){
    ctx.beginPath();
    ctx.moveTo(conn.head.x, conn.head.y);
    ctx.lineTo(conn.tail.x, conn.tail.y);
    ctx.stroke();
}

function finishConnection(e){
    var location = convertCoordinates(canvas, e.clientX, e.clientY);
    var x = null;
    for(x of devices){
        //console.log("inloop");
        //console.log(x);
        if(x.contains(location.x, location.y) && (x != selected)){
            connections[connections.length - 1].tail.x = location.x;
            connections[connections.length - 1].tail.y = location.y;
            connections[connections.length - 1].valid = true;
            x.connectedTo.push(selected);
            selected.connectedTo.push(x);
            selected.connectedTo[selected.connectedTo.length - 1].connectionIndex.push(connections[connections.length - 1].index);
            selected.connectionIndex.push(connections[connections.length - 1].index);
            
            isConnecting = false;
            document.getElementById("ui-topology").style.cursor = "default";
            redraw();
            return;
        }
    }
    
    console.log('elseing...');
    isConnecting = false;
    connections.pop();
    document.getElementById("ui-topology").style.cursor = "default";
    redraw();
}