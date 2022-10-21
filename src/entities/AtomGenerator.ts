import { DoubleSide, Group, Mesh, MeshBasicMaterial, RingGeometry, SphereGeometry, Vector3 } from "three";
import IAtom from "./IAtom";
import IElectron from "./IElectron";

export default class AtomGenerator extends IAtom {
  layers: number = 0;
  electrons: IElectron[] = [];
  rings: Mesh<RingGeometry, MeshBasicMaterial>[] = [];
  group = new Group();

  constructor(props: IAtom) {
    super(props);
    this.generateLayers(props);
    const electrons = this.generateElectrons(props.protons);
    this.electrons = electrons;

    this.group.add(new Mesh(new SphereGeometry(this.size, 100, 100), new MeshBasicMaterial())); // AtomBody
    electrons.forEach((electron) => this.group.add(electron.body));
  }

  generateLayers(props: IAtom) {
    let protons = props.protons;
    let placeInRing = 2;

    while (protons > 0) {
      this.layers++;
      if (protons >= placeInRing) {
        protons -= placeInRing;
        placeInRing *= 2;
      } else protons = 0;
    }

    this.group.add(
      ...Array.from(Array(this.layers).keys()).map((i) => {
        const geometry = new RingGeometry(this.size + (i + 1), this.size + (i + 1.1), 50, 50);
        const material = new MeshBasicMaterial({ side: DoubleSide });
        return new Mesh(geometry, material);
      })
    );
  }

  generateElectrons(protons: number) {
    const electrons: IElectron[] = [];

    for (let layer = 1; layer <= this.layers; layer++) {
      let size = Math.pow(2, layer);
      protons -= size;

      if (protons <= size && protons >= 0) size += protons;
      console.log(protons, size);

      for (let i = 0; i < size; i++) {
        const next = ((2 * Math.PI) / size) * i - Math.PI / 2;

        const x = Math.cos(next) * (this.size + layer);
        const y = Math.sin(next) * (this.size + layer);
        const position = new Vector3(x, y, 0);

        const body = new Mesh(new SphereGeometry(0.1, 100, 100), new MeshBasicMaterial({ color: 0x4b89f3 }));
        body.position.set(position.x, position.y, position.z);

        const electron = {
          layer: layer,
          angle: next,
          distance: this.size + layer,
          id: electrons.length,
          position: position,
          body: body,
        };

        electrons.push(electron);
      }
    }

    return electrons;
  }
}
