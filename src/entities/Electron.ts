import { Mesh, MeshBasicMaterial, SphereGeometry, Vector3 } from "three";

export default class Electron {
  angle: number;
  distance: number;
  layer: number;
  size: number;
  body: Mesh<SphereGeometry, MeshBasicMaterial>;
  position: Vector3;

  constructor(angle: number, distance: number, layer: number, position: Vector3) {
    this.angle = angle;
    this.distance = distance;
    this.layer = layer;
    this.size = 0.05;
    this.position = position;

    this.body = new Mesh(new SphereGeometry(this.size, 100, 100), new MeshBasicMaterial({ color: 0x9ae5f3 }));
    this.body.position.copy(position);
  }
}
