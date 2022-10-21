import { Scene } from "three";
import atom from "./Atom";
import { camera } from "./core/controls";
import renderer from "./core/renderer";
import "./style.css";

const scene = new Scene();
scene.add(atom.group);

renderer.setAnimationLoop(animation);
function animation() {
  renderer.render(scene, camera);
}
