import atoms from "./assets/atoms.json";
import Atom from "./entities/AtomGenerator";

export const generateAtom = (name: string) => {
  const atomData = atoms.find((a) => a.name == name)!;

  const atom = new Atom({ name: atomData.name, size: 0.5, symbol: atomData.symbol, nucleons: atomData.atomicNumber });
  return atom;
};
