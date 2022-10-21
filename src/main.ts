import { Color, Scene } from "three";
import { camera } from "./core/controls";
import renderer from "./core/renderer";
import "./styles/dropdown.css";
import "./styles/style.css";

import atomList from "./assets/atoms.json";
import { generateAtom } from "./Atom";
import AtomGenerator from "./entities/AtomGenerator";

let atom: AtomGenerator;
let scene = new Scene();

const dropDownElement = document.createElement("select");
const dropDown = document.body.appendChild(dropDownElement);

dropDownElement.id = "select-atoms";
dropDownElement.name = "select-atoms";
dropDownElement.value = "Hydrogen";
dropDown.addEventListener("change", (e) => updateAtom((e.target! as any).value));

// add the atoms to the dropdown
atomList.map((atom) => {
  const element = document.createElement("option");
  element.innerHTML = atom.name;
  element.value = atom.name;
  dropDown.appendChild(element);
});

const updateAtom = (name: string) => {
  atom = generateAtom(name);
  scene.clear();
  scene.add(atom.group);
  scene.background = new Color(0x1d1d26);
};

function animation() {
  if (atom) {
    atom.electrons.map((e) => {
      e.angle += e.layer / 400;
      e.position.x = Math.cos(e.angle) * e.distance;
      e.position.y = Math.sin(e.angle) * e.distance;
      e.body.position.copy(e.position);
    });
  }

  renderer.render(scene, camera);
}

updateAtom("Hydrogen");
renderer.setAnimationLoop(animation);
