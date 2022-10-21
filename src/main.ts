import { Scene } from "three";
import { camera } from "./core/controls";
import renderer from "./core/renderer";
import "./styles/dropdown.css";
import "./styles/style.css";

import atoms from "./assets/atoms.json";
import { generateAtom } from "./Atom";

const dropDownElement = document.createElement("select");
dropDownElement.id = "select-atoms";
dropDownElement.name = "select-atoms";
dropDownElement.value = "Hydrogen";
const dropDown = document.body.appendChild(dropDownElement);

atoms.map((a) => {
  const element = document.createElement("option");
  element.innerHTML = a.name;
  element.value = a.name;
  dropDown.appendChild(element);
});

let scene = new Scene();
let atom = generateAtom("Hydrogen");
scene.add(atom.group);

dropDown.addEventListener("change", (e) => {
  const name = (e.target! as any).value;

  scene = new Scene();
  atom = generateAtom(name);
  scene.add(atom.group);
});

renderer.setAnimationLoop(animation);
function animation() {
  atom.electrons.map((e) => {
    e.angle += e.layer / 400;
    e.position.x = Math.cos(e.angle) * e.distance;
    e.position.y = Math.sin(e.angle) * e.distance;
    e.body.position.set(e.position.x, e.position.y, e.position.z);
  });

  renderer.render(scene, camera);
}
