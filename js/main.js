
var container;
var camera, scene, renderer;
var imagedata;
var spotlight;
var sphere;
var geometry;
var loader = new THREE.TextureLoader();
var clock = new THREE.Clock();
var light;
var keyboard = new THREEx.KeyboardState();

var ind = -1;
var alph = 0.0;

var lineM;

var planets = [];

init();
animate();


function init()
{
    
    container = document.getElementById('container');
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
    
    camera.position.set(0, 50, 100);
    camera.lookAt(new THREE.Vector3(0, 0.0, 0));
    
    renderer = new THREE.WebGLRenderer({antialias: false});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0000ff, 1);

    container.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);
   
    addSun();
    addStars();
    addPlanet(3,16, "js/pics/mercurymap.jpg", "mercury", null,2.5,1,"js/pics/mercurybump.jpg",null);
    addPlanet(4,26, "js/pics/venusmap.jpg", "venus", null,2,1,"js/pics/venusbump.jpg",null);
    addPlanet(4.5,37, "js/pics/earthmap1k.jpg", "earth",  addMoon(1.5, 6.5,  "js/pics/moonmap1k.jpg",5,5,"js/pics/moonbump1k.jpg"),1.5,1,"js/pics/earthbump1k.jpg",createEarthCloud());
    addPlanet(3.5,49, "js/pics/marsmap1k.jpg", "mars", null, 1,1,"js/pics/marsbump1k.jpg",null);

    spotlight = new THREE.PointLight(0xffffff);
    spotlight.position.set(0, 0, 0);
    scene.add(spotlight);

    light = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( light );
}

function onWindowResize()
{
 camera.aspect = window.innerWidth / window.innerHeight;
 camera.updateProjectionMatrix();
 renderer.setSize(window.innerWidth, window.innerHeight);
}



function animate()
{    
    requestAnimationFrame(animate);
    render();

    var delta = clock.getDelta();

    for (var i = 0; i < planets.length; i++) {
        var m = new THREE.Matrix4();
        var m1 = new THREE.Matrix4();
        var m2 = new THREE.Matrix4();
        var m3 = new THREE.Matrix4();
        

        planets[i].a1 += planets[i].v1 * delta;
        planets[i].a2 += planets[i].v2 * delta;

        m1.makeRotationY( planets[i].a1 );
        m3.makeRotationY( planets[i].a2 );
        m2.setPosition(new THREE.Vector3(planets[i].posX, 0, 0));

        m.multiplyMatrices( m1, m2 );
        m.multiplyMatrices( m, m3 );

        planets[i].sphere.matrix = m;
        planets[i].sphere.matrixAutoUpdate = false;

        if (keyboard.pressed("0"))
        {
            ind = -1;
            camera.position.set(0, 50, 100);
            camera.lookAt(new THREE.Vector3(0, 0.0, 0));

        }
        
        if (keyboard.pressed("1"))
        {
            ind = 0;
        }
        if (keyboard.pressed("2"))
        {
            ind = 1;
        }
        if (keyboard.pressed("3"))
        {
            ind = 2;
        }
        if (keyboard.pressed("4"))
        {
            ind = 3;
        }

        if(ind != -1)
        {
            var m = new THREE.Matrix4();
            m.copyPosition(planets[ind].sphere.matrix);
                    
            pos = new THREE.Vector3(0, 0, 0);
            pos.setFromMatrixPosition(m);

            var x = pos.x + planets[ind].r * 6 * Math.cos(-planets[ind].a1 + alph);
            var z = pos.z + planets[ind].r * 6 * Math.sin(-planets[ind].a1 + alph);
            camera.position.set(planets[ind].posX, 50, 50);

            camera.position.set(x, 25, z);
                                        
            camera.lookAt(pos);
        
        }

        if (keyboard.pressed("A"))
        {
            alph += 0.5 * delta;
        }

        if (keyboard.pressed("D"))
        {
            alph -= 0.5 * delta;
        }

        if(planets[i].sat != null){
            var mm = new THREE.Matrix4();
            var mm1 = new THREE.Matrix4();
            var mm2 = new THREE.Matrix4();
            var mm3 = new THREE.Matrix4();
            var mm4 = new THREE.Matrix4();
            mm4.copyPosition(planets[i].sphere.matrix);

            planets[i].sat.a1 += planets[i].sat.v1 * delta;
            planets[i].sat.a2 += planets[i].sat.v2 * delta;
    
            mm1.makeRotationY( planets[i].sat.a1 );
            mm3.makeRotationY( planets[i].sat.a2 );
            mm2.setPosition(new THREE.Vector3(planets[i].sat.posX, 0, 0));
            
    
            mm.multiplyMatrices( mm3, mm2 );
            mm.multiplyMatrices( mm, mm1 );
            mm.multiplyMatrices( mm4, mm );
    

            planets[i].sat.sphere.matrix = mm;
            planets[i].sat.sphere.matrixAutoUpdate = false;

           // console.log(planets[i].sat.lineM);
            planets[i].sat.lineM.matrix.copyPosition(planets[i].sphere.matrix);
            planets[i].sat.lineM.matrixAutoUpdate = false;
        }

         if(planets[i].cloud != null){
            
            var m = new THREE.Matrix4();
            m.copyPosition(planets[i].sphere.matrix);

            var pos = new THREE.Vector3(0, 0, 0);
            pos.setFromMatrixPosition(m);

            console.log(pos);
            planets[i].cloud.position.copy(pos);
                               
            /*pos = new THREE.Vector3(0, 0, 0);
            pos.setFromMatrixPosition(m);

            var x = pos.x + planets[i].r * 6 * Math.cos(-planets[i].a1);
            var z = pos.z + planets[i].r * 6 * Math.sin(-planets[i].a1);
            planets[i].cloud.position.set(planets[i].posX, 50, 50);

            planets[i].cloud.position.set(x, 0, z);*/
                                        
           
         }
        
       
    }

    /*var clock = new THREE.Clock();
    var delta = clock.getDelta();*/

   /* alpha += 0.01;
    


    var x = N/2 + N*Math.cos(alpha);
    var y = 0 + N*Math.sin(alpha);

    spotlight.position.set(x, y, N/2);
    sphere.position.copy(spotlight.position);

*/

}
function render()
{
    renderer.render(scene, camera);
}

function addPlanet(r, pos, tex, name, sat, v1, v2, bumptex, cloud)
{
    //создание геометрии сферы
    var geometry = new THREE.SphereGeometry( r, 32, 32 );
    //загрузка текстуры
    var tex = loader.load( tex );
    tex.minFilter = THREE.NearestFilter;
    //создание материала
  /*  var material = new THREE.MeshLambertMaterial({
    map: tex,
    side: THREE.DoubleSide
    });*/
    //загрузка карты высот
    var bumptex = loader.load( bumptex );
    bumptex.minFilter = THREE.NearestFilter;
    //назначение карты и масштабирования высот
    var material = new THREE.MeshPhongMaterial({
        map: tex,
        bumpMap: bumptex,
        bumpScale: 0.05,
        side: THREE.DoubleSide
    });

    //создание объекта
    var sphere = new THREE.Mesh( geometry, material );
    sphere.position.x = pos;
    //размещение объекта в сцене
    scene.add( sphere );

    var planet = {};

    planet.sphere = sphere;
    planet.posX = pos;
    planet.name = name;
    planet.sat = sat;
    planet.cloud = cloud;
    
    planet.r = r;

    planet.v1  = v1;
    planet.v2 = v2;
    planet.a1 = 0.0;
    planet.a2 = 0.0;

    planets.push(planet);
    addLine(0,0,pos);

   
}

function addMoon(r, pos,  tex, v1, v2, bumptex)
{
    //создание геометрии сферы
    var geometry = new THREE.SphereGeometry( r, 32, 32 );
    //загрузка текстуры
    var tex = loader.load( tex );
    tex.minFilter = THREE.NearestFilter;

    //создание материала
    /*var material = new THREE.MeshLambertMaterial({
        map: tex,
        side: THREE.DoubleSide
    });*/

    var bumptex = loader.load( bumptex );
    bumptex.minFilter = THREE.NearestFilter;
    //назначение карты и масштабирования высот
    var material = new THREE.MeshPhongMaterial({
    map: tex,
    bumpMap: bumptex,
    bumpScale: 0.05,
    side: THREE.DoubleSide
    });

    //создание объекта
    var sphere = new THREE.Mesh( geometry, material );
    sphere.position.x = pos; 

    //размещение объекта в сцене
    scene.add( sphere );

    var sat = {};
    sat.sphere = sphere;
    sat.posX = pos;
    sat.v1 = v1;
    sat.v2 = v2;
    sat.a1 = 0.0;
    sat.a2 = 0.0;

    sat.lineM = addLine(0,0,pos);
    return sat;
    
}

function addSun()
{
    geometry = new THREE.SphereGeometry( 10, 32, 32 );

        var tex = loader.load( "js/pics/sunmap.jpg" );
        tex.minFilter = THREE.NearestFilter;

        var material = new THREE.MeshBasicMaterial({
        map: tex,
        side: THREE.DoubleSide
    });
    var sphere = new THREE.Mesh( geometry, material );
    scene.add( sphere );
}

function addStars()
{
    geometry = new THREE.SphereGeometry( 1000, 32, 32 );

        var tex = loader.load( "js/pics/starmap.jpg" );
        tex.minFilter = THREE.NearestFilter;

        var material = new THREE.MeshBasicMaterial({
        map: tex,
        side: THREE.DoubleSide
    });
    var sphere = new THREE.Mesh( geometry, material );
    scene.add( sphere );
}

function addLine(x, z, r)
{
    var lineGeometry = new THREE.Geometry();
    var vertArray = lineGeometry.vertices;
    //начало сегмента линии

    for(var i = 0; i <360; i++)
        vertArray.push(new THREE.Vector3( x + r * Math.cos(i*Math.PI/180), 0 , z + r * Math.sin(i*Math.PI/180) ));
   
    var lineMaterial = new THREE.LineDashedMaterial( { color: 0xFFFFFF, dashSize: 1, gapSize:1 } );
    var line = new THREE.Line( lineGeometry, lineMaterial );
    line.computeLineDistances();
    scene.add(line);

    return line;
}

function createEarthCloud()
{
 // create destination canvas
 var canvasResult = document.createElement('canvas');
 canvasResult.width = 1024;
 canvasResult.height = 512;
 var contextResult = canvasResult.getContext('2d');
 // load earthcloudmap
 var imageMap = new Image();
 imageMap.addEventListener("load", function()
 {

 // create dataMap ImageData for earthcloudmap
 var canvasMap = document.createElement('canvas');
 canvasMap.width = imageMap.width;
 canvasMap.height = imageMap.height;
 var contextMap = canvasMap.getContext('2d');
 contextMap.drawImage(imageMap, 0, 0);
 var dataMap = contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height);
 // load earthcloudmaptrans
 var imageTrans = new Image();
 imageTrans.addEventListener("load", function()
 {
 // create dataTrans ImageData for earthcloudmaptrans
 var canvasTrans = document.createElement('canvas');
 canvasTrans.width = imageTrans.width;
 canvasTrans.height = imageTrans.height;
 var contextTrans = canvasTrans.getContext('2d');
 contextTrans.drawImage(imageTrans, 0, 0);
 var dataTrans = contextTrans.getImageData(0, 0, canvasTrans.width,
canvasTrans.height);
 // merge dataMap + dataTrans into dataResult
 var dataResult = contextMap.createImageData(canvasMap.width, canvasMap.height);
 for(var y = 0, offset = 0; y < imageMap.height; y++)
 for(var x = 0; x < imageMap.width; x++, offset += 4)
 {
 dataResult.data[offset+0] = dataMap.data[offset+0];
 dataResult.data[offset+1] = dataMap.data[offset+1];
 dataResult.data[offset+2] = dataMap.data[offset+2];
 dataResult.data[offset+3] = 255-dataTrans.data[offset+0];
 }
 // update texture with result
 contextResult.putImageData(dataResult,0,0)
 material.map.needsUpdate = true;
 });

 imageTrans.src = 'js/pics/earthcloudmaptrans.jpg';
 }, false);

 imageMap.src = 'js/pics/earthcloudmap.jpg';

 var geometry = new THREE.SphereGeometry(4.6, 32, 32);
 var material = new THREE.MeshPhongMaterial({
 map: new THREE.Texture(canvasResult),
 side: THREE.DoubleSide,
 transparent: true,
 opacity: 0.8,
 });

 var mesh = new THREE.Mesh(geometry, material);
 scene.add(mesh);
 return mesh;
}
