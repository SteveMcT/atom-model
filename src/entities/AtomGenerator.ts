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
    this.generateCore();
    this.generateLayers();
    this.generateElectrons();
  }

  generateLayers() {
    // calculate the number of layers
    let protons = this.nucleons;
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

  generateElectrons() {
    let nucleons = this.nucleons;
    const electrons: IElectron[] = [];

    for (let layer = 1; layer <= this.layers; layer++) {
      let size = Math.pow(2, layer);
      nucleons -= size;
      if (nucleons < 0) size += nucleons;

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

    this.electrons = electrons;
    this.electrons.forEach((electron) => this.group.add(electron.body));
  }

  generateCore() {
    const protonColor = 0x4a45e3;
    const neutronColor = 0xfa2503;

    const core = new Group();
    const multiplier = this.nucleons / 24;

    const r = 0.1;

    for (let i = 0; i <= this.nucleons; i++) {
      const geometry = new SphereGeometry(r, 100, 100);
      const material = new MeshBasicMaterial({ color: i % 2 == 0 ? protonColor : neutronColor });
      const body = new Mesh(geometry, material);

      const random = () => Math.random() * this.nucleons;

      const s = random();
      const t = random();
      const x = r * Math.cos(s) * Math.sin(t) * multiplier;
      const y = r * Math.sin(s) * Math.sin(t) * multiplier;
      const z = r * Math.cos(t) * multiplier;

      body.position.set(x, y, z);
      core.add(body);
    }

    this.group.add(core);
  }

  //TODO: Generate Atom Body based on Neutrons and Protons
}
