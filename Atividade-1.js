import * as THREE from './resources/three.js/r126/three.module.js';


var scene;
var renderer;
var camera;
var triangleMesh;

var rotX = 0.0, rotY = 0.0, rotZ = 0.0;

function main()
{

    

    scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();

    const axis = new THREE.AxesHelper();
	scene.add(axis);

    camera = new THREE.OrthographicCamera( -5.0, 5.0, 5.0, -5.0, -5.0, 5.0 );
	scene.add( camera );

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

	renderer.setSize(500, 500);

	document.getElementById("WebGL-output").appendChild(renderer.domElement);

    const positions 	= [];
	const indices		= [];
    let numPositions = 0;
    let numLines = 0;
    let x;
    let y;
    let z;

    for(let u = -Math.PI; u <= Math.PI; u+= 0.21){
        for(let v = -Math.PI; v <= Math.PI; v+= 0.21){
        x = 2*(Math.sin(3*u) / (2 + Math.cos(v)));
        y = 2*((Math.sin(u) + 2*Math.sin(2*u)) / (2 + Math.cos(v + 2*Math.PI / 3)));
        z =( Math.cos(u) - 2*Math.cos(2*u))*(2 + Math.cos(v))*(2 + Math.cos(v + ((2*Math.PI) / 3)))/4;
        positions.push(x,y,z);
        numPositions++;
        }
        numLines++;
    }

    for(let i = 0; i < numLines; i++){ 
	    for(let j = 0; j < numPositions; j++){

			indices.push((i*numPositions+j)%numPositions, ((i+1)*numPositions+j)%numPositions, ((i+1)*numPositions+j+1)%numPositions ); 
			indices.push( (i*numLines+j)%numPositions, ((i+1)*numLines+j)%numPositions, (i*numLines+(j+1))%numPositions ); 
			
        }
    }



    var triangleGeometry = new THREE.BufferGeometry(); 

    const light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 0, 1 );
    scene.add( light );

    // shadow

    const canvas = document.createElement( 'canvas' );
    canvas.width = 128;
    canvas.height = 128;

    const context = canvas.getContext( '2d' );
    const gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
    gradient.addColorStop( 0.1, 'rgba(210,210,210,1)' );
    gradient.addColorStop( 1, 'rgba(255,255,255,1)' );

    context.fillStyle = gradient;
    context.fillRect( 0, 0, canvas.width, canvas.height );

    const shadowTexture = new THREE.CanvasTexture( canvas );

    const shadowMaterial = new THREE.MeshBasicMaterial( { map: shadowTexture } );
    const shadowGeo = new THREE.PlaneGeometry( 300, 300, 1, 1 );

    let shadowMesh;

    shadowMesh = new THREE.Mesh( shadowGeo, shadowMaterial );
    shadowMesh.position.y = - 250;
    shadowMesh.rotation.x = - Math.PI / 2;
    scene.add( shadowMesh );

    shadowMesh = new THREE.Mesh( shadowGeo, shadowMaterial );
    shadowMesh.position.y = - 250;
    shadowMesh.position.x = - 400;
    shadowMesh.rotation.x = - Math.PI / 2;
    scene.add( shadowMesh );

    shadowMesh = new THREE.Mesh( shadowGeo, shadowMaterial );
    shadowMesh.position.y = - 250;
    shadowMesh.position.x = 400;
    shadowMesh.rotation.x = - Math.PI / 2;
    scene.add( shadowMesh );

    const radius = 200;

    const count = triangleGeometry.attributes.position?.count;
    triangleGeometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array( count * 3 ), 3 ) );


    const color = new THREE.Color();
    const colors1 = triangleGeometry.attributes.color;

    for ( let i = 0; i < count; i ++ ) {

        color.setHSL( ( positions1.getY( i ) / radius + 1 ) / 2, 1.0, 0.5 );
        colors1.setXYZ( i, color.r, color.g, color.b );

        color.setHSL( 0, ( positions2.getY( i ) / radius + 1 ) / 2, 0.5 );
        colors2.setXYZ( i, color.r, color.g, color.b );

        color.setRGB( 1, 0.8 - ( positions3.getY( i ) / radius + 1 ) / 2, 0 );
        colors3.setXYZ( i, color.r, color.g, color.b );

    }

    var triangleMaterial = 	new THREE.MeshBasicMaterial({ wireframe:true, vertexColor:true, });
    

	triangleGeometry.setIndex( indices );
	triangleGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );

    triangleMesh = new THREE.Mesh(triangleGeometry,triangleMaterial); 
    scene.add(triangleMesh);



    requestAnimationFrame(animate);	

}


function animate(time) {

	time *= 0.001;
	const speedX = .1 + 6.0 * .05;
	const speedY = .1 + 3.0 * .05;
	const speedZ = .1 + 2.0 * .05;

	rotX = time * speedX;
	rotY = time * speedY;
	rotZ = time * speedZ;

	triangleMesh.rotation.x = rotX;
	triangleMesh.rotation.y = rotY;
	triangleMesh.rotation.z = rotZ;

	renderer.clear();
	renderer.render(scene, camera);

	requestAnimationFrame(animate);		
}

main()