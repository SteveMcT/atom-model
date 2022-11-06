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
  angle = 0;
  rings: Mesh<RingGeometry, MeshBasicMaterial>[] = [];

  group = new Group();
  layerObjects = new Group();
  electrons: Electron[] = [];

  constructor(atomData: IJSONAtom) {
    this.name = atomData.name;
    this.symbol = atomData.symbol;
    this.nucleons = atomData.atomicNumber;
    this.size = 2;

    this.generateLayersWithElectrons();
    this.generateCore();
  }

  generateLayersWithElectrons() {
    // get electronic configuration, structure of the atom
    const atom = _atomStore.atomList.value.find((x) => x.name == this.name);

    if (atom) {
      const getElectronicConfiguration: any = (a = atom) => {
        let config = a.electronicConfiguration;
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

      // Calculate amount of electrons in each layer
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

    // add elements as objects to scene

    const material = new MeshBasicMaterial({ side: DoubleSide });
    const PI_DOUBLE = Math.PI * 2;
    const PI_HALF = Math.PI / 2;

    let l = 1;
    for (let electrons of this.layers) {
      if (electrons == 0) break;

      const fullLayer = new Group();

      const layerObject3D = new Mesh(
        new RingGeometry(
          this.size + l,
          this.size + l + 0.02,
          (this.nucleons * 200) / this.nucleons,
          (this.nucleons * 200) / this.nucleons
        ),
        material
      );

      fullLayer.add(layerObject3D);

      for (let i = 0; i < electrons; i++) {
        const next = (PI_DOUBLE / electrons) * i - PI_HALF;

        const x = Math.cos(next) * (this.size + l);
        const y = Math.sin(next) * (this.size + l);
        const position = new Vector3(x, y, 0);

        const electron = new Electron(next, this.size + l, position);
        fullLayer.add(electron.body);
        this.electrons.push(electron);
      }

      this.layerObjects.add(fullLayer);
      l++;
    }

    this.group.add(this.layerObjects);
  }

  generateCore() {
    const core = new Group();
    const protonColor = 0x4a45e3;
    const neutronColor = 0xfa2503;
    const r = 0.1;
    const geometry = new SphereGeometry(r, 100, 100);

    const multiplier = this.nucleons / 24;
    const random = () => Math.random() * this.nucleons;

    for (let i = 0; i <= this.nucleons; i++) {
      const material = new MeshBasicMaterial({
        color: i % 2 == 0 ? protonColor : neutronColor,
      });
      const body = new Mesh(geometry, material);

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

  animate() {
    this.layerObjects.children.map((l, i) => {
      if (_atomStore.enableRotate.value) {
        const rotationAngle = l.children.length / 800;
        l.rotation.z += rotationAngle;
        l.rotation.y += (rotationAngle / 2) * i + 0.02;
        l.rotation.x += (rotationAngle / 2) * i + 0.02;
      } else {
        l.rotation.x = 0;
        l.rotation.y = 0;
        l.rotation.z = 0;
      }

      // l.children.length / 600;
      // console.log(this.angle);

      // l.rotateY(this.angle);
      // l.setRotationFromAxisAngle(new Vector3(0, 0, 0), this.angle);
      // e.body.position.copy(this.position);
      // });
    });
  }
}
