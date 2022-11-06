import {
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  RingGeometry,
  SphereGeometry,
  Vector3,
} from 'three';
import _atomStore from '../stores/atom.store';
import { default as Electron } from './Electron';
import IJSONAtom from './IJSONAtom';

export default class Atom {
  name: string;
  symbol: string;
  nucleons: number;
  size: number;
  layers: number[] = [];
  rings: Mesh<RingGeometry, MeshBasicMaterial>[] = [];

  group = new Group();
  electrons: Electron[] = [];

  constructor(atomData: IJSONAtom) {
    this.name = atomData.name;
    this.symbol = atomData.symbol;
    this.nucleons = atomData.atomicNumber;
    this.size = 2;

    this.generateElectrons();
    this.generateCore();
    this.generateLayers();
  }

  // add Layers as 3DObjects
  generateLayers() {
    const material = new MeshBasicMaterial({ side: DoubleSide });

    let i = 0;
    for (let layer of this.layers) {
      if (layer != 0) {
        const geometry = new RingGeometry(
          this.size + (i + 1),
          this.size + (i + 1.02),
          (this.nucleons * 200) / this.nucleons,
          (this.nucleons * 200) / this.nucleons
        );
        this.group.add(new Mesh(geometry, material));
        i++;
      }
    }
  }

  generateElectrons() {
    const atom = _atomStore.atomList.value.find((x) => x.name == this.name);

    if (atom) {
      const getElectronicConfiguration: any = (a = atom) => {
        let config = a.electronicConfiguration;
        // console.log(config.replace(/\[\w*\]/, ''));
        if (!config.includes('[')) return config.replace(/\[\w*\]/, '');
        else {
          return config
            .replace(/\[\w*\]/, '')
            .concat(' ')
            .concat(
              getElectronicConfiguration(
                _atomStore.atomList.value.find(
                  (atom) =>
                    atom.symbol ==
                    a.electronicConfiguration.match(/(?<=\[).+?(?=\])/)?.at(0)!
                )
              )
            )
            .concat(' ');
        }
      };

      let electrons: string | string[] = getElectronicConfiguration() as string;
      electrons = electrons.replaceAll('  ', ' ').trim().split(' ');
      const sumPerLayer = [0, 0, 0, 0, 0, 0, 0];
      electrons.map((electron) => {
        const index = parseInt(electron.charAt(0)) - 1;
        const number = parseInt(electron.slice(2));

        sumPerLayer[index] += number;
      });
      this.layers = sumPerLayer;
    }

    // let usedElectrons = 0;
    // const maxAllowed = [2, 8, 18, 32, 50]; // maximal number of electrons in each layer
    // const electronsInLayer: number[] = [0, 0, 0, 0, 0];

    // const electrons = new Group();
    // let nucleons = this.nucleons;

    // for (let allowed of maxAllowed) {
    //   if (allowed >= usedElectrons) {
    //     electronsInLayer[this.layers] = allowed;
    //     usedElectrons += allowed;
    //     this.layers++;
    //   } else {
    //   }
    // }

    // for (let i = 0; i <= nucleons; i++) {
    //   if (this.layers == 0) {
    //     electronsInLayer[this.layers]++;
    //     if (electronsInLayer[this.layers] != 2) this.layers++;
    //   } else {
    //     // 1. count up to 2
    //     if (electronsInLayer[this.layers] <= 2) {
    //       electronsInLayer[this.layers]++, i++;
    //     }
    //     while (
    //       electronsInLayer[this.layers - 1] < maxAllowed[this.layers - 1] &&
    //       i < nucleons
    //     ) {
    //       electronsInLayer[this.layers - 1]++;
    //       i++;
    //     }
    //     // fill to 8
    //     while (electronsInLayer[this.layers] <= 7 && i < nucleons) {
    //       electronsInLayer[this.layers]++;
    //       i++;
    //     }

    //     this.layers++;
    //

    const electrons = new Group();

    let l = 0;
    for (let layer of this.layers) {
      if (layer == 0) break;

      for (let i = 0; i < layer; i++) {
        const next = ((2 * Math.PI) / layer) * i - Math.PI / 2;

        const x = Math.cos(next) * (this.size + l);
        const y = Math.sin(next) * (this.size + l);
        const position = new Vector3(x, y, 0);

        const electron = new Electron(next, this.size + layer, layer, position);
        electrons.add(electron.body);
        this.electrons.push(electron);
      }
      l++;
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
