var addButton = document.getElementById("add-button");
addButton.addEventListener("click", showMenu);

function showMenu(){
    document.getElementById('add-menu-container').classList.toggle('show');
}

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

//GLOBALS FOR FUNCTIONS
var devices = [], isDragging = false, needsRedraw = false, selected = null,
    deviceCount = 0, PCCount = 0, switchCount = 0, routerCount = 0;

function addDevice(event, name){
    var icon = new Image();
    
    if(name == "PC"){
        icon.src = 'Icons/PC.png';
        icon.onload = function(){
            PCCount++;
            deviceCount++;
            devices[deviceCount - 1] = new Device(icon, ("PC" + PCCount));
            redraw();
        }
    }else if(name == "Switch"){
        icon.src = 'Icons/Switch.png';
        icon.onload = function(){
            switchCount++;
            deviceCount++;
            devices[deviceCount - 1] = new Device(icon, ("Switch" + switchCount));
            redraw(); 
        }
    }else if(name == "Router"){
        icon.src = 'Icons/Router.png';
        icon.onload = function(){
            routerCount++;
            deviceCount++;
            devices[deviceCount - 1] = new Device(icon, ("Router" + switchCount));
            redraw();
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
        console.log("inloop");
        console.log(x);
        if(x.contains(location.x, location.y)){
            selected = x;
            isDragging = true;
            console.log("in it...")
            return;
        }
    }
}

function dragDevice(e){
    if(isDragging){
        var location = convertCoordinates(canvas, e.clientX, e.clientY);
        console.log("mousdwn.");
        selected.x = location.x;
        selected.y = location.y;
        console.log("drag start...");
        redraw();
    }
    
}

function endDrag(){
    isDragging = false;
    console.log("drag over...");
}

function redraw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var x = null;
    for(x of devices){
            console.log("redraw..")
            ctx.drawImage(x.icon, x.x, x.y);
    }
    needsRedraw = false;
}

function Device(icon, name){
    this.name = name;
    this.icon = icon;
    this.x = 0;
    this.y = 0;
    this.width = icon.width;
    this.height = icon.height;
    }

Device.prototype.contains = function(mx, my){
        console.log(mx);
        console.log(my);
        return (this.x <= mx) && (this.x + this.width >= mx) &&
           (this.y <= my) && (this.y + this.height >= my);
}