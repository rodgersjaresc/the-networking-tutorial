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
    this.height = icon.height/zoomlevel;
    this.connectedTo = [];
    this.connectionIndex = [];
}

Device.prototype.contains = function(mx, my){
    //console.log(mx);
    //console.log(my);
    return (this.x <= mx) && (this.x + this.width >= mx) &&
       (this.y <= my) && (this.y + this.height >= my);
}
