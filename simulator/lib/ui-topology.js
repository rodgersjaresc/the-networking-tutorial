var canvas = document.getElementById('ui-topology');
var context = canvas.getContext('2d');

var items = [];
var PCpop = 0;

var dragging = false;
var displacedx = 0;
var displacedy = 0;
var selected = null;



canvas.addEventListener("mousedown", dragDetect);
canvas.addEventListener("mousemove", moveItem)
canvas.addEventListener("mouseup", stopDrag);

function dragDetect(e) {
    var location = convertCoordinates(canvas, e.clientX, e.clientY);
    var i;
    for (i in items) {
        if(items[i].contains(location.x, location.y)){
            dragging = true;
            selected = items[i];
        }
    }
}

function moveItem(e){
    if(dragging){
        var location = convertCoordinates(canvas, e.clientX, e.clientY);
        drawScreen(selected.icon, location.x, location.y)
    }else {
        return;
    }
}

function stopDrag() {
    dragging = false;
}

function Device(x, y, w, h, name, icon){
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.name = name;
    this.icon = icon;
}

Device.prototype.contains = function(mx, my) {
    return (this.x <= mx) && (this.x + this.width >= mx) &&
           (this.y <= my) && (this.y + this.height >= my);
}

function convertCoordinates(canvas, x, y){
    var container = canvas.getBoundingClientRect();
    
    return {x: x - container.left * (canvas.width / container.width),
            y: y - container.top  * (canvas.height / container.width)
           };
}

function addPC(){
    var active = true;
    
    canvas.onclick = function(e){
        if(active){
            var pc_icon = new Image();
            pc_icon.src = 'Icons/PC.png';
            var location = convertCoordinates(canvas, e.clientX, e.clientY);
            
            pc_icon.onload = function (){
                context.drawImage(pc_icon, location.x, location.y);
                PCpop++;
                var addedPC = new Device(location.x, location.y, pc_icon.width, pc_icon.height, "PC" + PCpop, pc_icon);
                items.push(addedPC);
            }
            
            active = false;
            console.log(items[PCpop - 1]);
        }else{
            return 1;
        }
    }
}



function drawScreen(img, x, y){
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, x, y)
}
function dragging(){
    console.log("dragging...");
}