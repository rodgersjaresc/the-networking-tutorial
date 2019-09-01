# Build Log
_this document tracks my thoughts as I build this site and the network simulator_
## 09/01/2019
I'm starting to see that I'm about to learn a hard lesson in software engineering. If you don't go into detail, thinking far ahead 
to what your application might become and breaking it down into modules sketching those modules out in deep detail, you'll end up 
with a bunch of hacks just sort of glued together, and when it's time to extend it, it's a nightmare. 

Right now, I've roughly implemented all of the critical animation components for the topology display of the simulator and I'm ready 
to move on to actually creating the network functionality of the app. However, I'm becoming gravely aware that the definition 
of the **_Device_** object was very poorly thought out in terms of what the app was intended to be. Initially I felt I was doing the 
right thing by creating a base object with some fundamental properties like **_icon_**, **_width_**, and **_height_**. But its beginning to appear that I 
took the relationship between devices a bit too far. This is evident in the fact that to accomodate the different types of devices 
(PC, router, switch) I felt forced to implement the property representing connected Devices (**_connectedTo[]_**) as an Array since
routers and switches will have multiple Devices connected to them. When implementing connections then I further deepened the hole i was
digging by defining the **_Connection_** object to be more or less decoupled from devices, thus necessitaing a reference to Connection 
instances, which I hacked via the **_connectionIndex[]_** property of Device which holds a reference to the **_index_** property of 
Connection, which is ultimately the position of that specific Connection instance in the global **_connections[]_** Array. There was 
significant trouble with drawing connections and removing devices requiring several rather awkward nested _for_ constructs and very convoluted logic, 
caused by this unorthodox architecture. A rework is now necessary, and I feel it will include defining separate objects for each type 
of device. Perhaps I may be able to salvage some of the existing Device object moving the more specific properties into separate prototypes (?). 
We'll see.
