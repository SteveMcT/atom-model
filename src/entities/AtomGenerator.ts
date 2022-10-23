import IAtom from "./IAtom";

export default class AtomGenerator extends IAtom {
  constructor(props: IAtom) {
    super(props);
    this.generateCore();
    this.generateLayers();
    this.generateElectrons();
  }

  //TODO: Generate Atom Body based on Neutrons and Protons
}
