import EventEmitter from "events";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as L from "./logic";
import * as U from "./logic/utils";
import { useState } from "react";
import { norm, pi } from "mathjs";
import MouseMeshInteraction from "./three_mmi"
import { CasesSharp } from "@mui/icons-material";
/*
here's where i will put the explanation of every function in the three-app.js file:
- init: this function is called when the page is loaded, it creates the scene, the camera, the renderer, the controls, the lights, the objects, the event listeners, and the animation loop
- animate: this function is called every frame, it updates the camera, the controls, the lights, the objects, and the renderer
- recreateUiPieces : it scambles the rubik cube
- lookupColorForFaceNormal : this function is called when the user changes the color of the ui pieces, it returns the color of the ui pieces
 i think that reset ui pieces is given a cube and it render the  new cube
- scramble : it makes a random cube then it solves it 
axes : green = x; 
*/
const url = new URL(document.location);
const searchParams = url.searchParams;
let colors = [];
let piecesColors = [
  {
    up: "-",
    down: "D",
    left: "L",
    right: "-",
    front: "-",
    back: "B",
  },
  {
    up: "-",
    down: "D",
    left: "L",
    right: "-",
    front: "-",
    back: "-",
  },
  {
    up: "-",
    down: "D",
    left: "L",
    right: "-",
    front: "F",
    back: "-",
  },
  {
    up: "-",
    down: "D",
    left: "L",
    right: "-",
    front: "F",
    back: "-",
  },
  {
    up: "-",
    down: "D",
    left: "L",
    right: "-",
    front: "F",
    back: "-",
  },
  {
    up: "-",
    down: "D",
    left: "L",
    right: "-",
    front: "F",
    back: "-",
  },
  {
    up: "-",
    down: "D",
    left: "L",
    right: "-",
    front: "F",
    back: "-",
  },
  {
    up: "-",
    down: "D",
    left: "L",
    right: "-",
    front: "F",
    back: "-",
  },
  {
    up: "-",
    down: "D",
    left: "L",
    right: "-",
    front: "F",
    back: "-",
  },
  {
    up: "-",
    down: "D",
    left: "L",
    right: "-",
    front: "F",
    back: "-",
  },
  {
    up: "-",
    down: "D",
    left: "L",
    right: "-",
    front: "F",
    back: "-",
  },
  {
    up: "-",
    down: "D",
    left: "L",
    right: "-",
    front: "F",
    back: "-",
  },
  {
    up: "-",
    down: "D",
    left: "L",
    right: "-",
    front: "F",
    back: "-",
  },
  {
    up: "-",
    down: "D",
    left: "L",
    right: "-",
    front: "F",
    back: "-",
  },
  {
    up: "-",
    down: "D",
    left: "L",
    right: "-",
    front: "F",
    back: "-",
  },
  {
    up: "-",
    down: "D",
    left: "L",
    right: "-",
    front: "F",
    back: "-",
  },
  {
    up: "-",
    down: "D",
    left: "L",
    right: "-",
    front: "F",
    back: "-",
  },
  {
    up: "-",
    down: "D",
    left: "L",
    right: "-",
    front: "F",
    back: "-",
  },
  {
    up: "-",
    down: "D",
    left: "L",
    right: "-",
    front: "F",
    back: "-",
  },
  {
    up: "-",
    down: "D",
    left: "L",
    right: "-",
    front: "F",
    back: "-",
  },
  {
    up: "-",
    down: "D",
    left: "L",
    right: "-",
    front: "F",
    back: "-",
  },
  {
    up: "-",
    down: "D",
    left: "L",
    right: "-",
    front: "F",
    back: "-",
  },
  {
    up: "-",
    down: "D",
    left: "L",
    right: "-",
    front: "F",
    back: "-",
  },
  {
    up: "-",
    down: "D",
    left: "L",
    right: "-",
    front: "F",
    back: "-",
  },
  {
    up: "-",
    down: "D",
    left: "L",
    right: "-",
    front: "F",
    back: "-",
  },
  {
    up: "-",
    down: "D",
    left: "L",
    right: "-",
    front: "F",
    back: "-",
  },
];

const queryParamInt = (paramName, min, max, defaultValue) => {
  const clamp = (v) => {
    const localMin = min !== undefined ? min : Number.MIN_SAFE_INTEGER;
    const localMax = max !== undefined ? max : Number.MAX_SAFE_INTEGER;
    return Math.max(localMin, Math.min(localMax, v));
  };
  if (!searchParams.has(paramName)) return clamp(defaultValue);
  const valueString = searchParams.get(paramName);
  const valueInteger = Number(valueString);
  const value = Number.isInteger(valueInteger) ? valueInteger : defaultValue;
  return clamp(value);
};

const COLOR_TABLE = {
  U: new THREE.Color("blue"),
  D: new THREE.Color("green"),
  L: new THREE.Color("red"),
  R: new THREE.Color("darkorange"),
  F: new THREE.Color("yellow"),
  B: new THREE.Color("ghostwhite"),
  "-": new THREE.Color(0x282828),
};
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const PIECE_MATERIAL = new THREE.MeshPhysicalMaterial({
  vertexColors: true,
  metalness: 0.5,
  roughness: 0.1,
  clearcoat: 0.1,
  reflectivity: 0.5,
  side: THREE.DoubleSide,
});

const threeApp = () => {
  const globals = {
    pieceGeometry: undefined,
    cube: undefined,
    renderer: undefined,
    camera: undefined,
    scene: undefined,
    puzzleGroup: undefined,
    animationGroup: undefined,
    axesHelper: undefined,
    controls: undefined,
    clock: undefined,
    animationMixer: undefined,
    cubeSize: 3,
    cubeSizeChanged: true,
    animationSpeed: 750,
    axesEnabled: false,
    color : undefined,
    input : undefined,
  };

  const SETTINGS_CHANGED_EVENT_NAME = "settings-changed";

 

  const eventEmitter = new EventEmitter();

  const addSettingsChangedListener = (listener) =>
    eventEmitter.on(SETTINGS_CHANGED_EVENT_NAME, listener);

  const removeSettingsChangedListener = (listener) =>
    eventEmitter.off(SETTINGS_CHANGED_EVENT_NAME, listener);

  const getSettings = () => {
    return {
      cubeSize: globals.cubeSize,
      animationSpeed: globals.animationSpeed,
      autoRotate: globals.controls.autoRotate,
      autoRotateSpeed: globals.controls.autoRotateSpeed,
      axesEnabled: globals.axesEnabled,
      color: globals.color,
      input: globals.input,
    };
  };

  const emitSettingsChanged = () => {
    eventEmitter.emit(SETTINGS_CHANGED_EVENT_NAME, getSettings());
  };
  
  globals.animationSpeed = queryParamInt("animationSpeed", 100, 1000, 750);
  const NUM_RANDOM_MOVES = queryParamInt("randomMoves", 10, 100, 25);
  const BEFORE_DELAY = queryParamInt("beforeDelay", 0, 5000, 2000);
  const AFTER_DELAY = queryParamInt("afterDelay", 0, 5000, 2000);

  const makeRotationMatrix4 = (rotationMatrix3) => {
    const n11 = rotationMatrix3.get([0, 0]);
    const n12 = rotationMatrix3.get([1, 0]);
    const n13 = rotationMatrix3.get([2, 0]);
    const n21 = rotationMatrix3.get([0, 1]);
    const n22 = rotationMatrix3.get([1, 1]);
    const n23 = rotationMatrix3.get([2, 1]);
    const n31 = rotationMatrix3.get([0, 2]);
    const n32 = rotationMatrix3.get([1, 2]);
    const n33 = rotationMatrix3.get([2, 2]);
    return new THREE.Matrix4().set(
      n11,
      n12,
      n13,
      0,
      n21,
      n22,
      n23,
      0,
      n31,
      n32,
      n33,
      0,
      0,
      0,
      0,
      1
    );
  };

 
  const setInputState = (input) => {
    globals.input = input;
    emitSettingsChanged();
  }

  const loadGeometry = (url) =>
    new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        url,
        (gltf) => {
          const bufferGeometry = gltf.scene.children[0].geometry;
          resolve(bufferGeometry.toNonIndexed());
        },
        undefined,
        reject
      );
    });

  const lookupColorForFaceNormal = (piece, normalX, normalY, normalZ) => {
    if (U.closeTo(normalY, 1)) {
      piecesColors[piece.id].up = piece.faces.up;
      return [piece.faces.up, COLOR_TABLE[piece.faces.up]];
    }
    if (U.closeTo(normalY, -1)) {
      piecesColors[piece.id].down = piece.faces.down;
      return [piece.faces.down, COLOR_TABLE[piece.faces.down]];
    }
    if (U.closeTo(normalX, -1)) {
      piecesColors[piece.id].left = piece.faces.left;
      return [piece.faces.left, COLOR_TABLE[piece.faces.left]];
    }
    if (U.closeTo(normalX, 1)) {
      piecesColors[piece.id].right = piece.faces.right;
      return [piece.faces.right, COLOR_TABLE[piece.faces.right]];
    }
    if (U.closeTo(normalZ, 1)) {
      piecesColors[piece.id].front = piece.faces.front;
      return [piece.faces.front, COLOR_TABLE[piece.faces.front]];
    }
    if (U.closeTo(normalZ, -1)) {
      piecesColors[piece.id].back = piece.faces.back;
      return [piece.faces.back, COLOR_TABLE[piece.faces.back]];
    }
    return ["-", COLOR_TABLE["-"]];
  };
  const lookupColorWhite = (piece, color, normalX, normalY, normalZ) => {
    if (
      U.closeTo(normalY, 1) ||
      U.closeTo(normalY, -1) ||
      U.closeTo(normalX, -1) ||
      U.closeTo(normalX, 1) ||
      U.closeTo(normalZ, 1) ||
      U.closeTo(normalZ, -1)
    ) {
      piecesColors[piece.id].back = "B";
      piecesColors[piece.id].front = "B";
      piecesColors[piece.id].left = "B";
      piecesColors[piece.id].right = "B";
      piecesColors[piece.id].up = "B";
      piecesColors[piece.id].down = "B";
      return COLOR_TABLE[piecesColors[piece.id].back];
    }

    return COLOR_TABLE["-"];
  };
  const lookupColor = (piece, normalX, normalY, normalZ) => {
    if (U.closeTo(normalY, 1)) {
      return COLOR_TABLE[piecesColors[piece.id].up];
    }
    if (U.closeTo(normalY, -1)) {
      return  COLOR_TABLE[piecesColors[piece.id].down];
    }
    if (U.closeTo(normalX, -1)) {
      return COLOR_TABLE[piecesColors[piece.id].left];
    }
    if (U.closeTo(normalX, 1)) {
      return COLOR_TABLE[piecesColors[piece.id].right];
    }
    if (U.closeTo(normalZ, 1)) {
      return  COLOR_TABLE[piecesColors[piece.id].front];
    }
    if (U.closeTo(normalZ, -1)) {
     
      return  COLOR_TABLE[piecesColors[piece.id].back];
    }
    return COLOR_TABLE["-"];
  };

  const setGeometryVertexColors = (piece) => {
    const pieceGeoemtry = globals.pieceGeometry.clone();
    const normalAttribute = pieceGeoemtry.getAttribute("normal");

    const colors = [];

    for (
      let normalIndex = 0;
      normalIndex < normalAttribute.count;
      normalIndex += 3
    ) {
      let arrayIndex = normalIndex * normalAttribute.itemSize;
      const normalX = normalAttribute.array[arrayIndex++];
      const normalY = normalAttribute.array[arrayIndex++];
      const normalZ = normalAttribute.array[arrayIndex++];
      const color = lookupColorForFaceNormal(
        piece,
        normalX,
        normalY,
        normalZ
      )[1];
      colors.push(color.r, color.g, color.b);
      colors.push(color.r, color.g, color.b);
      colors.push(color.r, color.g, color.b);
    }
    //get the color of every piece in the cube

    pieceGeoemtry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );
    return pieceGeoemtry;
  };

  const setNewGeometryVertexColor = (piece) => {
    const pieceGeoemtry = globals.pieceGeometry.clone();
    const normalAttribute = pieceGeoemtry.getAttribute("normal");

    colors = [];
    for (
      let normalIndex = 0;
      normalIndex < normalAttribute.count;
      normalIndex += 3
    ) {
      let arrayIndex = normalIndex * normalAttribute.itemSize;
      const normalX = normalAttribute.array[arrayIndex++];
      const normalY = normalAttribute.array[arrayIndex++];
      const normalZ = normalAttribute.array[arrayIndex++];
      const ncolor = lookupColor(piece, normalX, normalY, normalZ);
      colors.push(ncolor.r, ncolor.g, ncolor.b);
      colors.push(ncolor.r, ncolor.g, ncolor.b);
      colors.push(ncolor.r, ncolor.g, ncolor.b);
    }
    pieceGeoemtry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );
    return pieceGeoemtry;
  };
  const recreateUiPieces = () => {
    globals.cube = L.getSolvedCube(globals.cubeSize);
    createUiPieces();
  };

  const createUiPieces = () => {
    globals.cube.forEach((piece) => {
      const uiPiece = createUiPiece(piece);
      globals.puzzleGroup.add(uiPiece);
    });
    console.log(piecesColors);
  };

  const createUiPiecesWhite = () => {
    globals.cube.forEach((piece) => {
      const color = COLOR_TABLE[piecesColors[piece.id]];
      const uiPiece = createWhitePiece(piece, color);
      globals.puzzleGroup.add(uiPiece);
    });
  };
  const createUiPiecesInput = () => {
    globals.cube.forEach((piece) => {
      const uiPiece = createPiece(piece);
      globals.puzzleGroup.add(uiPiece);
    });
  };
  

  const createWhitePiece = (piece, color) => {
    const pieceGeometryWithColors = setGeometrywhite(piece, color);
    const uiPiece = new THREE.Mesh(pieceGeometryWithColors, PIECE_MATERIAL);
    uiPiece.name = "piece";

    uiPiece.scale.set(0.5, 0.5, 0.5);
    uiPiece.userData = piece.id;
    resetUiPiece(uiPiece, piece);
    return uiPiece;
  };
  const createPiece = (piece) => {
    const pieceGeometryWithColors = setNewGeometryVertexColor(piece);
    const uiPiece = new THREE.Mesh(pieceGeometryWithColors, PIECE_MATERIAL);
    uiPiece.name = "piece";
    uiPiece.scale.set(0.5, 0.5, 0.5);
    uiPiece.userData = piece.id;
    resetUiPiece(uiPiece, piece);
    return uiPiece;
  };

  const createUiPiece = (piece) => {
    const pieceGeometryWithColors = setGeometryVertexColors(piece);
    const uiPiece = new THREE.Mesh(pieceGeometryWithColors, PIECE_MATERIAL);
 uiPiece.name = "piece";
    uiPiece.scale.set(0.5, 0.5, 0.5);
    uiPiece.userData = piece.id;
    resetUiPiece(uiPiece, piece);
    return uiPiece;
  };

  const resetUiPiece = (uiPiece, piece) => {
    const isEvenSizedCube = globals.cubeSize % 2 === 0;
    const adjustValue = (v) =>
      isEvenSizedCube ? (v < 0 ? v + 0.5 : v - 0.5) : v;
    uiPiece.position.x = adjustValue(piece.x);
    uiPiece.position.y = adjustValue(piece.y);
    uiPiece.position.z = adjustValue(piece.z);
    uiPiece.setRotationFromMatrix(makeRotationMatrix4(piece.accTransform3));
  };

  const findUiPiece = (piece) =>
    globals.puzzleGroup.children.find((child) => child.userData === piece.id);

  const resetUiPieces = (cube) => {
    cube.forEach((piece) => {
      const uiPiece = findUiPiece(piece);
      resetUiPiece(uiPiece, piece);
    });
  };
  //function to input cube colors from user
  const inputCube = (id , normal) => {
    //still figuringid out how to get the colors from the user
    id --;
    var color = ""
    console.log(id);
    switch(globals.color){
      case "white":
        color = "B";
        break;
      case "blue":
        color = "U";
        break;
      case "green":
        color = "D";
        break;
      case "red":
        color = "L";
        break;
      case "orange":
        color = "R";
        break;
      default:
        color = "F";
        break;}
     const newId = id + 1;   
     if (newId !== 5 && newId !==11&& newId !==13 && newId !==14 && newId!==16 && newId !==22 ){
      addColor(id, color , normal);
      createUiPiecesInput();  }   
    
  };
  const getColorsForInput = () => {
    var out =""
   const outL = piecesColors[6].back + piecesColors[3].back + piecesColors[0].back + piecesColors[14].back+ piecesColors[12].back+ piecesColors[9].back+ piecesColors[23].back+ piecesColors[20].back+piecesColors[17].back
    const outF = piecesColors[8].left+ piecesColors[5].left + piecesColors[2].left+ piecesColors[7].left+ piecesColors[4].left+ piecesColors[1].left+ piecesColors[6].left+ piecesColors[3].left+ piecesColors[0].left
  const outR = piecesColors[25].front+ piecesColors[22].front + piecesColors[19].front+ piecesColors[16].front+ piecesColors[13].front+ piecesColors[11].front+ piecesColors[8].front+ piecesColors[5].front+ piecesColors[2].front
    const outB= piecesColors[23].right+ piecesColors[20].right + piecesColors[17].right+ piecesColors[24].right+ piecesColors[21].right+ piecesColors[18].right+ piecesColors[25].right+ piecesColors[22].right+ piecesColors[19].right
    const outD = piecesColors[0].down+ piecesColors[1].down + piecesColors[2].down+ piecesColors[9].down+ piecesColors[10].down+ piecesColors[11].down+ piecesColors[17].down+ piecesColors[18].down+ piecesColors[19].down
    const outU = piecesColors[8].up+ piecesColors[7].up + piecesColors[6].up+ piecesColors[16].up+ piecesColors[15].up+ piecesColors[14].up+ piecesColors[25].up+ piecesColors[24].up+ piecesColors[23].up
  out = outL + outF + outR + outB + outD + outU;
 
  for (let i = 0; i < out.length; i++) {
    if (out[i] === "B") {
      out = out.replace("B", "w");

    }
    if (out[i] === "U") {
      out = out.replace("U", "b");    }
    if (out[i] === "D") {
      out = out.replace("D", "g");    }
    if (out[i] === "L") {
      out = out.replace("L", "r");    }
    if (out[i] === "R" ) {
      out = out.replace("R", "o");    }
    if (out[i] === "F") {
      out = out.replace("F", "y");    }
  }
  console.log(outR);
    return out;
  }
  const addColor = (pieceId, colorName , normal) => {
  const normalY = normal.y;
  const normalX = normal.x;
  const normalZ = normal.z;
     if (normalY === 1) {
      piecesColors[pieceId].up =colorName 
    }
    if (normalY ===-1) {
      piecesColors[pieceId].down =colorName
    }
    if (normalX === -1) {
      piecesColors[pieceId].left = colorName;
    }
    if (normalX === 1) {
      piecesColors[pieceId].right = colorName;
   
    }
    if (normalZ === 1) {
      piecesColors[pieceId].front = colorName;
    }
    if (normalZ === -1) {
      piecesColors[pieceId].back = colorName ; 
    }
    }
  const emptycube = () => {
    createUiPiecesWhite();
  };

  const setGeometrywhite = (piece, piececolor) => {
    const pieceGeoemtry = globals.pieceGeometry.clone();
    const normalAttribute = pieceGeoemtry.getAttribute("normal");
    colors = [];

    for (
      let normalIndex = 0;
      normalIndex < normalAttribute.count;
      normalIndex += 3
    ) {
      let arrayIndex = normalIndex * normalAttribute.itemSize;
      const normalX = normalAttribute.array[arrayIndex++];
      const normalY = normalAttribute.array[arrayIndex++];
      const normalZ = normalAttribute.array[arrayIndex++];

      if (
        (piece.x === 0 && piece.y === 1 && piece.z === 0) ||
        (piece.x === 0 && piece.y === -1 && piece.z === 0) ||
        (piece.x === -1 && piece.y === 0 && piece.z === 0) ||
        (piece.x === 1 && piece.y === 0 && piece.z === 0) ||
        (piece.x === 0 && piece.y === 0 && piece.z === 1) ||
        (piece.x === 0 && piece.y === 0 && piece.z === -1)
      ) { 
        const color = lookupColorForFaceNormal(
          piece,
          normalX,
          normalY,
          normalZ
        )[1];
        colors.push(color.r, color.g, color.b);
        colors.push(color.r, color.g, color.b);
        colors.push(color.r, color.g, color.b);
      } else {
        const color = lookupColorWhite(
          piece,
          piececolor,
          normalX,
          normalY,
          normalZ
        );
        colors.push(color.r, color.g, color.b);
        colors.push(color.r, color.g, color.b);
        colors.push(color.r, color.g, color.b);
      }
    }

    pieceGeoemtry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );
    return pieceGeoemtry;
  };
 
  const animate = () => {
    window.requestAnimationFrame(animate);
    globals.controls.update();
    const delta = globals.clock.getDelta() * globals.animationMixer.timeScale;
    globals.animationMixer.update(delta);
  
    globals.renderer.render(globals.scene, globals.camera);
  };
 
  function onClick(event) {
    console.log(getColorsForInput());
    if(globals.input){
    raycaster.setFromCamera(pointer, globals.camera);
    let intersects = raycaster.intersectObjects(globals.scene.children);
    if (intersects.length >0 &&intersects[0].object.name === "piece") {
      inputCube(intersects[0].object.geometry.id -3 , intersects[0].face.normal);
      return;
    }}}
  
   
  const movePiecesBetweenGroups = (uiPieces, fromGroup, toGroup) => {
    if (uiPieces.length) {
      fromGroup.remove(...uiPieces);
      toGroup.add(...uiPieces);
    }
  };
  function onPointerMove( event ) {


  
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  
  }

  const createAnimationClip = (move) => {
    const numTurns = move.numTurns;
    const t0 = 0;
    const t1 = numTurns * (globals.animationSpeed / 1000);
    const times = [t0, t1];
    const values = [];
    const startQuaternion = new THREE.Quaternion();
    const endQuaternion = new THREE.Quaternion();
    const rotationMatrix3 = move.rotationMatrix3;
    const rotationMatrix4 = makeRotationMatrix4(rotationMatrix3);
    endQuaternion.setFromRotationMatrix(rotationMatrix4);
    startQuaternion.toArray(values, values.length);
    endQuaternion.toArray(values, values.length);
    const duration = -1;
    const tracks = [
      new THREE.QuaternionKeyframeTrack(".quaternion", times, values),
    ];
    return new THREE.AnimationClip(move.id, duration, tracks);
  };

  const animateMoves = (moves, nextMoveIndex = 0) => {
    if (globals.cubeSizeChanged) {
      return setTimeout(scramble, 0);
    }

    const move = moves[nextMoveIndex];

    if (!move) {
      return setTimeout(scramble, AFTER_DELAY);
    }

    const pieces = L.getPieces(globals.cube, move.coordsList);
    const uiPieces = pieces.map(findUiPiece);
    movePiecesBetweenGroups(
      uiPieces,
      globals.puzzleGroup,
      globals.animationGroup
    );

    const onFinished = () => {
      globals.animationMixer.removeEventListener("finished", onFinished);
      movePiecesBetweenGroups(
        uiPieces,
        globals.animationGroup,
        globals.puzzleGroup
      );
      globals.cube = move.makeMove(globals.cube);
      const rotationMatrix3 = move.rotationMatrix3;
      const rotationMatrix4 = makeRotationMatrix4(rotationMatrix3);
      for (const uiPiece of uiPieces) {
        uiPiece.applyMatrix4(rotationMatrix4);
      }
      animateMoves(moves, nextMoveIndex + 1);
    };

    globals.animationMixer.addEventListener("finished", onFinished);

    const animationClip = createAnimationClip(move);
    const clipAction = globals.animationMixer.clipAction(
      animationClip,
      globals.animationGroup
    );
    clipAction.setLoop(THREE.LoopOnce);
    clipAction.play();
  };

  const showSolutionByCheating = (randomMoves) => {
    const solutionMoves = randomMoves
      .map((move) => move.oppositeMoveId)
      .map((id) => L.lookupMoveId(globals.cubeSize, id))
      .reverse();
    console.log(
      `solution moves: ${solutionMoves.map((move) => move.id).join(" ")}`
    );
    animateMoves(solutionMoves);
  };

  const scramble = () => {
    if (globals.cubeSizeChanged) {
      globals.cubeSizeChanged = false;
      globals.puzzleGroup.clear();
      globals.animationGroup.clear();
      globals.controls.reset();
      const cameraX = globals.cubeSize + 1;
      const cameraY = globals.cubeSize + 1;
      const cameraZ = globals.cubeSize * 4;
      globals.camera.position.set(cameraX, cameraY, cameraZ);
      globals.camera.lookAt(new THREE.Vector3(0, 0, 0));
      recreateUiPieces();
    }
    // here i will put the logic of the moves
    const randomMoves = U.range(NUM_RANDOM_MOVES).map(() =>
      L.getRandomMove(globals.cubeSize)
    );
    L.removeRedundantMoves(randomMoves);
    console.log(
      `random moves: ${randomMoves.map((move) => move.id).join(" ")}`
    );
    console.log(L.getSolvedCube(globals.cubeSize));
    globals.cube = L.makeMoves(randomMoves, L.getSolvedCube(globals.cubeSize));
    resetUiPieces(globals.cube);
    setTimeout(showSolutionByCheating, BEFORE_DELAY, randomMoves);
  };

  const init = async () => {
    const container = document.getElementById("visualisation-container");
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    globals.renderer = new THREE.WebGLRenderer({ antialias: true });
    globals.renderer.setPixelRatio(window.devicePixelRatio);
    globals.renderer.setSize(w, h);
    container.appendChild(globals.renderer.domElement);
    globals.input = false;
    window.addEventListener("resize", () => {
      globals.renderer.setSize(container.offsetWidth, container.offsetHeight);
      globals.camera.aspect = container.offsetWidth / container.offsetHeight;
      globals.camera.updateProjectionMatrix();
    });
    window.addEventListener( 'pointermove', onPointerMove );
    window.addEventListener('click', onClick);
    globals.scene = new THREE.Scene();
    globals.scene.background = new THREE.Color(0x000000);
    globals.camera = new THREE.PerspectiveCamera(34, w / h, 1, 100);
    globals.camera.position.set(3, 3, 12);
    globals.camera.lookAt(new THREE.Vector3(0, 0, 0));
    globals.scene.add(globals.camera);

    const LIGHT_COLOR = 0xffffff;
    const LIGHT_INTENSITY = 2;
    const LIGHT_DISTANCE = 4;

    const light1 = new THREE.DirectionalLight(LIGHT_COLOR, LIGHT_INTENSITY);
    light1.position.set(0, 0, LIGHT_DISTANCE);
    globals.scene.add(light1);

    const light2 = new THREE.DirectionalLight(LIGHT_COLOR, LIGHT_INTENSITY);
    light2.position.set(0, 0, -LIGHT_DISTANCE);
    globals.scene.add(light2);

    const light3 = new THREE.DirectionalLight(LIGHT_COLOR, LIGHT_INTENSITY);
    light3.position.set(0, LIGHT_DISTANCE, 0);
    globals.scene.add(light3);

    const light4 = new THREE.DirectionalLight(LIGHT_COLOR, LIGHT_INTENSITY);
    light4.position.set(0, -LIGHT_DISTANCE, 0);
    globals.scene.add(light4);

    const light5 = new THREE.DirectionalLight(LIGHT_COLOR, LIGHT_INTENSITY);
    light5.position.set(LIGHT_DISTANCE, 0, 0);
    globals.scene.add(light5);

    const light6 = new THREE.DirectionalLight(LIGHT_COLOR, LIGHT_INTENSITY);
    light6.position.set(-LIGHT_DISTANCE, 0, 0);
    globals.scene.add(light6);

    globals.puzzleGroup = new THREE.Group();
    globals.scene.add(globals.puzzleGroup);

    globals.animationGroup = new THREE.Group();
    globals.scene.add(globals.animationGroup);

    globals.controls = new OrbitControls(
      globals.camera,
      globals.renderer.domElement
    );
    globals.controls.minDistance = 5.0;
    globals.controls.maxDistance = 40.0;
    globals.controls.enableDamping = true;
    globals.controls.dampingFactor = 0.9;
    globals.controls.autoRotate = true;
    globals.controls.autoRotateSpeed = 1.0;

    globals.clock = new THREE.Clock();
    globals.animationMixer = new THREE.AnimationMixer();

    globals.cube = L.getSolvedCube(globals.cubeSize);
    globals.pieceGeometry = await loadGeometry(
      "/rubiks-cube/cube-bevelled.glb"
    );
    createUiPieces();
    setCubeSize(3);
    animate();
    const onDocumentKeyDownHandler = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.ShiftKey) return;
      switch (e.key) {
        case "a":
          return toggleAxes();
        case "r":
          return toggleAutoRotate();
        default:
          return;
      }
    };
   
    document.addEventListener("keydown", onDocumentKeyDownHandler);
  };

  const addAxesHelper = () => {
    globals.axesHelper = new THREE.AxesHelper(5);
    globals.scene.add(globals.axesHelper);
  };

  const removeAxesHelper = () => {
    globals.scene.remove(globals.axesHelper);
    globals.axesHelper = undefined;
  };

  const setCubeSize = (value) => {
    globals.cubeSizeChanged = value !== globals.cubeSize;
    globals.cubeSize = value;

    emitSettingsChanged();
  };

  const setAnimationSpeed = (value) => {
    globals.animationSpeed = value;
    emitSettingsChanged();
  };

  const setAutoRotate = (value) => {
    globals.controls.autoRotate = value;
    emitSettingsChanged();
  };

  const setAutoRotateSpeed = (value) => {
    globals.controls.autoRotateSpeed = value;
    emitSettingsChanged();
  };
  const setColor= (value) => {
    globals.color = value;
    emitSettingsChanged();
  }
  const setAxesEnabled = (value) => {
    globals.axesEnabled = value;
    globals.axesEnabled ? addAxesHelper() : removeAxesHelper();
    emitSettingsChanged();
  };

  const toggleAxes = () => {
    setAxesEnabled(!globals.axesEnabled);
  };

  const toggleAutoRotate = () => {
    setAutoRotate(!globals.controls.autoRotate);
  };

  return {
    init,
    addSettingsChangedListener,
    removeSettingsChangedListener,
    setCubeSize,
    setAnimationSpeed,
    setAutoRotate,
    setAutoRotateSpeed,
    setAxesEnabled,
    getSettings,
    inputCube,
    setColor,
    emptycube,
    setInputState,
  };
};

export default threeApp;
