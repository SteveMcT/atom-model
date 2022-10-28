import {
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  RingGeometry,
  SphereGeometry,
  Vector3,
} from 'three';
import { default as Electron } from './Electron';
import IJSONAtom from './IJSONAtom';

export default class Atom {
  name: string;
  symbol: string;
  nucleons: number;
  size: number;
  layers: number = 0;
  rings: Mesh<RingGeometry, MeshBasicMaterial>[] = [];

  group = new Group();
  electrons: Electron[] = [];

  constructor(atomData: IJSONAtom) {
    this.name = atomData.name;
    this.symbol = atomData.symbol;
    this.nucleons = atomData.atomicNumber;
    this.size = 2;

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
        const geometry = new RingGeometry(
          this.size + (i + 1),
          this.size + (i + 1.02),
          (this.nucleons * 200) / this.nucleons,
          (this.nucleons * 200) / this.nucleons
        );
        const material = new MeshBasicMaterial({ side: DoubleSide });
        return new Mesh(geometry, material);
      })
    );
  }

  generateElectrons() {
    let nucleons = this.nucleons;
    const electrons = new Group();

    let layer = 0;
    const maxAllowed = [2, 8, 18, 32, 32, 18, 8];
    const electronsInLayer: number[] = [0, 0, 0, 0, 0, 0, 0, 0];

    for (let i = 0; i < nucleons; i++) {
      if (layer == 0) {
        electronsInLayer[0]++;
        if (electronsInLayer[0] == 2) layer++;
      } else {
        // 1. count up to 2
        if (electronsInLayer[layer] <= 1) {
          electronsInLayer[layer]++;
          i++;
        }
        console.log('Filled up to two!');
        console.log(electronsInLayer);
        console.log('------------------------');

        while (
          electronsInLayer[layer - 1] < maxAllowed[layer - 1] &&
          i < nucleons
        ) {
          electronsInLayer[layer - 1]++;
          i++;
        }
        console.log('Filled up layer before!');
        console.log(electronsInLayer);
        console.log('------------------------');

        // fill to 8
        while (electronsInLayer[layer] <= 7 && i < nucleons) {
          electronsInLayer[layer]++;
          i++;
        }
        console.log('Filled the current layer to eight!');
        console.log(electronsInLayer);
        console.log('------------------------');

        layer++;
      }
    }

    for (let layer = 1; layer <= this.layers; layer++) {
      //
      let size = Math.pow(2, layer + 1) * 2;

      nucleons -= size;
      if (nucleons < 0) size += nucleons;

      for (let i = 0; i < size; i++) {
        const next = ((2 * Math.PI) / size) * i - Math.PI / 2;

        const x = Math.cos(next) * (this.size + layer);
        const y = Math.sin(next) * (this.size + layer);
        const position = new Vector3(x, y, 0);

        const electron = new Electron(next, this.size + layer, layer, position);
        electrons.add(electron.body);
        this.electrons.push(electron);
      }
    }

    this.group.add(electrons);
  }

  generateCore() {
    const protonColor = 0x4a45e3;
    const neutronColor = 0xfa2503;

    const core = new Group();
    const multiplier = this.nucleons / 24;

    const r = 0.1;

    for (let i = 0; i <= this.nucleons; i++) {
      const geometry = new SphereGeometry(r, 100, 100);
      const material = new MeshBasicMaterial({
        color: i % 2 == 0 ? protonColor : neutronColor,
      });
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
}
