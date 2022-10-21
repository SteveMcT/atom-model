import { Mesh, MeshBasicMaterial, SphereGeometry, Vector3 } from "three";

export default interface IElectron {
  id: number;

  angle: number;
  distance: number;
  layer: number;

  body: Mesh<SphereGeometry, MeshBasicMaterial>;
  position: Vector3;
}
