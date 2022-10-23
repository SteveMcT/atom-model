import { Color, Scene } from "three";
import { camera } from "./core/controls";
import renderer from "./core/renderer";
import "./styles/dropdown.css";
import "./styles/information-screen.css";
import "./styles/style.css";

import atomList from "./assets/atoms.json";
import updateInformationScreen from "./components/information-screen";
import Atom from "./entities/Atom";
import IJSONAtom from "./entities/IJSONAtom";

import { dropDown } from "./components/atom-dropdown";

let atom: Atom;
let scene = new Scene();

// add the atoms to the dropdown
atomList.map((atom) => {
  const element = document.createElement("option");
  element.innerHTML = `${atom.atomicNumber} ${atom.name}`;
  element.value = atom.name;
  dropDown.appendChild(element);
});
dropDown.addEventListener("change", (e) => updateAtom((e.target! as any).value));

const updateAtom = (name: string) => {
  const atomData = atomList.find((a) => a.name == name)! as unknown as IJSONAtom;
  atom = new Atom(atomData);

  scene.clear().add(atom.group);
  scene.background = new Color(0x1d1d26);

  updateInformationScreen(atomData);
};

function animate() {
  atom.electrons.map((e) => e.update());
  renderer.render(scene, camera);
}

updateAtom("Hydrogen");
renderer.setAnimationLoop(animate);
