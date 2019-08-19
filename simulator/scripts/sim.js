//GLOBALS FOR FUNCTIONS

var devices = [], isDragging = false, needsRedraw = false, selected = null,
    deviceCount = 0, PCCount = 0, switchCount = 0, routerCount = 0;


var addButton = document.getElementById("add-button");
addButton.addEventListener("click", function(){showMenu("add-menu-container");});

var removeButton = document.getElementById("remove-button");
removeButton.addEventListener("click", removeDevice);

var pcButton = document.getElementById("add-PC"), switchButton = document.getElementById("add-switch"),
    routerButton = document.getElementById("add-router");

pcButton.addEventListener("click", function(e){ addDevice(e, "PC"); });
switchButton.addEventListener("click", function(e){ addDevice(e, "Switch"); });
routerButton.addEventListener("click", function(e){ addDevice(e, "Router"); });

var canvas = document.getElementById("ui-topology");
var ctx = canvas.getContext('2d');

canvas.addEventListener("mousedown", function(e){ selectDevice(e); });
canvas.addEventListener("mousemove", function(e){ dragDevice(e); });
canvas.addEventListener("mouseup", endDrag);

/*----------OBJECT DEFINITIONS----------*/
/*
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
    this.width = icon.width;
    this.height = icon.height;
    this.connectedTo = null;
}

Device.prototype.contains = function(mx, my){
    //console.log(mx);
    //console.log(my);
    return (this.x <= mx) && (this.x + this.width >= mx) &&
       (this.y <= my) && (this.y + this.height >= my);
}


/*----------FUNCTION DEFINITIONS----------*/
/*
*
*
*
*
*/

function showMenu(id){
    document.getElementById(id).classList.toggle('show');
}


function addDevice(event, name){
    var icon = new Image();
    
    if(name == "PC"){
        icon.src = 'icons/pc.png';
        icon.onload = function(){
            PCCount++;
            deviceCount++;
            devices[deviceCount - 1] = new Device(icon, ("PC" + PCCount));
            redraw();
        }
    }else if(name == "Switch"){
        icon.src = 'icons/switch.png';
        icon.onload = function(){
            switchCount++;
            deviceCount++;
            devices[deviceCount - 1] = new Device(icon, ("Switch" + switchCount));
            redraw(); 
        }
    }else if(name == "Router"){
        icon.src = 'icons/router.png';
        icon.onload = function(){
            routerCount++;
            deviceCount++;
            devices[deviceCount - 1] = new Device(icon, ("Router" + switchCount));
            redraw();
        }
    }
}

function removeDevice() {
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

function convertCoordinates(canvas, x, y){
    var container = canvas.getBoundingClientRect();
    
    return {x: x - container.left * (canvas.width / container.width),
            y: y - container.top  * (canvas.height / container.width)
           };
}

function selectDevice(e){
    var location = convertCoordinates(canvas, e.clientX, e.clientY);
    var x = null;
    for(x of devices){
        //console.log("inloop");
        //console.log(x);
        if(x.contains(location.x, location.y)){
            selected = x;
            isDragging = true;
            //console.log("in it...")
            highlight();
            return;
        }else {
            deselect();
        }
    }
}

function dragDevice(e){
    if(isDragging){
        var location = convertCoordinates(canvas, e.clientX, e.clientY);
        //console.log("mousdwn.");
        selected.x = location.x;
        selected.y = location.y;
        //console.log("drag start...");
        redraw();
        highlight();
    }
}

function endDrag(){
    isDragging = false;
    //console.log("drag over...");
}

function redraw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var x = null;
    for(x of devices){
        //console.log("redraw..")
        ctx.drawImage(x.icon, x.x, x.y, (x.width/3),(x.height/3));
    }
}


function highlight(){
    redraw();
    if(selected != null){
        ctx.strokeRect(selected.x, selected.y, (selected.width/3), (selected.height/3))
    }else {
        return;
    }
}

function deselect(){
    selected = null;
    redraw();
}