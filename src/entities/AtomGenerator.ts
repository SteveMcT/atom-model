import { Color, DoubleSide, Group, Mesh, MeshBasicMaterial, RingGeometry, SphereGeometry, Vector3 } from "three";
import atoms from "../assets/atoms.json";
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

    this.electrons = this.generateElectrons(props.protons);

    const color = (atoms.find((a) => a.name == props.name)?.cpkHexColor || "FFFFFF").toLowerCase();

    this.group.add(new Mesh(new SphereGeometry(this.size, 100, 100), new MeshBasicMaterial({ color: new Color(color) })));
    this.electrons.forEach((electron) => this.group.add(electron.body));
  }

  generateLayers(props: IAtom) {
    // calculate the number of layers
    let protons = props.protons;
    let placeInRing = 2;

    while (protons > 0) {
      this.layers++;
      if (protons >= placeInRing) {
        protons -= placeInRing;
        placeInRing *= 2;
      } else protons = 0;
    }

    // add the layers as 3DObjects
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
      if (protons < 0) size += protons;

      for (let i = 0; i < size; i++) {
        const next = ((2 * Math.PI) / size) * i - Math.PI / 2;

        const x = Math.cos(next) * (this.size + layer);
        const y = Math.sin(next) * (this.size + layer);
        const position = new Vector3(x, y, 0);

        const body = new Mesh(new SphereGeometry(0.1, 100, 100), new MeshBasicMaterial({ color: 0x9ae5f3 }));
        body.position.copy(position);

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

  //TODO: Generate Atom Body based on Neutrons and Protons
}
