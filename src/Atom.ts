import Atom from "./entities/AtomGenerator";
import IJSONAtom from "./entities/IJSONAtom";

export const generateAtom = (atomData: IJSONAtom) => {
  const atom = new Atom({ name: atomData.name, size: 0.5, symbol: atomData.symbol, nucleons: atomData.atomicNumber });
  return atom;
};
